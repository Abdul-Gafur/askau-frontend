/**
 * Session utilities for server-side usage.
 *
 * Use these helpers in Server Components, Route Handlers, and middleware
 * to access the current session.
 *
 * SECURITY NOTE:
 * - Never expose raw auth tokens to the client.
 * - Use server-side auth() for protected API calls.
 * - The session returned to the client contains only safe display fields.
 */

import { auth } from "./config";
import type { Session } from "next-auth";

/**
 * Get the current session on the server.
 * Returns null if the user is not authenticated.
 */
export async function getServerSession(): Promise<Session | null> {
  return await auth();
}

/**
 * Get the current user from the server session.
 * Returns null if the user is not authenticated.
 */
export async function getServerUser(): Promise<Session["user"] | null> {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Assert that the current request is authenticated.
 * Throws an error (redirect-compatible) if not.
 *
 * Use in Server Components and Route Handlers that require authentication.
 */
export async function requireServerAuth(): Promise<Session> {
  const session = await auth();
  if (!session) {
    // In Next.js App Router, redirect() throws a special error — do not catch it.
    throw new Error("UNAUTHENTICATED");
  }
  return session;
}

/**
 * Check if the current session is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user);
}
