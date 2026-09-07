/**
 * Settings that are real, as distinct from the ones that are rendered.
 *
 * The modal has six sections. Three of its controls reach a backend that
 * enforces them; the rest are either the identity platform's to answer (MFA,
 * session lifetime, active sessions) or genuinely unbuilt (notifications). This
 * module covers only the first group, deliberately — a toggle wired to a call
 * that does nothing is worse than one wired to nothing at all, because it looks
 * settled.
 */

import { env } from "@/config/environment";
import * as mock from "@/features/settings/lib/mock-backend";

/** See the note in features/chat/lib/backend.ts — same flag, same reasoning. */
const USE_MOCK = env.useMockApi;

const BASE = "/api/v1";

export type Preferences = {
  saveHistory: boolean;
  shareAnalytics: boolean;
  higherIntelligence: boolean;
};

export type KnowledgeBase = {
  id: string;
  name: string;
  department: string;
  sourceType: string;
  status: string;
  documentCount: number;
  lastSyncedAt: string | null;
  lastSyncStatus: string | null;
};

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* a non-JSON body is not worth a second failure */
    }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function getPreferences(): Promise<Preferences> {
  if (USE_MOCK) return mock.getPreferences();
  return call<Preferences>("/users/me/preferences");
}

/**
 * Change one or more preferences.
 *
 * A partial body on purpose: the backend leaves omitted fields alone, so
 * flipping one toggle cannot silently rewrite the others from whatever this
 * client last read. That matters most for the privacy toggles — the failure
 * mode is a setting switching itself back on.
 */
export function setPreferences(patch: Partial<Preferences>): Promise<Preferences> {
  if (USE_MOCK) return mock.setPreferences(patch);
  return call<Preferences>("/users/me/preferences", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

/** Returns how many conversations were removed. Scoped to the caller. */
export function deleteAllHistory(): Promise<{ deleted: number }> {
  if (USE_MOCK) return mock.deleteAllHistory();
  return call<{ deleted: number }>("/users/me/history", { method: "DELETE" });
}

/**
 * The knowledge bases this reader can actually be answered from.
 *
 * `documentCount` is *their* count, not the repository's — two people see
 * different numbers for the same source, and a source they can reach nothing in
 * is absent rather than listed as empty. Read-only: switching a source on is an
 * approval act belonging to a knowledge administrator.
 *
 * Note there is no version. `knowledge_sources` has no such column because a
 * revision concept was never built, and a plausible-looking number displayed as
 * provenance is the one thing this product cannot be casual about.
 */
export async function listKnowledgeBases(): Promise<KnowledgeBase[]> {
  if (USE_MOCK) return mock.listKnowledgeBases();
  const body = await call<{ items: KnowledgeBase[] }>("/knowledge-bases");
  return body.items;
}
