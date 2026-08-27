import type { Metadata } from "next";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { ChatShell } from "@/features/chat/components/chat-shell";

export const metadata: Metadata = {
  title: "Chat",
  description: "Ask questions about AU Commission policies, procedures, and documents.",
};

/**
 * Chat page — renders the full chat interface.
 *
 * Stays as a server component; all interactivity is in ChatShell ("use client").
 * Auth is checked server-side; unauthenticated users are redirected to /login.
 */
export default async function ChatPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return <ChatShell session={session} />;
}
