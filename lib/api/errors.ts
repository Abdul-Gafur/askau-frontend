/**
 * AskAU API Error Classes
 *
 * Provides a typed error hierarchy for all API communication failures.
 * Error details must never expose:
 * - Stack traces (in production)
 * - Internal server details
 * - Database information
 * - Authentication tokens
 * - Secrets
 */

import type { ApiErrorCode } from "@/types/api";

/** Base class for all AskAU API errors */
export class AskAUApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;
  public readonly correlationId?: string;
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(
    code: ApiErrorCode,
    message: string,
    statusCode: number,
    correlationId?: string,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "AskAUApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.correlationId = correlationId;
    this.fieldErrors = fieldErrors;
  }
}

/** HTTP 401 — User is not authenticated */
export class UnauthorizedError extends AskAUApiError {
  constructor(correlationId?: string) {
    super("UNAUTHORIZED", "Authentication required", 401, correlationId);
    this.name = "UnauthorizedError";
  }
}

/** HTTP 403 — User is authenticated but not permitted */
export class ForbiddenError extends AskAUApiError {
  constructor(correlationId?: string) {
    super("FORBIDDEN", "Access denied", 403, correlationId);
    this.name = "ForbiddenError";
  }
}

/** HTTP 404 — Resource not found */
export class NotFoundError extends AskAUApiError {
  constructor(resource?: string, correlationId?: string) {
    super("NOT_FOUND", resource ? `${resource} not found` : "Not found", 404, correlationId);
    this.name = "NotFoundError";
  }
}

/** HTTP 422 — Validation error */
export class ValidationError extends AskAUApiError {
  constructor(
    message: string,
    fieldErrors?: Record<string, string[]>,
    correlationId?: string,
  ) {
    super("VALIDATION_ERROR", message, 422, correlationId, fieldErrors);
    this.name = "ValidationError";
  }
}

/** HTTP 429 — Rate limited */
export class RateLimitedError extends AskAUApiError {
  public readonly retryAfter?: number;

  constructor(retryAfter?: number, correlationId?: string) {
    super("RATE_LIMITED", "Too many requests. Please slow down.", 429, correlationId);
    this.name = "RateLimitedError";
    this.retryAfter = retryAfter;
  }
}

/** Network/connectivity error */
export class NetworkError extends AskAUApiError {
  constructor(message = "Network error — check your connection") {
    super("NETWORK_ERROR", message, 0);
    this.name = "NetworkError";
  }
}

/** Request timeout */
export class TimeoutError extends AskAUApiError {
  constructor() {
    super("TIMEOUT", "Request timed out", 408);
    this.name = "TimeoutError";
  }
}

/** HTTP 5xx — Server error */
export class ServerError extends AskAUApiError {
  constructor(statusCode = 500, correlationId?: string) {
    super(
      "SERVER_ERROR",
      "A server error occurred. Please try again later.",
      statusCode,
      correlationId,
    );
    this.name = "ServerError";
  }
}

/** Unknown error fallback */
export class UnknownApiError extends AskAUApiError {
  constructor(originalMessage?: string) {
    super(
      "UNKNOWN_ERROR",
      // Never expose originalMessage in production — it may contain sensitive info
      process.env["NODE_ENV"] === "development"
        ? (originalMessage ?? "Unknown error")
        : "An unexpected error occurred",
      0,
    );
    this.name = "UnknownApiError";
  }
}

/**
 * Determines if an error is an AskAU API error.
 */
export function isApiError(error: unknown): error is AskAUApiError {
  return error instanceof AskAUApiError;
}

/**
 * Maps an HTTP status code to the appropriate error class.
 * Used internally by the API client.
 */
export function createApiErrorFromStatus(
  statusCode: number,
  body: { message?: string; code?: ApiErrorCode; correlationId?: string; fieldErrors?: Record<string, string[]> },
): AskAUApiError {
  const { message, correlationId, fieldErrors } = body;

  switch (statusCode) {
    case 401:
      return new UnauthorizedError(correlationId);
    case 403:
      return new ForbiddenError(correlationId);
    case 404:
      return new NotFoundError(undefined, correlationId);
    case 422:
      return new ValidationError(
        message ?? "Validation failed",
        fieldErrors,
        correlationId,
      );
    case 429:
      return new RateLimitedError(undefined, correlationId);
    default:
      if (statusCode >= 500) {
        return new ServerError(statusCode, correlationId);
      }
      return new UnknownApiError(message);
  }
}
