"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { localeDisplayNames, type Locale } from "@/i18n/config";
import type { Session } from "next-auth";
import {
  Settings2Icon,
  DatabaseIcon,
  BellIcon,
  ShieldIcon,
  LockKeyholeIcon,
  UserIcon,
} from "lucide-react";
type SettingsSection =
  "general" | "knowledge" | "notifications" | "privacy" | "security" | "account";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session;
}

const LOCALES: Locale[] = ["en", "fr", "ar", "pt"];

const KNOWLEDGE_BASES = [
  {
    name: "Organisational Policy Repository",
    version: "v2.6",
    docs: "1,842 documents",
    updated: "26 Aug 2026",
    enabled: true,
  },
  {
    name: "HR Procedures & Circulars",
    version: "v1.4",
    docs: "438 documents",
    updated: "12 Aug 2026",
    enabled: true,
  },
  {
    name: "Procurement Manuals",
    version: "v3.0",
    docs: "216 documents",
    updated: "1 Jul 2026",
    enabled: false,
  },
];

/**
 * SettingsModal — settings dialog matching the chatUI reference design.
 */
export function SettingsModal({ open, onOpenChange, session }: SettingsModalProps) {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const [section, setSection] = useState<SettingsSection>("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState("30min");
  const [notifications, setNotifications] = useState(true);
  const [knowledgeUpdates, setKnowledgeUpdates] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(false);
  const [higherIntelligence, setHigherIntelligence] = useState(true);

  const NAV_ITEMS = [
    { id: "general" as const, label: t("sections.general"), icon: Settings2Icon },
    { id: "knowledge" as const, label: t("sections.knowledge"), icon: DatabaseIcon },
    { id: "notifications" as const, label: t("sections.notifications"), icon: BellIcon },
    { id: "privacy" as const, label: t("sections.privacy"), icon: ShieldIcon },
    { id: "security" as const, label: t("sections.security"), icon: LockKeyholeIcon },
    { id: "account" as const, label: t("sections.account"), icon: UserIcon },
  ];

  const filteredNav = NAV_ITEMS.filter(
    (n) => !searchQuery || n.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const userInitials = (session.user?.name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[85vh] w-[90vw] max-w-4xl gap-0 overflow-hidden border-neutral-200 bg-white p-0 sm:max-w-4xl dark:border-neutral-700 dark:bg-neutral-900"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        <div className="flex h-[560px] overflow-hidden">
          {/* ── Left nav ── */}
          <div className="flex w-64 flex-shrink-0 flex-col border-e border-neutral-200 p-3 dark:border-neutral-700">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-sm font-semibold text-black dark:text-white">{t("title")}</span>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close settings"
                className="rounded-lg p-1 text-black transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-white dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                <XIcon className="h-[15px] w-[15px]" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-2">
              <SearchIcon className="absolute start-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black dark:text-white" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search")}
                className="w-full rounded-lg bg-neutral-100 py-1.5 ps-8 pe-3 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            {/* Nav items */}
            <nav className="flex-1 space-y-0.5 overflow-y-auto">
              {filteredNav.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSection(n.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-start text-sm transition-colors",
                    section === n.id
                      ? "bg-neutral-100 font-medium text-black dark:bg-neutral-800 dark:text-white"
                      : "text-black hover:bg-neutral-100/60 hover:text-neutral-900 dark:text-white dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100",
                  )}
                >
                  <n.icon
                    className={cn(
                      "h-[18px] w-[18px]",
                      section === n.id ? "text-black dark:text-white" : "text-neutral-500",
                    )}
                  />
                  {n.label}
                </button>
              ))}
            </nav>
          </div>

          {/* ── Right content ── */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Section header */}
            <div className="flex-shrink-0 border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
              <h2 className="text-sm font-semibold text-black capitalize dark:text-white">
                {NAV_ITEMS.find((n) => n.id === section)?.label}
              </h2>
            </div>

            {/* Section body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* ── General ── */}
              {section === "general" && (
                <div className="space-y-0">
                  {/* MFA prompt banner */}
                  <div className="relative mb-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/40">
                    <button
                      type="button"
                      aria-label="Dismiss"
                      className="absolute end-3 top-3 rounded p-1 text-black transition-colors hover:text-neutral-900 dark:text-white dark:hover:text-neutral-100"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <LockIcon className="h-4 w-4 text-black dark:text-white" />
                    </div>
                    <p className="mb-1 text-sm font-semibold text-black dark:text-white">
                      {t("security.mfa.description")}
                    </p>
                    <button
                      type="button"
                      className="mt-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                    >
                      {t("security.mfa.setup")}
                    </button>
                  </div>

                  {/* Appearance */}
                  <SelectRow
                    label={t("appearance.label")}
                    value={theme ?? "system"}
                    options={[
                      { value: "light", label: t("appearance.light") },
                      { value: "dark", label: t("appearance.dark") },
                      { value: "system", label: "System" },
                    ]}
                    onChange={(v) => setTheme(v)}
                  />

                  {/* Language */}
                  <div className="flex items-center justify-between border-b border-neutral-100 py-3.5 last:border-0 dark:border-neutral-800">
                    <span className="text-sm text-black dark:text-white">
                      {t("language.label")}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {LOCALES.map((l) => (
                        <a
                          key={l}
                          href={`/${l}/chat`}
                          lang={l}
                          aria-current={locale === l ? "true" : undefined}
                          className={cn(
                            "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                            locale === l
                              ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                              : "border-neutral-200 text-black hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
                          )}
                        >
                          {localeDisplayNames[l]}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Session timeout */}
                  <SelectRow
                    label={t("sessionTimeout.label")}
                    value={sessionTimeout}
                    options={[
                      { value: "15min", label: t("sessionTimeout.options.15min") },
                      { value: "30min", label: t("sessionTimeout.options.30min") },
                      { value: "1hr", label: t("sessionTimeout.options.1hr") },
                      { value: "4hr", label: t("sessionTimeout.options.4hr") },
                    ]}
                    onChange={setSessionTimeout}
                  />

                  {/* Higher intelligence */}
                  <ToggleRow
                    label={t("higherIntelligence.label")}
                    description={t("higherIntelligence.description")}
                    value={higherIntelligence}
                    onChange={setHigherIntelligence}
                  />
                </div>
              )}

              {/* ── Knowledge base ── */}
              {section === "knowledge" && (
                <div className="space-y-0">
                  <p className="mb-4 text-xs text-black dark:text-white">
                    {t("knowledge.description")}
                  </p>
                  {KNOWLEDGE_BASES.map((kb) => (
                    <div
                      key={kb.name}
                      className="flex items-start justify-between border-b border-neutral-100 py-3.5 last:border-0 dark:border-neutral-800"
                    >
                      <div>
                        <p className="text-sm font-medium text-black dark:text-white">{kb.name}</p>
                        <p className="mt-0.5 text-xs text-black dark:text-white">
                          {kb.docs} · {kb.version} · Updated {kb.updated}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          kb.enabled
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
                        )}
                      >
                        {kb.enabled ? t("knowledge.active") : t("knowledge.inactive")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Notifications ── */}
              {section === "notifications" && (
                <div>
                  <ToggleRow
                    label={t("notifications.email")}
                    description={t("notifications.emailDescription")}
                    value={notifications}
                    onChange={setNotifications}
                  />
                  <ToggleRow
                    label={t("notifications.knowledgeUpdates")}
                    description={t("notifications.knowledgeUpdatesDescription")}
                    value={knowledgeUpdates}
                    onChange={setKnowledgeUpdates}
                  />
                  <ToggleRow
                    label={t("notifications.sessionExpiry")}
                    description={t("notifications.sessionExpiryDescription")}
                    value={sessionExpiry}
                    onChange={setSessionExpiry}
                  />
                </div>
              )}

              {/* ── Privacy ── */}
              {section === "privacy" && (
                <div>
                  <ToggleRow
                    label={t("privacy.saveHistory")}
                    description={t("privacy.saveHistoryDescription")}
                    value={saveHistory}
                    onChange={setSaveHistory}
                  />
                  <ToggleRow
                    label={t("privacy.shareAnalytics")}
                    description={t("privacy.shareAnalyticsDescription")}
                    value={shareAnalytics}
                    onChange={setShareAnalytics}
                  />
                  <div className="mt-4">
                    <button
                      type="button"
                      className="text-sm font-medium text-red-600 transition-opacity hover:opacity-75 dark:text-red-400"
                    >
                      {t("privacy.deleteHistory")}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Security ── */}
              {section === "security" && (
                <div>
                  <div className="border-b border-neutral-100 py-3.5 dark:border-neutral-800">
                    <p className="mb-0.5 text-sm font-medium text-black dark:text-white">
                      {t("security.mfa.title")}
                    </p>
                    <p className="mb-2 text-xs text-black dark:text-white">
                      {t("security.mfa.notEnabled")}
                    </p>
                    <button
                      type="button"
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                    >
                      {t("security.mfa.setup")}
                    </button>
                  </div>
                  <div className="py-3.5">
                    <p className="mb-0.5 text-sm font-medium text-black dark:text-white">
                      {t("security.activeSessions")}
                    </p>
                    <p className="mb-2 text-xs text-black dark:text-white">
                      1 active session · {t("security.lastSeen")}
                    </p>
                    <button
                      type="button"
                      className="text-xs font-medium text-red-600 transition-opacity hover:opacity-75 dark:text-red-400"
                    >
                      {t("security.signOutOthers")}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Account ── */}
              {section === "account" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/40">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <span className="text-sm font-bold text-black dark:text-white">
                        {userInitials}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {session.user?.name ?? "—"}
                      </p>
                      <p className="text-xs text-black dark:text-white">
                        {session.user?.email ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-0">
                    {[
                      [t("account.email"), session.user?.email ?? "—"],
                      [t("account.role"), "General Staff"],
                      [t("account.department"), "African Union Commission"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex justify-between border-b border-neutral-100 py-3 text-sm last:border-0 dark:border-neutral-800"
                      >
                        <span className="text-black dark:text-white">{label}</span>
                        <span className="font-medium text-black dark:text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Sub-components ── */

interface SelectRowProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

function SelectRow({ label, value, options, onChange }: SelectRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 py-3.5 last:border-0 dark:border-neutral-800">
      <span className="text-sm text-black dark:text-white">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none rounded-lg bg-neutral-100 py-1.5 ps-3 pe-8 text-sm text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-neutral-800 dark:text-white"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute end-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black dark:text-white" />
      </div>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, description, value, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-neutral-100 py-3.5 last:border-0 dark:border-neutral-800">
      <div>
        <p className="text-sm font-medium text-black dark:text-white">{label}</p>
        {description && <p className="mt-0.5 text-xs text-black dark:text-white">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          "relative h-6 w-10 flex-shrink-0 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none",
          value ? "bg-blue-500" : "bg-neutral-200 dark:bg-neutral-700",
        )}
      >
        <span
          className={cn(
            "absolute start-1 top-1 h-4 w-4 rounded-full shadow transition-transform",
            value ? "translate-x-4 bg-white" : "translate-x-0 bg-white dark:bg-neutral-300",
          )}
        />
      </button>
    </div>
  );
}

/* ── Inline icons ── */
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function LockIcon({ className }: { className?: string }) {
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
