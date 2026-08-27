/**
 * AskAU API Client
 *
 * Central HTTP client for all communication with the AskAU Platform API.
 *
 * Features:
 * - Typed request/response
 * - Authentication token injection
 * - Retry with exponential backoff (idempotent requests only)
 * - Request timeout + cancellation (AbortController)
 * - Consistent error handling
 * - Streaming-ready (for future chat streaming)
 * - Mock mode (dev/test without real backend)
 *
 * SECURITY NOTES:
 * ────────────────────────────────────────────────────────────────────
 * - The API client communicates ONLY with the AskAU Platform API.
 * - It must NEVER communicate directly with LLMs, vector DBs, or
 *   any infrastructure service.
 * - Auth tokens are injected server-side where possible.
 * - Never log request bodies that may contain sensitive content.
 * ────────────────────────────────────────────────────────────────────
 */

import { NetworkError, TimeoutError, UnknownApiError, createApiErrorFromStatus } from "./errors";
import type { ApiErrorCode } from "@/types/api";
import { logger } from "@/lib/logger";

/** API client configuration */
export interface ApiClientConfig {
  baseUrl: string;
  timeoutMs?: number;
  maxRetries?: number;
  /** Whether to use mock data instead of real API */
  useMock?: boolean;
}

/** Request options passed to each API call */
export interface RequestOptions {
  /** AbortSignal for request cancellation */
  signal?: AbortSignal;
  /** Request-specific timeout override (ms) */
  timeoutMs?: number;
  /** Skip retry logic for this request */
  noRetry?: boolean;
  /** Additional headers */
  headers?: Record<string, string>;
}

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 2;

/**
 * Determines if the environment is using mock mode.
 * Mock mode is enabled when:
 * 1. NEXT_PUBLIC_USE_MOCK_API=true in env, OR
 * 2. Running in tests (VITEST=true)
 *
 * Never allow mock mode in production.
 */
function isMockMode(): boolean {
  if (process.env["NODE_ENV"] === "production") return false;
  return process.env["NEXT_PUBLIC_USE_MOCK_API"] === "true" || process.env["VITEST"] === "true";
}

/**
 * Creates the AskAU API client instance.
 *
 * In development/test: uses mock handlers if NEXT_PUBLIC_USE_MOCK_API=true.
 * In production: communicates with the real AskAU Platform API.
 */
function createApiClient(config: ApiClientConfig) {
  const {
    baseUrl,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxRetries = DEFAULT_MAX_RETRIES,
    useMock = isMockMode(),
  } = config;

  /**
   * Core fetch wrapper with timeout, retry, and error handling.
   */
  async function fetchWithRetry(
    url: string,
    init: RequestInit,
    options: RequestOptions = {},
    attempt = 0,
  ): Promise<Response> {
    const { signal, timeoutMs: requestTimeoutMs, noRetry } = options;
    const timeout = requestTimeoutMs ?? timeoutMs;

    // Create a timeout controller that merges with any external signal
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // If caller provides a signal, abort when it aborts too
    signal?.addEventListener("abort", () => controller.abort());

    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // Distinguish timeout from caller cancellation
        if (!signal?.aborted) {
          throw new TimeoutError();
        }
        throw error; // Caller cancelled — re-throw
      }
      // Network failure
      if (
        !noRetry &&
        attempt < maxRetries &&
        error instanceof TypeError // fetch network error
      ) {
        const backoffMs = Math.min(1000 * 2 ** attempt, 8000);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        return fetchWithRetry(url, init, options, attempt + 1);
      }
      throw new NetworkError();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Processes a Response and throws typed errors for non-2xx status codes.
   */
  async function processResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }
      try {
        return (await response.json()) as T;
      } catch {
        throw new UnknownApiError("Failed to parse response");
      }
    }

    // Parse error body (best effort — never throw on parse failure)
    let errorBody: {
      message?: string;
      code?: ApiErrorCode;
      correlationId?: string;
      fieldErrors?: Record<string, string[]>;
    } = {};
    try {
      errorBody = (await response.json()) as typeof errorBody;
    } catch {
      // Ignore parse errors for error bodies
    }

    throw createApiErrorFromStatus(response.status, errorBody);
  }

  /**
   * Builds the full URL for a given path.
   */
  function buildUrl(path: string): string {
    const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalizedPath}`;
  }

  /**
   * Core request method.
   */
  async function request<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    if (useMock) {
      // Lazy-load mock handlers to avoid bundling them in production
      const { handleMockRequest } = await import("./mock/handlers");
      return handleMockRequest<T>(method, path, body);
    }

    const url = buildUrl(path);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    const isIdempotent = method === "GET" || method === "DELETE";

    const response = await fetchWithRetry(
      url,
      {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        credentials: "same-origin",
      },
      {
        ...options,
        noRetry: options.noRetry ?? !isIdempotent,
      },
    );

    return processResponse<T>(response);
  }

  return {
    get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, undefined, options),

    post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>("POST", path, body, options),

    put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>("PUT", path, body, options),

    patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>("PATCH", path, body, options),

    delete: <T>(path: string, options?: RequestOptions) =>
      request<T>("DELETE", path, undefined, options),

    /**
     * Streaming request — returns a ReadableStream.
     * Prepared for future chat streaming. Not implemented in Phase 1.
     * @future Phase 2
     */
    stream: async (
      path: string,
      body: unknown,
      options?: RequestOptions,
    ): Promise<ReadableStream> => {
      if (useMock) {
        logger.warn("Stream not available in mock mode");
        throw new Error("Streaming not supported in mock mode");
      }
      const url = buildUrl(path);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(body),
        signal: options?.signal,
        credentials: "same-origin",
      });
      if (!response.ok) {
        await processResponse(response);
      }
      if (!response.body) {
        throw new UnknownApiError("No response body");
      }
      return response.body;
    },
  };
}

/**
 * Singleton API client instance.
 *
 * Configuration is driven entirely by environment variables.
 * See .env.example for all required variables.
 */
export const apiClient = createApiClient({
  baseUrl: process.env["NEXT_PUBLIC_API_BASE_URL"] ?? "/api",
  timeoutMs: Number(process.env["NEXT_PUBLIC_API_TIMEOUT_MS"] ?? DEFAULT_TIMEOUT_MS),
  maxRetries: Number(process.env["NEXT_PUBLIC_API_MAX_RETRIES"] ?? DEFAULT_MAX_RETRIES),
});

export type ApiClient = ReturnType<typeof createApiClient>;
