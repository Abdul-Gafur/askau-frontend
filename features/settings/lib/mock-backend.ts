/**
 * Frontend-only implementation of features/settings/lib/backend.ts.
 *
 * Used when NEXT_PUBLIC_USE_MOCK_API=true. Preferences are held in
 * localStorage rather than module scope: a toggle that forgets itself on
 * reload reads as a broken save, which is the one impression these three
 * controls must not give — they are the ones that actually enforce something.
 */

import { env } from "@/config/environment";
import { clearConversations } from "@/features/chat/lib/mock-backend";
import type { KnowledgeBase, Preferences } from "@/features/settings/lib/backend";

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const TICK = Math.max(0, env.mockLatencyMs);

const STORAGE_KEY = "askau.mock.preferences";

const DEFAULTS: Preferences = {
  saveHistory: true,
  shareAnalytics: false,
  higherIntelligence: false,
};

function read(): Preferences {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Preferences>) } : DEFAULTS;
  } catch {
    // A private window or blocked site data throws on access; defaults are a
    // correct answer here, so this must not surface as a failed settings load.
    return DEFAULTS;
  }
}

function write(next: Preferences): Preferences {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* see read(): unavailable storage is not a settings error */
    }
  }
  return next;
}

/**
 * The knowledge bases a Finance reader can be answered from.
 *
 * `documentCount` is that reader's count, not the repository's — the real
 * endpoint scopes it per person, and a fixture that ignored this would make the
 * list look like an inventory rather than an access list.
 */
const KNOWLEDGE_BASES: KnowledgeBase[] = [
  {
    id: "kb-staff-rules",
    name: "Staff Rules and Regulations",
    department: "Human Resources",
    sourceType: "SharePoint",
    status: "active",
    documentCount: 148,
    lastSyncedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    lastSyncStatus: "success",
  },
  {
    id: "kb-finance",
    name: "Finance and Procurement",
    department: "Finance",
    sourceType: "SharePoint",
    status: "active",
    documentCount: 512,
    lastSyncedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    lastSyncStatus: "success",
  },
  {
    id: "kb-policy-library",
    name: "Commission Policy Library",
    department: "Office of the Deputy Chairperson",
    sourceType: "Document Library",
    status: "active",
    documentCount: 1204,
    lastSyncedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    lastSyncStatus: "partial",
  },
  {
    id: "kb-legal",
    name: "Legal Instruments and Treaties",
    department: "Office of the Legal Counsel",
    sourceType: "Archive",
    status: "syncing",
    documentCount: 87,
    lastSyncedAt: null,
    lastSyncStatus: null,
  },
];

export async function getPreferences(): Promise<Preferences> {
  await pause(TICK / 3);
  return read();
}

export async function setPreferences(patch: Partial<Preferences>): Promise<Preferences> {
  await pause(TICK / 3);
  // Merged onto what is stored, not onto what the caller last read — the same
  // reason the real endpoint takes a partial body.
  return write({ ...read(), ...patch });
}

export async function deleteAllHistory(): Promise<{ deleted: number }> {
  await pause(TICK / 2);
  return { deleted: clearConversations() };
}

export async function listKnowledgeBases(): Promise<KnowledgeBase[]> {
  await pause(TICK / 2);
  return KNOWLEDGE_BASES;
}
