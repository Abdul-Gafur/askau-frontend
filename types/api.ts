import type { ID, ISODateTime } from "./common";

/**
 * API error types and response structures.
 *
 * These mirror the expected AskAU Platform API error contract.
 * Update as the backend API contract is finalized.
 */

/** Standard API error codes */
export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

/** API error response body */
export interface ApiError {
  code: ApiErrorCode;
  message: string;
  /** Field-level validation errors */
  fieldErrors?: Record<string, string[]>;
  /** Request correlation ID for support tracing */
  correlationId?: string;
}

/** Generic paginated list response */
export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Health check response */
export interface HealthResponse {
  status: "ok" | "degraded" | "down";
  version: string;
  timestamp: ISODateTime;
  services?: Record<string, "ok" | "degraded" | "down">;
}

/** Request ID for correlation */
export interface WithRequestId {
  requestId: ID;
}
