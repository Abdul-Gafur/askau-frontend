"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ClassBadge } from "@/components/citations/class-badge";
import type { Source } from "@/features/chat/types";

interface SourceCardProps {
  source: Source;
  onPreview: (source: Source) => void;
  onDownload: (source: Source) => void;
}

/**
 * SourceCard — compact citation card displayed below AI responses.
 *
 * Shows document title, classification, section info, and
 * Preview / Download actions.
 */
export function SourceCard({ source, onPreview, onDownload }: SourceCardProps) {
  const t = useTranslations("chat.sourceCard");
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    onDownload(source);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 1200);
  };

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600">
      {/* Icon */}
      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-black dark:text-white"
          aria-hidden="true"
        >
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-snug font-medium text-black dark:text-white">
            {source.title}
          </p>
          <ClassBadge level={source.classification} />
        </div>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          {source.section} · p.{source.page} · v{source.version}
        </p>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onPreview(source)}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 transition-opacity hover:opacity-75 dark:text-blue-400"
          >
            <svg
              width={12}
              height={12}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {t("preview")}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1 text-xs text-neutral-500 transition-colors hover:text-neutral-900 disabled:opacity-50 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            {downloading ? (
              <>
                <span className="inline-block h-3 w-3 animate-spin rounded-full border border-neutral-500 border-t-transparent dark:border-neutral-400" />
                {t("downloading")}
              </>
            ) : downloaded ? (
              <>
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600 dark:text-green-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t("downloaded")}
              </>
            ) : (
              <>
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                {t("download")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
