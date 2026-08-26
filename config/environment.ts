/**
 * Environment configuration.
 *
 * CLIENT-SAFE configuration (NEXT_PUBLIC_*) vs SERVER-ONLY configuration.
 *
 * ════════════════════════════════════════════════════════════════
 * CLIENT-SAFE (can be used in browser):
 *   NEXT_PUBLIC_APP_URL
 *   NEXT_PUBLIC_API_BASE_URL
 *   NEXT_PUBLIC_APP_VERSION
 *   NEXT_PUBLIC_USE_MOCK_API
 *   NEXT_PUBLIC_MOCK_LATENCY_MS
 *   NEXT_PUBLIC_API_TIMEOUT_MS
 *   NEXT_PUBLIC_API_MAX_RETRIES
 *
 * SERVER-ONLY (must NEVER use NEXT_PUBLIC_ prefix):
 *   NEXTAUTH_SECRET           — NextAuth signing secret
 *   ENTRA_CLIENT_ID           — Microsoft Entra App (client) ID
 *   ENTRA_CLIENT_SECRET       — Microsoft Entra App secret
 *   ENTRA_TENANT_ID           — Microsoft Entra tenant ID
 *   NEXTAUTH_URL              — Full URL of the application
 *
 * NEVER expose server-only config to the client.
 * NEVER commit .env.local or any file containing real secrets.
 * ════════════════════════════════════════════════════════════════
 */

export const env = {
  // Client-safe
  appUrl: process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000",
  apiBaseUrl: process.env["NEXT_PUBLIC_API_BASE_URL"] ?? "/api",
  appVersion: process.env["NEXT_PUBLIC_APP_VERSION"] ?? "0.1.0",
  useMockApi: process.env["NEXT_PUBLIC_USE_MOCK_API"] === "true",
  mockLatencyMs: Number(process.env["NEXT_PUBLIC_MOCK_LATENCY_MS"] ?? 400),
  apiTimeoutMs: Number(process.env["NEXT_PUBLIC_API_TIMEOUT_MS"] ?? 30000),

  // Derived
  isDev: process.env["NODE_ENV"] === "development",
  isProd: process.env["NODE_ENV"] === "production",
  isTest: process.env["NODE_ENV"] === "test" || process.env["VITEST"] === "true",
} as const;

/** Validates that required environment variables are present. Server-side only. */
export function validateServerEnv(): void {
  const required = [
    "NEXTAUTH_SECRET",
    "ENTRA_CLIENT_ID",
    "ENTRA_CLIENT_SECRET",
    "ENTRA_TENANT_ID",
  ];

  if (env.isProd) {
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required server environment variables: ${missing.join(", ")}. ` +
          "See .env.example for required values.",
      );
    }
  }
}
