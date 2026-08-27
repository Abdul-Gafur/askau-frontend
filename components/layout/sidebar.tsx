"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { SettingsModal } from "@/features/settings/components/settings-modal";
import { SAMPLE_CONVERSATIONS } from "@/features/chat/chat-data";
import type { Conversation } from "@/features/chat/types";
import type { Session } from "next-auth";

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
  session: Session;
}

/**
 * AppSidebar — redesigned to match the chatUI reference.
 *
 * Layout:
 * - New chat + Search buttons at top
 * - Conversation history list grouped by recency
 * - Overflow context menu per conversation (Rename, Archive, Delete)
 * - User footer with avatar, name, role, settings icon
 *
 * Desktop: visible always. Mobile: overlay drawer.
 * Uses CSS logical properties for RTL.
 */
export function AppSidebar({ open, onClose, session }: AppSidebarProps) {
  const t = useTranslations("chat");
  const navT = useTranslations("navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [conversations] = useState<Conversation[]>(SAMPLE_CONVERSATIONS);
  const [overflowId, setOverflowId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Hydration fix for theme
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Close overflow on outside click
  useEffect(() => {
    if (!overflowId) return;
    const handler = () => setOverflowId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [overflowId]);

  const filtered = conversations.filter(
    (c) =>
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const userInitials = (session.user?.name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sidebarContent = (
    <aside
      id="sidebar"
      aria-label="Main navigation"
      className="flex h-full w-64 flex-col bg-neutral-50 dark:bg-black border-e border-neutral-200 dark:border-neutral-800"
    >
      {/* Platform Logo and Toggle */}
      <div className="flex h-14 flex-shrink-0 items-center justify-between px-4">
        <Link href={`/${locale}/chat`} className="flex items-center gap-2">
          <span className="text-sm font-semibold text-black dark:text-white">
            AskAU
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors hidden md:flex"
          aria-label="Close sidebar"
        >
          <PanelLeftCloseIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Top actions */}
      <div className="space-y-2 px-3 pb-2 pt-2">
        <Link
          href={`/${locale}/chat`}
          onClick={() => {
            window.dispatchEvent(new Event("new-chat"));
            if (window.innerWidth < 768) onClose();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-black dark:text-white transition-colors hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60"
        >
          <PlusIcon className="h-[17px] w-[17px]" />
          {t("newChat")}
        </Link>

        {/* Search input (Always visible, no focus borders) */}
        <div className="relative">
          <SearchIcon className="absolute start-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-neutral-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchChatsPlaceholder")}
            className="w-full rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50 py-2 ps-9 pe-3 text-sm text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-0 border-transparent focus:border-transparent transition-colors hover:bg-neutral-200/80 dark:hover:bg-neutral-800/80"
          />
        </div>
      </div>

      {/* Conversation history */}
      <div className="flex-1 overflow-y-auto px-2 pt-2 pb-4 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        <p className="mb-1 px-3 text-xs font-medium text-black dark:text-white">
          {t("conversations.recents")}
        </p>
        <ul className="space-y-0.5" role="list">
          {filtered.map((c) => (
            <li key={c.id} className="group relative flex">
              <Link
                href={`/${locale}/chat/${c.id}`}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={cn(
                  "w-full truncate rounded-xl px-3 py-2 text-start text-sm transition-colors",
                  pathname.endsWith(`/chat/${c.id}`)
                    ? "bg-neutral-200 dark:bg-neutral-800 font-medium text-black dark:text-white"
                    : "text-black dark:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/50",
                )}
              >
                {c.title}
              </Link>

              {/* Overflow trigger */}
              <button
                type="button"
                aria-label="More options"
                onClick={(e) => {
                  e.stopPropagation();
                  setOverflowId(overflowId === c.id ? null : c.id);
                }}
                className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1 opacity-0 transition-all group-hover:opacity-100 hover:bg-neutral-300/60 dark:hover:bg-neutral-700"
              >
                <DotsIcon className="h-3 w-3 text-black dark:text-white" />
              </button>

              {/* Overflow menu */}
              {overflowId === c.id && (
                <div
                  className="absolute end-0 top-full z-20 mt-0.5 w-36 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-1 text-xs shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(["rename", "archive", "delete"] as const).map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => setOverflowId(null)}
                      className={cn(
                        "w-full px-3 py-1.5 text-start transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800",
                        action === "delete"
                          ? "text-red-600 dark:text-red-400"
                          : "text-black dark:text-white",
                      )}
                    >
                      {t(`conversations.${action}`)}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer: menus + user info */}
      <div className="mt-auto flex flex-col border-t border-neutral-200 dark:border-neutral-800 p-2">
        <div className="space-y-0.5 mb-2 px-1 pt-1">
          {/* Dark mode */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-black dark:text-white transition-colors hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60"
          >
            {isDark ? (
              <SunIcon className="h-[18px] w-[18px] text-neutral-500" />
            ) : (
              <MoonIcon className="h-[18px] w-[18px] text-neutral-500" />
            )}
            {isDark ? navT("themeToggle.lightMode") : navT("themeToggle.darkMode")}
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-black dark:text-white transition-colors hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60"
          >
            <GearIcon className="h-[18px] w-[18px] text-neutral-500" />
            {navT("items.settings")}
          </button>

          {/* Help */}
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-black dark:text-white transition-colors hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60"
          >
            <QuestionIcon className="h-[18px] w-[18px] text-neutral-500" />
            {navT("items.help")}
          </button>
        </div>

        {/* User profile */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3 pb-1">
          <div className="flex items-center gap-3 px-2">
            {/* Avatar */}
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-800">
              <span className="text-[13px] font-bold text-neutral-700 dark:text-neutral-400">
                {userInitials}
              </span>
            </div>

            {/* Name + role */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-black dark:text-white">
                {session.user?.name ?? "User"}
              </p>
              <p className="truncate text-xs text-black dark:text-white">
                General Staff
              </p>
            </div>

            {/* Sign out */}
            <button
              type="button"
              title="Sign out"
              className="flex-shrink-0 rounded-lg p-1.5 text-black dark:text-white transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              <LogOutIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings modal */}
      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        session={session}
      />
    </aside>
  );

  return (
    <>
      {/* Desktop: conditionally visible */}
      {open && <div className="hidden md:flex h-full">{sidebarContent}</div>}

      {/* Mobile: drawer overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-hidden="true"
            onClick={onClose}
          />
          <div
            className="fixed inset-y-0 start-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}

/* ── Inline icons ── */
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function GearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
function DotsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  );
}
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
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
function QuestionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function PanelLeftCloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <polyline points="15 16 11 12 15 8" />
    </svg>
  );
}


