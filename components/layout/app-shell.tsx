"use client";

import { useState } from "react";
import type { Session } from "next-auth";
import { AppHeader } from "./header";
import { AppSidebar } from "./sidebar";

interface AppShellProps {
  children: React.ReactNode;
  session: Session;
}

/**
 * Application Shell — the main layout wrapper for protected pages.
 *
 * Layout:
 * ┌─────────────────────────────────────────┐
 * │                Header                   │
 * ├──────────┬──────────────────────────────┤
 * │          │                              │
 * │ Sidebar  │       Main Content           │
 * │          │                              │
 * └──────────┴──────────────────────────────┘
 *
 * On mobile: Sidebar slides in as a drawer triggered by hamburger in Header.
 * On md+: Sidebar is sticky/fixed on the left.
 *
 * Uses CSS logical properties for RTL compatibility.
 */
export function AppShell({ children, session }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppHeader
        session={session}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen((v) => !v)}
      />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          session={session}
        />

        {/* Main content area */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex flex-1 flex-col overflow-y-auto focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
