import type { Metadata } from "next";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { ChatShell } from "@/features/chat/components/chat-shell";

export const metadata: Metadata = {
  title: "Chat",
  description: "Ask questions about AU Commission policies, procedures, and documents.",
};

interface ChatIdPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatIdPage(props: ChatIdPageProps) {
  const params = await props.params;
  const session = await auth();
  if (!session) redirect("/login");

  return <ChatShell session={session} initialConvId={params.id} />;
}
