"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root error boundary.
 * Catches unhandled errors in the root layout tree.
 *
 * SECURITY NOTE: Never expose error.message, stack traces, or
 * internal details to the user in production.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error reporting service (safe — no sensitive data)
    console.error("[GlobalError]", {
      digest: error.digest,
      // Do NOT log error.message in production — may contain sensitive info
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="text-muted-foreground mb-4 font-mono text-xs">Reference: {error.digest}</p>
        )}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border-border hover:bg-muted rounded-md border px-4 py-2 text-sm"
          >
            Go to home
          </Link>
        </div>
      </div>
    </div>
  );
}
