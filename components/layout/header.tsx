"use client";

import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import type { Session } from "next-auth";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface AppHeaderProps {
  session: Session;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

/**
 * Application Header.
 *
 * Contains:
 * - Hamburger menu toggle (mobile)
 * - AskAU logo / wordmark
 * - Theme toggle (Light/Dark/System)
 * - User menu (avatar, sign-out)
 *
 * Uses logical CSS properties for RTL support.
 */
export function AppHeader({ session, sidebarOpen, onSidebarToggle }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();

  const nextTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const themeLabel =
    theme === "dark" ? "Switch to light" : theme === "light" ? "Switch to system" : "Switch to dark";
  const themeEmoji = theme === "dark" ? "☀️" : theme === "light" ? "💻" : "🌙";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile: hamburger menu */}
        <button
          type="button"
          onClick={onSidebarToggle}
          aria-expanded={sidebarOpen}
          aria-controls="sidebar"
          aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted md:hidden"
        >
          <span aria-hidden="true" className="text-xl">
            {sidebarOpen ? "✕" : "☰"}
          </span>
        </button>

        {/* Logo */}
        <Link
          href="/chat"
          className="flex items-center gap-2 rounded-md px-1 py-1 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`${siteConfig.name} — Home`}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            AU
          </span>
          <span className="hidden font-semibold sm:inline">{siteConfig.name}</span>
        </Link>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(nextTheme)}
          aria-label={themeLabel}
          title={themeLabel}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors hover:bg-muted"
        >
          <span aria-hidden="true">{themeEmoji}</span>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            type="button"
            aria-label={`User menu — ${session.user?.name ?? "User"}`}
            className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted"
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign out"
          >
            {/* Avatar */}
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {(session.user?.name ?? "U").charAt(0).toUpperCase()}
            </span>
            <span className="hidden max-w-32 truncate text-sm md:inline">
              {session.user?.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
