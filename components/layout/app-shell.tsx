"use client";

import { useState, useEffect } from "react";
import type { Session } from "next-auth";
import { AppHeader } from "./header";
import { AppSidebar } from "./sidebar";

interface AppShellProps {
  children: React.ReactNode;
  session: Session;
}

/**
 * AppShell — main layout wrapper for authenticated pages.
 *
 * Desktop layout (matching chatUI reference):
 * ┌──────────┬──────────────────────────────┐
 * │          │                              │
 * │ Sidebar  │       Main Content           │
 * │ (full h) │                              │
 * └──────────┴──────────────────────────────┘
 * No top header on desktop — the sidebar is the only persistent chrome.
 *
 * Mobile layout:
 * ┌─────────────────────────────────────────┐
 * │         Mobile Header (h-12)            │
 * ├─────────────────────────────────────────┤
 * │         Main Content                    │
 * └─────────────────────────────────────────┘
 * Sidebar slides in as a drawer when hamburger is tapped.
 *
 * Uses CSS logical properties (start/end) for RTL compatibility.
 */
export function AppShell({ children, session }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auto-hide on mobile after mount
  useEffect(() => {
    if (window.innerWidth < 768) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarOpen(false);
    }
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white text-black dark:bg-[#0d1117] dark:text-white">
      {/* Mobile-only header */}
      <AppHeader
        session={session}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen((v) => !v)}
      />

      {/* Body: sidebar + main content */}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} session={session} />

        {/* Main content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="relative flex flex-1 flex-col overflow-hidden focus:outline-none"
        >
          {/* Desktop sidebar toggle (when closed) */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute start-3 top-3 z-10 hidden items-center justify-center rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 md:flex dark:hover:bg-neutral-800"
              aria-label="Open sidebar"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <polyline points="11 16 15 12 11 8" />
              </svg>
            </button>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
