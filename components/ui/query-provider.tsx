"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * TanStack Query Provider.
 *
 * Creates a QueryClient instance per component tree (React best practice).
 * DevTools are only included in development mode.
 *
 * Configuration:
 * - staleTime: 5 minutes (reasonable for AU documents that don't change often)
 * - retry: 2 (retry failed requests twice before showing error)
 * - refetchOnWindowFocus: false (enterprise tool — don't surprise users)
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 2,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0, // Don't retry mutations — they may not be idempotent
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env["NODE_ENV"] === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
