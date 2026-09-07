/**
 * Server-side proxy to the AskAU backend.
 *
 * The frontend sends every request to NEXT_PUBLIC_API_BASE_URL ("/api") with
 * `credentials: "same-origin"` and never sets an Authorization header. This
 * handler is what turns that into an authenticated call: it runs on the server,
 * reads the session, attaches a bearer token, and forwards to the API.
 *
 * The bearer never reaches the browser. That is the whole point of doing this
 * here rather than in the client — a token in a browser bundle is a token in
 * everyone's devtools.
 *
 * ── Development identities ──────────────────────────────────────────────────
 * With NEXT_PUBLIC_USE_MOCK_API=true the token comes from `.dev-tokens.json`,
 * keyed by the username signed in with. That file is generated from the
 * backend's seeded users and is gitignored; it exists so permission-aware
 * retrieval can be exercised through the interface by signing in as different
 * staff, which is the only way to see an ACL working from a reader's side.
 *
 * In a real deployment it reads the Entra access token out of the encrypted
 * NextAuth JWT — see the `jwt` callback in lib/auth/config.ts. Both paths
 * converge on the same line: attach a bearer, server-side, and forward.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { auth } from "@/lib/auth/config";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND = process.env.ASKAU_API_URL ?? "http://127.0.0.1:8080";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

type DevIdentity = { email: string; name: string; token: string };

/**
 * Read per request, deliberately uncached.
 *
 * A module-level cache saved one small synchronous read and cost a debugging
 * detour: the tokens were re-minted on disk and this kept serving the expired
 * ones, which surfaced as a 401 that looked like a session problem. Dev-only
 * code that makes dev harder is not worth the microseconds.
 */
function loadDevTokens(): Record<string, DevIdentity> {
  try {
    const file = path.join(process.cwd(), ".dev-tokens.json");
    return JSON.parse(readFileSync(file, "utf8")) as Record<string, DevIdentity>;
  } catch {
    return {};
  }
}

/**
 * The bearer for this request, or null when there is no usable identity.
 *
 * Returning null rather than forwarding unauthenticated: the backend would
 * answer 401 either way, but a proxy that silently drops the credential turns
 * "you are signed out" into "the API is broken".
 */
async function bearerFor(request: NextRequest): Promise<string | null> {
  if (USE_MOCK) {
    const session = await auth();
    if (!session?.user) return null;
    const tokens = loadDevTokens();
    // The mock provider puts the submitted username in `name`, so signing in
    // as "staff.legal" gets that person's access list rather than a fixed one.
    const key = (session.user.name ?? "").trim();
    const identity = tokens[key] ?? tokens["staff.finance"];
    return identity?.token ?? null;
  }

  // Read the raw JWT, not the session.
  //
  // `auth()` returns whatever the `session` callback chose to expose, and that
  // object is served to the browser by /api/auth/session — so the access token
  // is deliberately absent from it. `getToken` decrypts the cookie here on the
  // server and hands back the full token, which is the only place the bearer
  // is supposed to exist.
  const jwt = await getToken({
    req: request,
    secret: process.env["NEXTAUTH_SECRET"] ?? process.env["AUTH_SECRET"] ?? "",
    salt: request.cookies.has("__Secure-authjs.session-token")
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
    secureCookie: request.cookies.has("__Secure-authjs.session-token"),
  });
  const token = (jwt as { accessToken?: string } | null)?.accessToken;
  return token ?? null;
}

async function forward(request: NextRequest, segments: string[]): Promise<Response> {
  // `/api/auth/*` is NextAuth's and is handled by its own route; anything that
  // reaches here under that prefix is a mistake worth surfacing rather than
  // proxying into the backend, which has its own auth routes at /api/v1/auth.
  if (segments[0] === "auth") {
    return NextResponse.json({ message: "Handled by NextAuth" }, { status: 404 });
  }

  const bearer = await bearerFor(request);
  if (!bearer) {
    return NextResponse.json({ message: "Not signed in.", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const url = new URL(`${BACKEND}/api/${segments.join("/")}`);
  url.search = request.nextUrl.search;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${bearer}`);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const accept = request.headers.get("accept");
  if (accept) headers.set("accept", accept);

  const body =
    request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();

  const upstream = await fetch(url, {
    method: request.method,
    headers,
    body,
    // Streamed responses must not be buffered — the SSE endpoints depend on it.
    cache: "no-store",
    redirect: "manual",
  });

  // Passed through as a stream so `text/event-stream` stays incremental. A
  // buffered proxy would make progress events arrive all at once at the end,
  // which is worse than not having them.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
      ...(upstream.headers.get("location")
        ? { location: upstream.headers.get("location") as string }
        : {}),
    },
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, ctx: Ctx) {
  return forward(request, (await ctx.params).path);
}
export async function POST(request: NextRequest, ctx: Ctx) {
  return forward(request, (await ctx.params).path);
}
export async function PATCH(request: NextRequest, ctx: Ctx) {
  return forward(request, (await ctx.params).path);
}
export async function PUT(request: NextRequest, ctx: Ctx) {
  return forward(request, (await ctx.params).path);
}
export async function DELETE(request: NextRequest, ctx: Ctx) {
  return forward(request, (await ctx.params).path);
}
