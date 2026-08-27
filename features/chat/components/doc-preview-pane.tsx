"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ClassBadge } from "@/components/citations/class-badge";
import type { Source } from "@/features/chat/types";

interface DocPreviewPaneProps {
  source: Source;
  onClose: () => void;
}

/**
 * DocPreviewPane — sliding right panel showing full document metadata and excerpt.
 *
 * Triggered by clicking "Preview" on a SourceCard.
 * Closes on Escape key.
 */
export function DocPreviewPane({ source, onClose }: DocPreviewPaneProps) {
  const t = useTranslations("chat.docPreview");

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const metaRows: [string, string][] = [
    [t("documentType"), source.docType],
    [t("ownerDepartment"), source.department],
    [t("section"), source.section],
    [t("page"), String(source.page)],
    [t("version"), `v${source.version}`],
    [t("published"), source.published],
    [t("effectiveDate"), source.effectiveDate],
    [t("status"), source.status],
  ];

  return (
    <div className="flex h-full w-[400px] min-w-[320px] max-w-[45vw] flex-col border-s border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-neutral-100 dark:border-neutral-800 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-neutral-100 dark:bg-neutral-800">
            <DatabaseIcon className="h-3 w-3 text-black dark:text-white" />
          </div>
          <span className="truncate text-sm font-medium text-black dark:text-white">
            {source.title}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="ms-2 flex-shrink-0 rounded-lg p-1 text-black dark:text-white transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          <XIcon className="h-[15px] w-[15px]" />
        </button>
      </div>

      {/* Classification strip */}
      <div className="flex flex-shrink-0 flex-wrap items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20 px-4 py-2.5">
        <ClassBadge level={source.classification} />
        <span className="text-xs text-black dark:text-white">v{source.version}</span>
        <span className="text-xs text-neutral-400/50 dark:text-neutral-600">·</span>
        <span className="text-xs text-black dark:text-white">{source.docType}</span>
        <span className="text-xs text-neutral-400/50 dark:text-neutral-600">·</span>
        <span className="text-xs text-black dark:text-white">{source.status}</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        {/* Metadata table */}
        <div className="space-y-0 text-sm">
          {metaRows.map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between border-b border-neutral-100 dark:border-neutral-800 py-2.5 last:border-0"
            >
              <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
              <span className="ms-4 text-end font-medium text-black dark:text-white">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Document extract */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {t("documentExtract")}
          </p>
          <div className="space-y-3 text-sm leading-relaxed text-black dark:text-white">
            <p className="font-semibold text-black dark:text-white">{source.section}</p>
            <p className="rounded border border-yellow-200/60 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 text-black dark:text-white">
              &ldquo;{source.excerpt}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-neutral-100 dark:border-neutral-800 px-4 py-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm font-medium text-black dark:text-white transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          <DownloadIcon className="h-[15px] w-[15px]" />
          {t("downloadOriginal")}
        </button>
      </div>
    </div>
  );
}

/* ── Inline icons ── */
function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}
