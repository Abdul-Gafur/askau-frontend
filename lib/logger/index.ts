/**
 * AskAU Frontend Logger
 *
 * Safe logging abstraction that:
 * - Prevents logging of sensitive data
 * - Differentiates dev vs production behavior
 * - Provides structured logging interface
 *
 * SECURITY RULES — NEVER LOG:
 * - Passwords or credentials
 * - Access tokens or refresh tokens
 * - Session secrets
 * - Full chat message content in production
 * - User PII beyond what is necessary for debugging
 * - Document contents
 * - Internal API keys
 *
 * In production, only warn/error logs are emitted.
 * In development, all log levels are emitted.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

const isDev = process.env["NODE_ENV"] === "development";

/**
 * Redacts sensitive fields from an object before logging.
 * Add additional patterns as needed.
 */
function redactSensitive(data: Record<string, unknown>): Record<string, unknown> {
  const SENSITIVE_KEYS = new Set([
    "password",
    "token",
    "accessToken",
    "refreshToken",
    "secret",
    "clientSecret",
    "apiKey",
    "authorization",
    "cookie",
    "sessionId",
  ]);

  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey) || SENSITIVE_KEYS.has(key)) {
      redacted[key] = "[REDACTED]";
    } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      redacted[key] = redactSensitive(value as Record<string, unknown>);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

function formatEntry(entry: LogEntry): string {
  const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
  if (entry.data) {
    return `${base} ${JSON.stringify(entry.data)}`;
  }
  return base;
}

function log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
  // In production, suppress debug and info
  if (!isDev && (level === "debug" || level === "info")) return;

  const entry: LogEntry = {
    level,
    message,
    data: data ? redactSensitive(data) : undefined,
    timestamp: new Date().toISOString(),
  };

  const formatted = formatEntry(entry);

  switch (level) {
    case "debug":
    case "info":
      // eslint-disable-next-line no-console
      console.info(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "error":
      console.error(formatted);
      break;
  }
}

export const logger = {
  debug: (message: string, data?: Record<string, unknown>) => log("debug", message, data),
  info: (message: string, data?: Record<string, unknown>) => log("info", message, data),
  warn: (message: string, data?: Record<string, unknown>) => log("warn", message, data),
  error: (message: string, data?: Record<string, unknown>) => log("error", message, data),
};
