/**
 * Middleware — Route protection + i18n routing
 *
 * Handles two concerns:
 * 1. Authentication: Redirects unauthenticated users to /login
 * 2. Internationalization: Routes requests to the correct locale
 *
 * Route protection rules:
 * - Public routes (login, unauthorized): accessible without auth
 * - Protected routes (/chat, /conversations, /settings): require auth
 * - Admin routes (/admin): require auth + admin role (backend authoritative)
 * - API routes (/api/auth/*): managed by NextAuth, not this middleware
 *
 * SECURITY NOTE:
 * This middleware provides a UX redirect for unauthenticated users.
 * It is NOT the security boundary — that is enforced by the backend API
 * and server-side authentication checks in Server Components/Actions.
 */

import { auth } from "@/lib/auth/config";
import createNextIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createNextIntlMiddleware(routing);

/** Routes that do not require authentication */
const PUBLIC_PATHS = ["/login", "/unauthorized", "/api/auth"];

/** Routes that require authentication */
const PROTECTED_PATTERNS = ["/chat", "/conversations", "/settings", "/admin"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`/${pathname.split("/")[1] ?? ""}${p}`),
  );
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATTERNS.some(
    (p) => pathname.includes(p),
  );
}

export default auth(async function proxy(
  req: NextRequest & { auth: { user?: { email: string } } | null },
) {
  const { pathname } = req.nextUrl;

  // Always allow NextAuth API routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Apply i18n routing
  const intlResponse = intlMiddleware(req);

  // Check auth for protected paths
  const isAuthenticated = Boolean(req.auth?.user);

  if (isProtectedPath(pathname) && !isAuthenticated && !isPublicPath(pathname)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return intlResponse;
});

export const config = {
  // Match all pathnames except API routes, static files, _next internals, and favicon
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|images|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)",
  ],
};
