import type { Metadata } from "next";
import { SAMPLE_CONVERSATIONS } from "@/features/chat/chat-data";

export const metadata: Metadata = {
  title: "Conversations",
  description: "View your AskAU conversation history.",
};

/**
 * Conversations page — lists past conversations.
 *
 * Server component. Displays placeholder data until the API is ready.
 */
export default function ConversationsPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col overflow-y-auto p-6">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-foreground mb-6 text-xl font-bold">Conversations</h1>

        <ul className="space-y-2">
          {SAMPLE_CONVERSATIONS.map((conv) => (
            <li key={conv.id}>
              <a
                href={`/chat/${conv.id}`}
                className="border-border bg-surface hover:border-border-strong hover:bg-surface-raised block rounded-xl border px-4 py-3.5 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-foreground text-sm font-medium">{conv.title}</p>
                  <time
                    dateTime={conv.timestamp.toISOString()}
                    className="text-muted-foreground flex-shrink-0 text-xs"
                  >
                    {conv.timestamp.toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">{conv.preview}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
