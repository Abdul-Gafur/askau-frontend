import { cn } from "@/lib/utils";
import type { ClassLevel } from "@/features/chat/types";

interface ClassBadgeProps {
  level: ClassLevel;
  className?: string;
}

const BADGE_STYLES: Record<ClassLevel, string> = {
  PUBLIC:
    "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
  INTERNAL:
    "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
  CONFIDENTIAL:
    "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  HIGHLY_RESTRICTED:
    "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
};

/**
 * ClassBadge — displays a document classification level badge.
 *
 * Used by SourceCard and DocPreviewPane.
 * Shared under components/citations/ as it may be reused across features.
 */
export function ClassBadge({ level, className }: ClassBadgeProps) {
  const label: Record<ClassLevel, string> = {
    PUBLIC: "Public",
    INTERNAL: "Internal",
    CONFIDENTIAL: "Confidential",
    HIGHLY_RESTRICTED: "Highly Restricted",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wider",
        BADGE_STYLES[level],
        className,
      )}
    >
      {label[level]}
    </span>
  );
}
