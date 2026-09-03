"use client";

import { useTranslations } from "next-intl";
import { SourceCard } from "@/components/citations/source-card";
import { GroundingPill } from "./grounding-pill";
import { FeedbackBar } from "./feedback-bar";
import type { FeedbackType, Message, NotHelpfulReason, Source } from "@/features/chat/types";

interface AIMessageProps {
  message: Message;
  onFeedback: (id: string, f: FeedbackType) => void;
  onReason: (id: string, r: NotHelpfulReason) => void;
  onPreview: (source: Source) => void;
}

/**
 * AIMessage — renders an AI response with state-conditional UI.
 * Matches reference UI styling.
 */
/**
 * Open a source's authoritative original.
 *
 * `accessUrl` is vended by the backend and points at
 * `/api/v1/documents/{id}/open`, which redirects to the document in its own
 * repository — AskAU never serves the file, so it does not become the system of
 * record. The redirect is also audited, which is the point: opening a document
 * is an access event and has to be recorded as one.
 *
 * Absent `accessUrl` means the reader may not open it (grounding and opening are
 * separate permissions), so nothing happens rather than a broken link.
 */
function openSource(source: Source) {
  if (!source.accessUrl) return;
  window.open(source.accessUrl, "_blank", "noopener,noreferrer");
}

export function AIMessage({ message, onFeedback, onReason, onPreview }: AIMessageProps) {
  const t = useTranslations("chat.states");

  return (
    <div className="border-b border-neutral-100 py-5 last:border-0 dark:border-neutral-800">
      {/* ── Insufficient evidence ── */}
      {message.state === "insufficient" && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/40">
            <InfoIcon className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-black dark:text-white" />
            <div>
              <p className="mb-1 text-sm font-semibold text-black dark:text-white">
                {t("insufficient.title")}
              </p>
              <p className="text-sm leading-relaxed text-black dark:text-white">
                {t("insufficient.description")}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              {t("insufficient.suggestedSteps")}
            </p>
            {(["refine", "related", "contact", "browse"] as const).map((step) => (
              <button
                key={step}
                type="button"
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-start text-sm text-black transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:text-white dark:hover:border-neutral-800 dark:hover:bg-neutral-900/20"
              >
                {t(`insufficient.steps.${step}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {message.state === "error" && (
        <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/40">
          <InfoIcon className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-red-500 dark:text-red-400" />
          <div>
            <p className="mb-1 text-sm font-semibold text-black dark:text-white">
              {t("error.title")}
            </p>
            <p className="mb-3 text-sm text-black dark:text-white">{t("error.description")}</p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
              >
                {t("error.tryAgain")}
              </button>
              <button
                type="button"
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-black transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
              >
                {t("error.newConversation")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Conflicting sources ── */}
      {message.state === "conflicting" && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-3 dark:border-orange-900/50 dark:bg-orange-900/20">
            <WarningIcon className="mt-0.5 h-[15px] w-[15px] flex-shrink-0 text-orange-700 dark:text-orange-400" />
            <div>
              <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                {t("conflicting.title")}
              </p>
              <p className="mt-0.5 text-xs text-orange-700/80 dark:text-orange-400/80">
                {t("conflicting.description")}
              </p>
            </div>
          </div>
          <p className="text-[16px] leading-relaxed whitespace-pre-line text-black dark:text-white">
            {message.content}
          </p>
          {message.conflictingSources && (
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                {t("conflicting.sources")}
              </p>
              {message.conflictingSources.map((s) => (
                <SourceCard key={s.id} source={s} onPreview={onPreview} onDownload={openSource} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Outdated source ── */}
      {message.state === "outdated" && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-3 dark:border-orange-900/50 dark:bg-orange-900/20">
            <WarningIcon className="mt-0.5 h-[15px] w-[15px] flex-shrink-0 text-orange-700 dark:text-orange-400" />
            <div>
              <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                {t("outdated.title")}
              </p>
            </div>
          </div>
          <p className="text-[16px] leading-relaxed whitespace-pre-line text-black dark:text-white">
            {message.content}
          </p>
        </div>
      )}

      {/* ── Grounded (standard) ── */}
      {message.state === "grounded" && (
        <div className="space-y-4">
          <p className="text-[16px] leading-relaxed whitespace-pre-line text-black dark:text-white">
            {message.content}
          </p>

          <GroundingPill
            count={message.groundingCount ?? 0}
            retrievedAt={message.retrievedAt ?? message.timestamp}
          />

          {message.sources && message.sources.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                {t("grounded.sources")}
              </p>
              <div className="space-y-2">
                {message.sources.map((s) => (
                  <SourceCard key={s.id} source={s} onPreview={onPreview} onDownload={openSource} />
                ))}
              </div>
            </div>
          )}

          <FeedbackBar
            feedback={message.feedback ?? null}
            notHelpfulReason={message.notHelpfulReason ?? null}
            onFeedback={(f) => onFeedback(message.id, f)}
            onReason={(r) => onReason(message.id, r)}
          />
        </div>
      )}
    </div>
  );
}

/* ── Inline icon helpers ── */

function InfoIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="8.01" />
      <line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
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
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
