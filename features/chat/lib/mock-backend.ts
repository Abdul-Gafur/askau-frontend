/**
 * Frontend-only implementation of features/chat/lib/backend.ts.
 *
 * Used when NEXT_PUBLIC_USE_MOCK_API=true, so the interface runs with no
 * AskAU backend and no Entra tenant behind it. The real module delegates here
 * rather than this replacing it — see the dispatch at the top of backend.ts.
 *
 * The shapes returned are the ones backend.ts produces *after* mapping, not the
 * wire shapes: this stands in for the network call, so there is nothing to
 * parse. Answers are deliberately not all `grounded` — an interface that only
 * ever sees the happy path hides the states this product exists to show, so the
 * fixtures below include an `insufficient` answer and a `conflicting` one.
 *
 * State lives in module scope, which means it survives client-side navigation
 * and resets on a full reload. That is the honest behaviour for a mock and
 * avoids pretending there is durable history when there is no database.
 */

import { env } from "@/config/environment";
import type { Message, Source } from "@/features/chat/types";

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** One unit of simulated work. Reads NEXT_PUBLIC_MOCK_LATENCY_MS. */
const TICK = Math.max(0, env.mockLatencyMs);

// ── fixtures ────────────────────────────────────────────────────────────────

const LEAVE_SOURCE: Source = {
  id: "src-staff-rules-6-1",
  title: "AU Commission Staff Rules and Regulations",
  section: "Rule 6.1 — Annual Leave",
  page: 48,
  version: "2023.2",
  published: "2023-06-30",
  classification: "INTERNAL",
  department: "Human Resources",
  docType: "Staff Regulation",
  effectiveDate: "2023-07-01",
  status: "current",
  excerpt:
    "Permanent staff members shall be entitled to thirty (30) working days of annual leave per calendar year, accruing at two and one-half (2.5) days for each completed month of service.",
  hasAccess: true,
  accessUrl: null,
};

const CARRYOVER_SOURCE: Source = {
  id: "src-hr-circular-2024-04",
  title: "HR Circular 2024/04 — Leave Carry-Over",
  section: "Paragraph 3",
  page: 2,
  version: "1.0",
  published: "2024-02-12",
  classification: "INTERNAL",
  department: "Human Resources",
  docType: "Circular",
  effectiveDate: "2024-03-01",
  status: "current",
  excerpt:
    "Not more than sixty (60) days of accrued annual leave may be carried into the following calendar year. Balances above that ceiling lapse on 31 December.",
  hasAccess: true,
  accessUrl: null,
};

const PROCUREMENT_SOURCE: Source = {
  id: "src-procurement-manual-4",
  title: "AU Procurement Manual",
  section: "Chapter 4 — Approval Thresholds",
  page: 61,
  version: "2022.1",
  published: "2022-11-15",
  classification: "CONFIDENTIAL",
  department: "Finance",
  docType: "Manual",
  effectiveDate: "2023-01-01",
  status: "current",
  excerpt:
    "Procurements above USD 100,000 require the endorsement of the Tender Board. Below that threshold, departmental authorisation is sufficient provided three written quotations are on file.",
  hasAccess: true,
  accessUrl: null,
};

const TRAVEL_SOURCE: Source = {
  id: "src-travel-policy-annex-ii",
  title: "AU Staff Travel Policy",
  section: "Annex II — Daily Subsistence Allowance",
  page: 23,
  version: "2021.3",
  published: "2021-09-01",
  classification: "INTERNAL",
  department: "Finance",
  docType: "Policy",
  effectiveDate: "2021-10-01",
  status: "superseded",
  excerpt:
    "Daily Subsistence Allowance is payable at the rate applicable to the duty station, as published annually by the International Civil Service Commission.",
  hasAccess: false,
  accessUrl: null,
};

/**
 * The canned answers, matched on keywords in the question.
 *
 * Written as flat prose with no markdown: AIMessage renders `content` into a
 * single <p>, so asterisks would show literally and blank lines would collapse.
 *
 * `state` is chosen per answer rather than fixed, so every branch the message
 * renderer has is reachable from the suggestion chips on the welcome screen.
 */
const ANSWERS: {
  match: RegExp;
  content: string;
  state: Message["state"];
  sources: Source[];
  conflictingSources?: Source[];
  conflictSummary?: string;
}[] = [
  {
    match: /leave|annual|vacation|holiday/i,
    state: "grounded",
    content:
      "Permanent staff of the AU Commission are entitled to 30 working days of annual leave per calendar year, accruing at 2.5 days for each completed month of service. Unused leave may be carried into the next calendar year up to a ceiling of 60 days, and any balance above that lapses on 31 December. Requests go through your supervisor and are recorded by Human Resources before the leave is taken.",
    sources: [LEAVE_SOURCE, CARRYOVER_SOURCE],
  },
  {
    match: /procure|tender|purchas|supplier|quotation/i,
    state: "grounded",
    content:
      "Approval depends on the value of the procurement. Up to USD 100,000, departmental authorisation is sufficient provided three written quotations are on file. Above USD 100,000, the Tender Board must endorse the award before any commitment is made. The requirement for three quotations applies regardless of value — it is the approving authority that changes at the threshold.",
    sources: [PROCUREMENT_SOURCE],
  },
  {
    match: /travel|dsa|subsistence|per diem|allowance/i,
    state: "conflicting",
    content:
      "The travel policy in the knowledge base sets Daily Subsistence Allowance by duty station, at the rate published annually by the International Civil Service Commission. I am flagging rather than answering outright: the version available to me is marked superseded, so the rate table it points to may not be the one in force. Confirm the current annex with Finance before relying on a figure.",
    sources: [TRAVEL_SOURCE],
    conflictingSources: [TRAVEL_SOURCE],
    conflictSummary:
      "The only travel policy version available to you is marked superseded — its allowance table may no longer be in force.",
  },
];

const INSUFFICIENT: { content: string; state: Message["state"] } = {
  state: "insufficient",
  content:
    "I could not find approved AU material that answers this. That is a statement about the knowledge base rather than about the policy: the relevant document may not have been added yet, or it may sit outside what your access allows. Rather than compose something plausible from unapproved sources, I am stopping here.",
};

function answerFor(question: string) {
  return ANSWERS.find((a) => a.match.test(question)) ?? null;
}

// ── in-memory store ─────────────────────────────────────────────────────────

type StoredConversation = {
  id: string;
  title: string | null;
  messages: Message[];
  updatedAt: Date;
};

let counter = 0;
const nextId = (prefix: string) => `${prefix}-${++counter}-${Date.now().toString(36)}`;

const store = new Map<string, StoredConversation>();

/**
 * Seeded so the sidebar is not empty on first load.
 *
 * An empty history reads as a broken fetch rather than as a new account, and
 * the recents list is one of the things worth being able to look at.
 */
function seed() {
  if (store.size > 0) return;
  const seeded: StoredConversation[] = [
    {
      id: "conv-seed-leave",
      title: "Annual leave entitlement",
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      messages: [
        {
          id: "m-seed-1",
          role: "user",
          content: "What is the official leave policy?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: "m-seed-2",
          role: "assistant",
          content: ANSWERS[0]!.content,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          state: "grounded",
          sources: ANSWERS[0]!.sources,
          groundingCount: ANSWERS[0]!.sources.length,
          retrievedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          feedback: null,
        },
      ],
    },
    {
      id: "conv-seed-procurement",
      title: "Procurement approval thresholds",
      updatedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
      messages: [
        {
          id: "m-seed-3",
          role: "user",
          content: "What is the procurement approval process?",
          timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
        },
        {
          id: "m-seed-4",
          role: "assistant",
          content: ANSWERS[1]!.content,
          timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
          state: "grounded",
          sources: ANSWERS[1]!.sources,
          groundingCount: ANSWERS[1]!.sources.length,
          retrievedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
          feedback: null,
        },
      ],
    },
  ];
  for (const conversation of seeded) store.set(conversation.id, conversation);
}

/** First line of the opening question, used as the recents label. */
function titleFrom(question: string) {
  const trimmed = question.trim().replace(/\s+/g, " ");
  return trimmed.length > 48 ? `${trimmed.slice(0, 47)}…` : trimmed;
}

// ── the backend surface ─────────────────────────────────────────────────────

export async function createConversation(): Promise<string> {
  seed();
  await pause(TICK / 4);
  const id = nextId("conv");
  store.set(id, { id, title: null, messages: [], updatedAt: new Date() });
  return id;
}

function buildAnswer(conversationId: string, content: string): Message {
  const match = answerFor(content);
  const conversation = store.get(conversationId);

  if (conversation) {
    conversation.messages.push({
      id: nextId("m"),
      role: "user",
      content,
      timestamp: new Date(),
    });
    conversation.title ??= titleFrom(content);
    conversation.updatedAt = new Date();
  }

  const message: Message = {
    id: nextId("m"),
    role: "assistant",
    content: match?.content ?? INSUFFICIENT.content,
    timestamp: new Date(),
    state: match?.state ?? INSUFFICIENT.state,
    sources: match?.sources ?? [],
    conflictingSources: match?.conflictingSources ?? [],
    groundingCount: match?.sources.length ?? 0,
    retrievedAt: new Date(),
    feedback: null,
  };

  conversation?.messages.push(message);
  return message;
}

export async function askInConversation(conversationId: string, content: string): Promise<Message> {
  seed();
  await pause(TICK);
  return buildAnswer(conversationId, content);
}

export async function sendFeedback(
  messageId: string,
  helpful: boolean,
  _reason?: string | null,
): Promise<void> {
  await pause(TICK / 4);
  for (const conversation of store.values()) {
    const message = conversation.messages.find((m) => m.id === messageId);
    if (message) {
      message.feedback = helpful ? "helpful" : "not-helpful";
      return;
    }
  }
}

export async function loadConversation(id: string): Promise<Message[]> {
  seed();
  await pause(TICK / 2);
  const conversation = store.get(id);
  if (!conversation) throw new Error("That conversation could not be found.");
  return conversation.messages;
}

export async function listConversations(): Promise<
  { id: string; title: string; preview: string; timestamp: Date }[]
> {
  seed();
  await pause(TICK / 2);
  return [...store.values()]
    .filter((c) => c.messages.length > 0)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map((c) => ({
      id: c.id,
      title: c.title ?? "Untitled",
      preview: c.messages[c.messages.length - 1]?.content.slice(0, 120) ?? "",
      timestamp: c.updatedAt,
    }));
}

/** Removes every stored conversation. Backs the settings "delete history" action. */
export function clearConversations(): number {
  const removed = [...store.values()].filter((c) => c.messages.length > 0).length;
  store.clear();
  return removed;
}

/** Word-boundary groups, at most STREAM_CHUNKS of them. See streamInConversation. */
const STREAM_CHUNKS = 24;

function chunkForStreaming(content: string): string[] {
  const words = content.split(/(\s+)/).filter(Boolean);
  if (words.length <= STREAM_CHUNKS) return words;
  const per = Math.ceil(words.length / STREAM_CHUNKS);
  const groups: string[] = [];
  for (let i = 0; i < words.length; i += per) groups.push(words.slice(i, i + per).join(""));
  return groups;
}

/**
 * The staged emission the real SSE endpoint produces, on a timer.
 *
 * Ordering matters and is copied from the server: the three stages first, then
 * sources *before* the answer text — the reader is meant to see the provenance
 * while the answer is being written, not after — then tokens, then `done`.
 * Emitted in a bounded number of groups rather than one word at a time. A
 * per-word loop needs one timer per word, and a browser throttles timers to
 * roughly one per second in a hidden tab — which turned a 1.5s answer into a
 * two-minute one that looked like a hang. `chunkForStreaming` keeps the count
 * fixed so the pacing does not depend on the length of the answer.
 */
export async function streamInConversation(
  conversationId: string,
  content: string,
  handlers: {
    onStage?: (index: number, name: string) => void;
    onToken?: (text: string) => void;
    onSources?: (sources: Source[]) => void;
    onConflict?: (summary: string) => void;
    onDone?: (message: Message) => void;
    onError?: (message: string) => void;
  },
): Promise<void> {
  seed();
  try {
    const stages = ["understanding", "retrieving", "composing"];
    for (const [index, stage] of stages.entries()) {
      handlers.onStage?.(index, stage);
      await pause(TICK / 2);
    }

    const match = answerFor(content);
    const message = buildAnswer(conversationId, content);

    handlers.onSources?.(message.sources ?? []);
    if (match?.conflictSummary) handlers.onConflict?.(match.conflictSummary);
    await pause(TICK / 3);

    for (const chunk of chunkForStreaming(message.content)) {
      handlers.onToken?.(chunk);
      await pause(TICK / 16);
    }

    handlers.onDone?.(message);
  } catch {
    handlers.onError?.("The answer could not be completed.");
  }
}
