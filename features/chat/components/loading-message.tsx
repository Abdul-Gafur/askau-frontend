import { useTranslations } from "next-intl";

interface LoadingMessageProps {
  step: number;
}

const STEP_KEYS = [
  "loading.searching",
  "loading.reviewing",
  "loading.preparing",
] as const;

export function LoadingMessage({ step }: LoadingMessageProps) {
  const t = useTranslations("chat");

  return (
    <div className="py-5">
      <div className="space-y-2 text-sm">
        {STEP_KEYS.map((key, i) => (
          <div
            key={key}
            className={`flex items-center gap-2.5 transition-all ${
              i < step
                ? "text-neutral-400 dark:text-neutral-600"
                : i === step
                  ? "text-neutral-700 dark:text-neutral-300"
                  : "text-neutral-300 dark:text-neutral-700"
            }`}
          >
            {i < step ? (
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 text-green-600 dark:text-green-500"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : i === step ? (
              <span className="flex flex-shrink-0 gap-0.5" aria-hidden="true">
                <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:0ms]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
              </span>
            ) : (
              <span className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            )}
            {t(key)}
          </div>
        ))}
      </div>
    </div>
  );
}
