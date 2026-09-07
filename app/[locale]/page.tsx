import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { LandingPage } from "@/features/marketing/components/landing-page";
import "@/styles/landing.css";

/**
 * Root page.
 * Authenticated users are sent straight to the chat workspace;
 * everyone else sees the public landing page.
 */
export default async function RootPage() {
  const session = await auth();
  if (session) {
    redirect("/chat");
  }
  return <LandingPage />;
}
