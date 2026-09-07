"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import type { Session } from "next-auth";
import { siteConfig } from "@/config/site";

interface AppHeaderProps {
  session: Session;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

/**
 * AppHeader — mobile-only compact top bar.
 *
 * On desktop (md+): hidden. The sidebar handles all chrome.
 * On mobile: hamburger → logo → theme toggle.
 *
 * Uses CSS logical properties for RTL compatibility.
 */
export function AppHeader({ session: _session, sidebarOpen, onSidebarToggle }: AppHeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const locale = useLocale();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const themeLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <header className="flex h-12 flex-shrink-0 items-center justify-between border-b border-neutral-100 bg-white px-4 md:hidden dark:border-neutral-800 dark:bg-black">
      {/* Hamburger */}
      <button
        type="button"
        onClick={onSidebarToggle}
        aria-expanded={sidebarOpen}
        aria-controls="sidebar"
        aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
        className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <MenuIcon className="h-5 w-5 text-black dark:text-white" />
      </button>

      {/* Logo */}
      <Link
        href={`/${locale}/chat`}
        className="focus-visible:ring-ring flex items-center gap-1.5 rounded-md px-1 py-1 focus-visible:ring-2"
        aria-label={`${siteConfig.name} — Home`}
      >
        <Image
          src="/au-emblem.png"
          alt="African Union emblem"
          width={250}
          height={225}
          priority
          className="h-6 w-auto"
        />
        <span className="text-sm font-semibold text-black dark:text-white">{siteConfig.name}</span>
      </Link>

      {/* Theme toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={themeLabel}
        title={themeLabel}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-black transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
      >
        {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      </button>
    </header>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
