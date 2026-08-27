"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface GroundingPillProps {
  count: number;
  retrievedAt: Date;
}

/**
 * GroundingPill — "Grounded in N approved sources" clickable badge.
 *
 * Expands on click to show source count, retrieval time, and knowledge base.
 */
export function GroundingPill({ count, retrievedAt }: GroundingPillProps) {
  const t = useTranslations("chat.grounding");
  const [open, setOpen] = useState(false);

  const formattedTime = retrievedAt.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-500 transition-opacity hover:opacity-80"
        aria-expanded={open}
      >
        {/* Check icon */}
        <svg
          width={13}
          height={13}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {count === 1 ? t("groundedIn", { count }) : t("groundedInPlural", { count })}
        {/* Chevron */}
        <svg
          width={12}
          height={12}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute start-0 top-full z-20 mt-1.5 w-64 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 shadow-lg">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
              <span>{t("sourcesRetrieved")}</span>
              <span className="font-medium text-black dark:text-white">
                {t("documents", { count })}
              </span>
            </div>
            <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
              <span>{t("retrieved")}</span>
              <span className="font-medium text-black dark:text-white">{formattedTime}</span>
            </div>
            <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
              <span>{t("knowledgeBase")}</span>
              <span className="font-medium text-black dark:text-white">Policy Repo v2.6</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
