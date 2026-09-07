import type { Message, Source, FeedbackType, NotHelpfulReason } from "@/features/chat/types";
import { UserMessage } from "./user-message";
import { AIMessage } from "./ai-message";
import { LoadingMessage } from "./loading-message";
import type { AppView } from "@/features/chat/types";

interface MessageThreadProps {
  messages: Message[];
  view: AppView;
  loadingStep: number;
  /** Id of the message being written right now, or null. */
  streamingId?: string | null;
  onFeedback: (id: string, f: FeedbackType) => void;
  onReason: (id: string, r: NotHelpfulReason) => void;
  onPreview: (source: Source) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * MessageThread — scrollable list of user and AI messages.
 *
 * Renders user messages (right-aligned) and AI responses.
 * Shows LoadingMessage at the bottom during retrieval.
 */
export function MessageThread({
  messages,
  view,
  loadingStep,
  streamingId = null,
  onFeedback,
  onReason,
  onPreview,
  scrollRef,
}: MessageThreadProps) {
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserMessage key={msg.id} message={msg} />
          ) : (
            <AIMessage
              key={msg.id}
              message={msg}
              streaming={msg.id === streamingId}
              onFeedback={onFeedback}
              onReason={onReason}
              onPreview={onPreview}
            />
          ),
        )}

        {view === "loading" && <LoadingMessage step={loadingStep} />}

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}
