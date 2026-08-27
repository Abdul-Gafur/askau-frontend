import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Lock } from "lucide-react";

/**
 * Unauthorized page — shown when a user is authenticated
 * but does not have permission to access AskAU.
 *
 * This is separate from the login page (unauthenticated) and
 * the 403 error (denied during an action).
 */
export default function UnauthorizedPage() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-background p-6"
    >
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Access Denied</h1>
        <p className="mb-2 text-muted-foreground">
          You are not authorised to access{" "}
          <span className="font-semibold">{siteConfig.name}</span>.
        </p>
        <p className="mb-8 text-sm text-muted-foreground">
          Access is restricted to authenticated African Union Commission staff. If you
          believe this is an error, please contact your IT administrator.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Return to sign-in
          </Link>
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Contact IT Helpdesk
          </a>
        </div>
      </div>
    </main>
  );
}
