"use client";

import {
  createConversation,
  listConversations,
  loadConversation,
  sendFeedback,
  streamInConversation,
} from "@/features/chat/lib/backend";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Session } from "next-auth";
import {} from "@/features/chat/chat-data";
import type {
  AppView,
  Conversation,
  FeedbackType,
  Message,
  NotHelpfulReason,
  Source,
} from "@/features/chat/types";
import { WelcomeScreen } from "./welcome-screen";
import { MessageThread } from "./message-thread";
import { MessageComposer } from "./message-composer";
import { DocPreviewPane } from "./doc-preview-pane";
import { AUFlagBackdrop } from "./au-flag-backdrop";

interface ChatShellProps {
  session?: Session;
  initialConvId?: string;
}

/**
 * ChatShell — the main "use client" orchestrator for the chat feature.
 *
 * Manages all state: messages, conversations, view, loading step, preview.
 * Keeps the page server component clean; all interactivity lives here.
 */
export function ChatShell({ session, initialConvId }: ChatShellProps) {
  const t = useTranslations("chat");
  const [view, setView] = useState<AppView>("welcome");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingStep, setLoadingStep] = useState(0);
  const [, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [previewSource, setPreviewSource] = useState<Source | null>(null);
  // The message currently being written, if any. Kept here rather than
  // inferred from a missing `state` in the renderer: a stored message can also
  // arrive without one, and that is history, not work in progress.
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Handle new chat event
  useEffect(() => {
    const onNewChat = () => {
      setView("welcome");
      setMessages([]);
      setActiveConvId(null);
      setPreviewSource(null);
    };
    window.addEventListener("new-chat", onNewChat);
    return () => window.removeEventListener("new-chat", onNewChat);
  }, []);

  // The reader's own conversations, from the backend.
  //
  // Refetched on the `history-deleted` event too: the settings modal can empty
  // this list, and a sidebar still showing conversations that no longer exist
  // is a privacy control that visibly did not work.
  const refreshConversations = useCallback(() => {
    void listConversations()
      .then(setConversations)
      .catch(() => setConversations([]));
  }, []);

  useEffect(() => {
    refreshConversations();
    const onDeleted = () => {
      setMessages([]);
      setActiveConvId(null);
      setView("welcome");
      refreshConversations();
    };
    window.addEventListener("history-deleted", onDeleted);
    return () => window.removeEventListener("history-deleted", onDeleted);
  }, [refreshConversations]);

  // Replay a stored conversation.
  //
  // This was a fixture that returned the same two invented messages for every
  // id — "This is a historical conversation loaded from the mock database."
  // Real transcripts carry their original state and sources, so a turn read
  // back tomorrow renders exactly as it did when it arrived.
  useEffect(() => {
    if (!initialConvId) return;
    let cancelled = false;
    void loadConversation(initialConvId)
      .then((loaded) => {
        if (cancelled) return;
        setActiveConvId(initialConvId);
        setMessages(loaded);
        setView(loaded.length ? "conversation" : "welcome");
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [initialConvId]);

  // Auto-scroll to bottom on new messages

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, view]);

  const handleSend = useCallback(
    (text: string) => {
      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setView("loading");
      setLoadingStep(0);
      setPreviewSource(null);

      void (async () => {
        let convId = activeConvId;
        try {
          if (!convId) {
            convId = await createConversation();
            setActiveConvId(convId);
          }

          // The assistant message is created empty and filled as tokens
          // arrive, so the reader watches the answer being written rather than
          // waiting on a spinner and then being handed a finished block.
          const draftId = `a-${Date.now()}`;
          let opened = false;

          const openDraft = () => {
            if (opened) return;
            opened = true;
            setView("conversation");
            setStreamingId(draftId);
            setMessages((prev) => [
              ...prev,
              { id: draftId, role: "assistant", content: "", timestamp: new Date() },
            ]);
          };

          const patchDraft = (patch: Partial<Message>) =>
            setMessages((prev) => prev.map((m) => (m.id === draftId ? { ...m, ...patch } : m)));

          await streamInConversation(convId, text, {
            // Real progress. This used to be a `setInterval` ticking through
            // three labels on a timer — when retrieval was slow the checklist
            // finished with no answer under it, and when it was fast the
            // reader saw stages for work already done.
            onStage: (index) => setLoadingStep(index),
            onSources: (sources) => {
              // Arrives before the first token, so the provenance is on screen
              // while the answer is still being written.
              openDraft();
              patchDraft({ sources, groundingCount: sources.length });
            },
            onToken: (chunk) => {
              openDraft();
              setMessages((prev) =>
                prev.map((m) => (m.id === draftId ? { ...m, content: m.content + chunk } : m)),
              );
            },
            onDone: (finished) => {
              openDraft();
              // Keyed on the draft id: the backend's own message id arrives
              // here and replaces it, which is what makes the feedback bar work
              // on a streamed answer.
              setMessages((prev) => prev.map((m) => (m.id === draftId ? finished : m)));
              setStreamingId(null);
              refreshConversations();
              window.dispatchEvent(new Event("conversations-changed"));
            },
            onError: (message) => {
              openDraft();
              patchDraft({ content: message, state: "error" });
              setStreamingId(null);
            },
          });
        } catch (error) {
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: "assistant",
              content: error instanceof Error ? error.message : "Something went wrong.",
              timestamp: new Date(),
              state: "error",
            },
          ]);
        } finally {
          // Also cleared here: the catch path above appends its own error
          // message and never reaches onDone, so nothing else would stop the
          // caret from blinking on a draft that is no longer being written.
          setStreamingId(null);
          setView("conversation");
        }
      })();
    },
    [activeConvId, refreshConversations],
  );

  const handleFeedback = useCallback((msgId: string, f: FeedbackType) => {
    // Optimistic: the control responds immediately and the write follows.
    // Rating an answer is not an operation anyone should wait on, and a
    // failure here must not lose the answer the reader was looking at.
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, feedback: f } : m)));

    // Only "helpful" is submitted here. The backend requires a reason with a
    // negative rating — deliberately, since a "not helpful" with no reason is
    // a number nobody can act on (FR-044) — and this UI collects the reason as
    // a second step. Posting on the thumb alone is a guaranteed 422, which is
    // exactly what it did before this comment existed.
    if (f !== "helpful") return;

    void sendFeedback(msgId, true).catch(() => {
      // Rolled back, so the thumb does not claim a rating that was not stored.
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, feedback: null } : m)));
    });
  }, []);

  const handleReason = useCallback((msgId: string, r: NotHelpfulReason) => {
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, notHelpfulReason: r } : m)));
    // This is where the negative rating is actually written — rating and reason
    // together, which is the only shape the backend accepts.
    if (!r) return;
    void sendFeedback(msgId, false, r).catch(() => undefined);
  }, []);

  return (
    <div className="relative flex h-full flex-1 overflow-hidden">
      {/* African Union member-state flags — decorative background */}
      <AUFlagBackdrop />

      {/* Conversation + composer area */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {view === "welcome" && <WelcomeScreen userName={session?.user?.name} onSend={handleSend} />}

        {(view === "conversation" || view === "loading") && (
          <>
            <MessageThread
              messages={messages}
              view={view}
              loadingStep={loadingStep}
              streamingId={streamingId}
              onFeedback={handleFeedback}
              onReason={handleReason}
              onPreview={setPreviewSource}
              scrollRef={scrollRef}
            />

            {/* Sticky composer */}
            <div className="absolute right-0 bottom-0 left-0 z-10 flex-shrink-0 bg-gradient-to-t from-white via-white to-transparent px-4 pt-6 pb-4 md:px-6 dark:from-black dark:via-black dark:to-transparent">
              <div className="mx-auto max-w-2xl space-y-2">
                <MessageComposer onSend={handleSend} />
                <p className="text-center text-[11px] text-black dark:text-white">
                  {t("disclaimer")}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Document preview right pane */}
      {previewSource && (
        <DocPreviewPane source={previewSource} onClose={() => setPreviewSource(null)} />
      )}
    </div>
  );
}
