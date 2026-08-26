/**
 * Common shared types used throughout the AskAU application.
 */

/** ISO 8601 date-time string */
export type ISODateTime = string;

/** Unique identifier (UUID) */
export type ID = string;

/** Pagination metadata returned by list endpoints */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Generic paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

/** Sort order */
export type SortOrder = "asc" | "desc";

/** Environment type */
export type Environment = "development" | "staging" | "production";

/** Supported locale codes */
export type LocaleCode = "en" | "fr" | "ar" | "pt";

/** Text direction */
export type TextDirection = "ltr" | "rtl";

/** Theme mode */
export type ThemeMode = "light" | "dark" | "system";

/** Loading state */
export type LoadingState = "idle" | "loading" | "success" | "error";

/** Severity levels */
export type Severity = "info" | "success" | "warning" | "error";
