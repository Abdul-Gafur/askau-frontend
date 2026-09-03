/**
 * Calls the AskAU backend through the server-side proxy at /api.
 *
 * Everything here goes to a relative URL with `credentials: "same-origin"`,
 * which is what lets the bearer stay on the server — see app/api/[...path].
 *
 * The response shapes are the backend's, and they are already in this feature's
 * vocabulary: `state` is one of the five `MessageState` values and `sources` is
 * the `Source` shape these components render. That is deliberate on the API
 * side, so this file maps timestamps and reason codes and nothing else.
 */

import { env } from "@/config/environment";
import * as mock from "@/features/chat/lib/mock-backend";
import type { Message, Source } from "@/features/chat/types";

/**
 * With NEXT_PUBLIC_USE_MOCK_API=true every function here hands off to
 * mock-backend and the app runs entirely in the browser — no AskAU API, no
 * Entra tenant, no seeded dev tokens. Read once at module load: it is a build
 * flag, not something that changes between calls.
 *
 * The dispatch is per function rather than a single re-export so that this
 * module stays the one place the real contract is written down.
 */
const USE_MOCK = env.useMockApi;

type AnswerResponse = {
  messageId: string | null;
  state: string;
  answerState: string;
  content: string;
  sources?: Source[];
  conflictingSources?: Source[];
  groundingCount?: number | null;
  correlationId: string;
};

const BASE = "/api/v1";

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    // The backend answers errors as problem+json with `message` — surfaced as
    // given rather than replaced with a generic string, because it is written
    // for a reader ("the relevant document may not have been added yet").
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* a non-JSON body is not worth a second failure */
    }
    throw new Error(message);
  }
  return (await response.json()) as T;
}

export async function createConversation(): Promise<string> {
  if (USE_MOCK) return mock.createConversation();
  const body = await call<{ id: string }>("/conversations", {
    method: "POST",
    body: JSON.stringify({}),
  });
  return body.id;
}

/** UI reason → backend `FeedbackReason`. */
const REASON_MAP: Record<string, string> = {
  incorrect: "incorrect_answer",
  irrelevant: "not_relevant",
  "missing-source": "missing_information",
  outdated: "outdated_information",
  other: "other",
};

export async function askInConversation(conversationId: string, content: string): Promise<Message> {
  if (USE_MOCK) return mock.askInConversation(conversationId, content);
  const answer = await call<AnswerResponse>(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });

  return {
    // A null messageId is not an error: it is what the backend returns when the
    // reader has "save conversation history" switched off, and the feedback bar
    // is hidden for exactly that case.
    id: answer.messageId ?? `a-${Date.now()}`,
    role: "assistant",
    content: answer.content,
    timestamp: new Date(),
    state: answer.state as Message["state"],
    sources: answer.sources ?? [],
    conflictingSources: answer.conflictingSources ?? [],
    groundingCount: answer.groundingCount ?? answer.sources?.length ?? 0,
    retrievedAt: new Date(),
    feedback: null,
  };
}

export async function sendFeedback(
  messageId: string,
  helpful: boolean,
  reason?: string | null,
): Promise<void> {
  if (USE_MOCK) return mock.sendFeedback(messageId, helpful, reason);
  await call(`/messages/${messageId}/feedback`, {
    method: "POST",
    body: JSON.stringify({
      rating: helpful ? "helpful" : "not_helpful",
      // The UI's five reasons and the backend's seven are different
      // vocabularies; this is the agreed mapping until one side changes.
      reason: reason ? (REASON_MAP[reason] ?? "other") : null,
    }),
  });
}

/**
 * One conversation's transcript.
 *
 * `MessageOut` already carries `state`, `sources` and `groundingCount` in this
 * feature's vocabulary, so replaying a stored turn renders identically to a
 * live one. That symmetry is the point: an answer that looked grounded when it
 * arrived must not look different tomorrow.
 */
export async function loadConversation(id: string): Promise<Message[]> {
  if (USE_MOCK) return mock.loadConversation(id);
  const body = await call<{
    messages: {
      id: string;
      role: "user" | "assistant";
      content: string;
      state: string | null;
      sources?: Source[];
      groundingCount?: number | null;
      feedback?: string | null;
      createdAt: string;
    }[];
  }>(`/conversations/${id}`);

  return body.messages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    timestamp: new Date(m.createdAt),
    ...(m.role === "assistant"
      ? {
          state: (m.state ?? undefined) as Message["state"],
          sources: m.sources ?? [],
          groundingCount: m.groundingCount ?? m.sources?.length ?? 0,
          retrievedAt: new Date(m.createdAt),
          feedback: (m.feedback ?? null) as Message["feedback"],
        }
      : {}),
  }));
}

export async function listConversations(): Promise<
  { id: string; title: string; preview: string; timestamp: Date }[]
> {
  if (USE_MOCK) return mock.listConversations();
  const body = await call<{
    items: {
      id: string;
      title: string | null;
      lastMessagePreview: string | null;
      updatedAt: string;
    }[];
  }>("/conversations?pageSize=20");
  return body.items.map((c) => ({
    id: c.id,
    title: c.title ?? "Untitled",
    preview: c.lastMessagePreview ?? "",
    timestamp: new Date(c.updatedAt),
  }));
}

// ── streaming ───────────────────────────────────────────────────────────────

export type StreamHandlers = {
  /** Retrieval progress, in emission order: understanding → retrieving → composing. */
  onStage?: (index: number, name: string) => void;
  onToken?: (text: string) => void;
  /** Sent once, before generation — the reader sees the provenance while the answer is written. */
  onSources?: (sources: Source[]) => void;
  onConflict?: (summary: string) => void;
  onDone?: (message: Message) => void;
  onError?: (message: string) => void;
};

/** Stage names in the order the backend emits them, mapped to the UI's three steps. */
const STAGE_ORDER = ["understanding", "retrieving", "composing"];

type DoneFrame = {
  messageId: string | null;
  state: string;
  answerState: string;
  content: string;
  sources?: Source[];
  groundingCount?: number | null;
};

/**
 * Ask, over server-sent events.
 *
 * The buffered endpoint returns the same answer and is simpler; this exists for
 * one reason. Without it the interface *invents* progress — a `setInterval`
 * ticking through three labels on a timer, unrelated to what the server is
 * doing. When retrieval is slow the fake steps finish early and the reader
 * watches a completed checklist with no answer under it; when it is fast they
 * see stages for work already done. The backend emits real stage events and
 * nothing consumed them.
 *
 * Parsed by hand rather than with `EventSource`, which only does GET and cannot
 * carry a request body.
 */
export async function streamInConversation(
  conversationId: string,
  content: string,
  handlers: StreamHandlers,
): Promise<void> {
  if (USE_MOCK) return mock.streamInConversation(conversationId, content, handlers);
  const response = await fetch(`${BASE}/conversations/${conversationId}/messages/stream`, {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json", accept: "text/event-stream" },
    body: JSON.stringify({ content }),
  });

  if (!response.ok || !response.body) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* a non-JSON body is not worth a second failure */
    }
    handlers.onError?.(message);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const dispatch = (event: string, raw: string) => {
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      return; // a frame we cannot parse is not a frame we should guess at
    }
    switch (event) {
      case "stage": {
        const { stage } = data as { stage: string };
        const index = STAGE_ORDER.indexOf(stage);
        handlers.onStage?.(index >= 0 ? index : 0, stage);
        break;
      }
      case "token":
        handlers.onToken?.((data as { text: string }).text);
        break;
      case "sources":
        handlers.onSources?.((data as { sources?: Source[] }).sources ?? []);
        break;
      case "conflict":
        handlers.onConflict?.((data as { summary: string }).summary);
        break;
      case "done": {
        const frame = data as DoneFrame;
        handlers.onDone?.({
          id: frame.messageId ?? `a-${Date.now()}`,
          role: "assistant",
          content: frame.content,
          timestamp: new Date(),
          state: frame.state as Message["state"],
          sources: frame.sources ?? [],
          groundingCount: frame.groundingCount ?? frame.sources?.length ?? 0,
          retrievedAt: new Date(),
          feedback: null,
        });
        break;
      }
      case "error":
        // Only the exception type crosses the wire, never a stack — so the
        // reader gets a plain statement rather than an internal message.
        handlers.onError?.("The answer could not be completed.");
        break;
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Frames are separated by a blank line. Anything after the last separator
    // is a partial frame and stays in the buffer until the rest arrives —
    // splitting on every chunk boundary instead would drop tokens.
    let separator = buffer.indexOf("\n\n");
    while (separator !== -1) {
      const frame = buffer.slice(0, separator);
      buffer = buffer.slice(separator + 2);
      let event = "message";
      const dataLines: string[] = [];
      for (const line of frame.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
      }
      if (dataLines.length) dispatch(event, dataLines.join("\n"));
      separator = buffer.indexOf("\n\n");
    }
  }
}
