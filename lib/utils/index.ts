import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 * Combines clsx (conditional class logic) with tailwind-merge (conflict resolution).
 *
 * Usage:
 *   cn("px-4 py-2", isActive && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string to a locale-aware display string.
 */
export function formatDate(
  date: string | Date,
  locale = "en",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(d);
}

/**
 * Formats a date as a relative time string (e.g., "2 hours ago").
 */
export function formatRelativeTime(date: string | Date, locale = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffSeconds < 60) return rtf.format(-diffSeconds, "second");
  if (diffSeconds < 3600) return rtf.format(-Math.floor(diffSeconds / 60), "minute");
  if (diffSeconds < 86400) return rtf.format(-Math.floor(diffSeconds / 3600), "hour");
  if (diffSeconds < 2592000) return rtf.format(-Math.floor(diffSeconds / 86400), "day");
  return formatDate(d, locale);
}

/**
 * Truncates a string to a maximum length, adding ellipsis if truncated.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Generates a random ID for temporary client-side use.
 * Not suitable for production IDs — use server-generated UUIDs.
 */
export function generateClientId(): string {
  return `cid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Returns true if the code is running in a browser environment.
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Safely parses JSON, returning null on parse errors.
 * Never throws.
 */
export function safeJsonParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
