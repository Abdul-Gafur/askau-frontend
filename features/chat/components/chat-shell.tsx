"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Session } from "next-auth";
import {
  SAMPLE_CONVERSATIONS,
  SAMPLE_SOURCES,
  CONFLICTING_SOURCES,
} from "@/features/chat/chat-data";
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
  const [, setConversations] =
    useState<Conversation[]>(SAMPLE_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [previewSource, setPreviewSource] = useState<Source | null>(null);
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

  // Handle loading initial conversation (mock)
  useEffect(() => {
    if (initialConvId) {
      const conv = SAMPLE_CONVERSATIONS.find((c) => c.id === initialConvId);
      if (conv) {
        setActiveConvId(initialConvId);
        setView("conversation");
        // Mock loading messages for this conversation
        setMessages([
          {
            id: `u-${initialConvId}`,
            role: "user",
            content: conv.preview,
            timestamp: conv.timestamp,
          },
          {
            id: `a-${initialConvId}`,
            role: "assistant",
            content: "This is a historical conversation loaded from the mock database.",
            timestamp: new Date(conv.timestamp.getTime() + 1000),
            state: "grounded",
            groundingCount: 2,
            retrievedAt: new Date(conv.timestamp.getTime() + 500),
            sources: SAMPLE_SOURCES.slice(0, 2),
            feedback: null,
          }
        ]);
      }
    }
  }, [initialConvId]);

  // Auto-scroll to bottom on new messages

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, view]);


  const handleSend = useCallback(
    (
      text: string,
      variant: "normal" | "insufficient" | "conflicting" | "error" = "normal",
    ) => {
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

      const newId = activeConvId ?? `conv-${Date.now()}`;
      if (!activeConvId) {
        setActiveConvId(newId);
        setConversations((prev) => [
          { id: newId, title: text.slice(0, 50), preview: text, timestamp: new Date() },
          ...prev,
        ]);
      }

      // Simulate retrieval steps
      const step = (s: number) => {
        setLoadingStep(s);
        if (s < 2) {
          setTimeout(() => step(s + 1), 900);
        } else {
          setTimeout(() => {
            const now = new Date();
            let aiMsg: Message;

            if (variant === "insufficient") {
              aiMsg = {
                id: `a-${Date.now()}`,
                role: "assistant",
                content: "",
                timestamp: now,
                state: "insufficient",
              };
            } else if (variant === "error") {
              aiMsg = {
                id: `a-${Date.now()}`,
                role: "assistant",
                content: "",
                timestamp: now,
                state: "error",
              };
            } else if (variant === "conflicting") {
              aiMsg = {
                id: `a-${Date.now()}`,
                role: "assistant",
                content:
                  "The approved knowledge sources contain conflicting information regarding annual leave carry-forward entitlements. The most recent version of the Staff Leave Policy (v3.1, effective 1 January 2026) states a maximum carry-forward of 15 days, superseding the previous limit of 30 days.",
                timestamp: now,
                state: "conflicting",
                conflictingSources: CONFLICTING_SOURCES,
              };
            } else {
              aiMsg = {
                id: `a-${Date.now()}`,
                role: "assistant",
                content:
                  "Employees should submit an annual leave request through the approved leave management system not less than five working days prior to the intended commencement date. The request must receive written supervisory approval before leave is taken. Supervisors are required to review and respond within two working days. All applications must be lodged through the integrated HR portal — paper-based submissions are no longer accepted.",
                timestamp: now,
                state: "grounded",
                groundingCount: 3,
                retrievedAt: new Date(now.getTime() - 1500),
                sources: SAMPLE_SOURCES,
                feedback: null,
              };
            }

            setMessages((prev) => [...prev, aiMsg]);
            setView("conversation");
          }, 700);
        }
      };
      setTimeout(() => step(0), 200);
    },
    [activeConvId],
  );

  const handleFeedback = useCallback((msgId: string, f: FeedbackType) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, feedback: f } : m)),
    );
  }, []);

  const handleReason = useCallback(
    (msgId: string, r: NotHelpfulReason) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, notHelpfulReason: r } : m)),
      );
    },
    [],
  );

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      {/* Conversation + composer area */}
      <div className="flex min-w-0 flex-1 flex-col relative">
        {view === "welcome" && (
          <WelcomeScreen userName={session?.user?.name} onSend={handleSend} />
        )}

        {(view === "conversation" || view === "loading") && (
          <>
            <MessageThread
              messages={messages}
              view={view}
              loadingStep={loadingStep}
              onFeedback={handleFeedback}
              onReason={handleReason}
              onPreview={setPreviewSource}
              scrollRef={scrollRef}
            />

            {/* Sticky composer */}
            <div className="flex-shrink-0 bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black dark:to-transparent px-4 pb-4 pt-6 md:px-6 absolute bottom-0 left-0 right-0 z-10">
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
        <DocPreviewPane
          source={previewSource}
          onClose={() => setPreviewSource(null)}
        />
      )}
    </div>
  );
}
