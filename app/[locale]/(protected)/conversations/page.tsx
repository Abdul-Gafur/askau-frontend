import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversations",
  description: "View your AskAU conversation history.",
};

export default function ConversationsPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col p-6">
      <h1 className="mb-4 text-xl font-bold">Conversations</h1>
      <p className="text-muted-foreground">
        Your conversation history will appear here. This feature will be
        implemented in Phase 2.
      </p>
    </main>
  );
}
