import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";

/**
 * Root page — redirects to the appropriate page based on auth state.
 * Authenticated users → /chat
 * Unauthenticated users → /login
 */
export default async function RootPage() {
  const session = await auth();
  if (session) {
    redirect("/chat");
  } else {
    redirect("/login");
  }
}
