import type { Metadata } from "next";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth/permissions";
import type { UserRole } from "@/types/auth";

export const metadata: Metadata = {
  title: "Administration",
};

/**
 * Admin page — Phase 1 placeholder.
 *
 * SECURITY NOTE:
 * The frontend role check here is for UX only — it redirects non-admin
 * users. Backend authorization is the authoritative control.
 * All admin API operations must be independently authorized server-side.
 */
export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // UX-only role check — backend is authoritative
  const roles = (session.user as { roles?: UserRole[] }).roles ?? ["user"];
  if (!isAdmin(roles)) {
    redirect("/unauthorized");
  }

  return (
    <main id="main-content" className="flex flex-1 flex-col p-6">
      <h1 className="mb-4 text-xl font-bold">Administration</h1>
      <p className="text-muted-foreground">
        Admin interface will be implemented in a future phase.
      </p>
    </main>
  );
}
