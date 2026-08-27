/**
 * Mock API Handlers
 *
 * DEVELOPMENT AND TESTING ONLY.
 *
 * WARNING: This file is NEVER loaded in production.
 *   - isMockMode() returns false when NODE_ENV=production.
 *   - The API client lazy-loads this file only in dev/test.
 *   - Do NOT import this file directly from production code paths.
 *
 * How to add a new mock:
 * 1. Add a case in the switch statement below.
 * 2. Return mock data from the appropriate MOCK_* constant.
 * 3. Optionally add artificial delay to simulate latency.
 *
 * How to switch between mock and real API:
 * - Set NEXT_PUBLIC_USE_MOCK_API=true in .env.local → mock mode
 * - Remove or set NEXT_PUBLIC_USE_MOCK_API=false      → real API
 */

import { MOCK_USER, MOCK_CONVERSATIONS, MOCK_MESSAGES } from "./data";

/** Artificial delay to simulate network latency in development */
const MOCK_LATENCY_MS = Number(process.env["NEXT_PUBLIC_MOCK_LATENCY_MS"] ?? 400);

async function simulateLatency(): Promise<void> {
  if (MOCK_LATENCY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  }
}

/**
 * Handles a mock API request.
 * Routes by method + path to the appropriate mock response.
 */
export async function handleMockRequest<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  await simulateLatency();

  // Normalize path — strip query string
  const cleanPath = path.split("?")[0] ?? path;

  // Health check
  if (method === "GET" && cleanPath === "/health") {
    return {
      status: "ok",
      version: "0.1.0-mock",
      timestamp: new Date().toISOString(),
    } as T;
  }

  // Conversations list
  if (method === "GET" && cleanPath === "/conversations") {
    return {
      items: MOCK_CONVERSATIONS,
      total: MOCK_CONVERSATIONS.length,
      page: 1,
      pageSize: 20,
      hasMore: false,
    } as T;
  }

  // Single conversation
  const conversationMatch = cleanPath.match(/^\/conversations\/([^/]+)$/);
  if (conversationMatch) {
    const id = conversationMatch[1];
    if (method === "GET") {
      const conv = MOCK_CONVERSATIONS.find((c) => c.id === id);
      if (!conv) throw new Error("NOT_FOUND");
      return conv as T;
    }
  }

  // Messages for a conversation
  const messagesMatch = cleanPath.match(/^\/conversations\/([^/]+)\/messages$/);
  if (messagesMatch) {
    const id = messagesMatch[1];
    if (method === "GET") {
      const messages = MOCK_MESSAGES.filter((m) => m.conversationId === id);
      return {
        items: messages,
        total: messages.length,
        page: 1,
        pageSize: 50,
        hasMore: false,
      } as T;
    }
    if (method === "POST") {
      // Simulate chat response
      const chatBody = body as { message: string };
      return {
        conversationId: id,
        messageId: `msg-${Date.now()}`,
        content: `[Mock Response] You asked: "${chatBody?.message ?? ""}". This is a simulated AskAU response. The real AI-powered response will be provided by the AskAU Platform API in production.`,
        citationIds: [],
        createdAt: new Date().toISOString(),
      } as T;
    }
  }

  // Current user profile
  if (method === "GET" && cleanPath === "/users/me") {
    return MOCK_USER as T;
  }

  // Feedback
  if (method === "POST" && cleanPath.includes("/feedback")) {
    return { success: true } as T;
  }

  // Fallback — return empty success
  console.warn(`[Mock API] Unhandled: ${method} ${cleanPath}`);
  return {} as T;
}
