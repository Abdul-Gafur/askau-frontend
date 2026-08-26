import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
  description: "Ask questions about AU Commission policies, procedures, and documents.",
};

/**
 * Chat page — Phase 1 Foundation placeholder.
 *
 * The full chat interface will be implemented in Phase 2.
 * This page establishes the route, metadata, and placeholder structure.
 */
export default function ChatPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl text-center">
        {/* Placeholder icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-4xl">
          💬
        </div>

        <h1 className="mb-2 text-2xl font-bold">AskAU Chat</h1>
        <p className="mb-4 text-muted-foreground">
          Your AI-powered knowledge assistant for the African Union Commission.
        </p>

        {/* Phase indicator */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
          <span
            className="h-2 w-2 rounded-full bg-warning"
            aria-hidden="true"
          />
          Phase 2 — Chat experience coming soon
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 text-start">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            What AskAU will do
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              "Answer questions about AU Commission policies and procedures",
              "Cite sources from approved AU knowledge documents",
              "Support queries in English, French, Arabic, and Portuguese",
              "Provide references to original policy documents",
              "Keep conversation history for your reference",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-primary" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
