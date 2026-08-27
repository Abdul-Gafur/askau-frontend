"use client";

import { useTranslations } from "next-intl";
import type { FeedbackType, NotHelpfulReason } from "@/features/chat/types";

interface FeedbackBarProps {
  feedback: FeedbackType | null;
  notHelpfulReason: NotHelpfulReason;
  onFeedback: (f: FeedbackType) => void;
  onReason: (r: NotHelpfulReason) => void;
}

const NOT_HELPFUL_REASON_KEYS: { id: NonNullable<NotHelpfulReason>; key: string }[] = [
  { id: "incorrect", key: "reasons.incorrect" },
  { id: "irrelevant", key: "reasons.irrelevant" },
  { id: "missing-source", key: "reasons.missingSource" },
  { id: "outdated", key: "reasons.outdated" },
  { id: "other", key: "reasons.other" },
];

/**
 * FeedbackBar — thumbs up/down, retry, copy, more actions.
 *
 * When "not helpful" is selected, shows reason chips.
 * Once a reason is chosen, shows "Feedback recorded" confirmation.
 */
export function FeedbackBar({
  feedback,
  notHelpfulReason,
  onFeedback,
  onReason,
}: FeedbackBarProps) {
  const t = useTranslations("chat.feedback");

  const isHelpful = feedback === "helpful";
  const isNotHelpful = feedback === "not-helpful";
  const confirmed =
    (isHelpful) || (isNotHelpful && notHelpfulReason !== null);

  return (
    <div className="mt-3 space-y-2">
      {confirmed ? (
        <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
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
          {t("submitted")}
        </span>
      ) : (
        <div className="flex items-center gap-1">
          {/* Thumbs up */}
          <button
            type="button"
            onClick={() => onFeedback("helpful")}
            title={t("helpful")}
            aria-label={t("helpful")}
            className={`rounded-lg p-1.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
              isHelpful
                ? "text-green-600 dark:text-green-500"
                : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <svg
              width={15}
              height={15}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
            </svg>
          </button>

          {/* Thumbs down */}
          <button
            type="button"
            onClick={() => onFeedback("not-helpful")}
            title={t("notHelpful")}
            aria-label={t("notHelpful")}
            className={`rounded-lg p-1.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
              isNotHelpful
                ? "text-red-500 dark:text-red-400"
                : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <svg
              width={15}
              height={15}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zM17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
            </svg>
          </button>

          {/* Retry */}
          <button
            type="button"
            title={t("retry")}
            aria-label={t("retry")}
            className="rounded-lg p-1.5 text-neutral-400 dark:text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <svg
              width={15}
              height={15}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
          </button>

          {/* Copy */}
          <button
            type="button"
            title={t("copy")}
            aria-label={t("copy")}
            className="rounded-lg p-1.5 text-neutral-400 dark:text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <svg
              width={15}
              height={15}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </button>

          {/* More */}
          <button
            type="button"
            title={t("more")}
            aria-label={t("more")}
            className="rounded-lg p-1.5 text-neutral-400 dark:text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <svg
              width={15}
              height={15}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      )}

      {/* Not-helpful reason chips */}
      {isNotHelpful && !notHelpfulReason && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {NOT_HELPFUL_REASON_KEYS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onReason(r.id)}
              className="rounded-full border border-neutral-200 dark:border-neutral-700 px-2.5 py-1 text-xs text-neutral-600 dark:text-neutral-400 transition-colors hover:border-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 dark:hover:border-neutral-500"
            >
              {t(r.key)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
