import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

/**
 * Protected layout — wraps all authenticated routes.
 *
 * Server-side auth check: if the user is not authenticated,
 * they are redirected to /login. This is a UX redirect and is
 * supplemented by backend authorization on every API call.
 *
 * SECURITY NOTE:
 * This layout check is a UX convenience. The backend API
 * independently validates authentication and authorization
 * for every request. Never rely solely on this check.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <AppShell session={session}>{children}</AppShell>;
}
