import { useTranslations } from "next-intl";
import { MessageComposer } from "./message-composer";

interface WelcomeScreenProps {
  userName?: string | null;
  onSend: (
    text: string,
    variant?: "normal" | "insufficient" | "conflicting" | "error",
  ) => void;
}

const SUGGESTED_PROMPT_KEYS = [
  "suggestedPrompts.leavePolicy",
  "suggestedPrompts.procurementProcess",
  "suggestedPrompts.travelPolicy",
  "suggestedPrompts.annualLeaveSteps",
] as const;

export function WelcomeScreen({ onSend, userName }: WelcomeScreenProps) {
  const t = useTranslations("chat");

  return (
    <div className="flex h-full w-full max-w-3xl animate-fade-in flex-col items-center justify-center p-6 text-center mx-auto">

      <h1 className="mb-3 text-3xl font-semibold tracking-tight text-black dark:text-white">
        {t("welcomeHeading", { name: userName || "User" })}
      </h1>
      <p className="mb-10 max-w-lg text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        {t("welcomeSubtitle")}
      </p>

      <MessageComposer onSend={onSend} floating />

      <div className="mt-12 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-2">
        {SUGGESTED_PROMPT_KEYS.map((key) => {
          const prompt = t(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSend(prompt)}
              className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700 shadow-sm transition-all hover:border-neutral-300 hover:shadow dark:border-neutral-700/80 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600"
            >
              <span className="truncate pr-4">{prompt}</span>
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="translate-x-1 text-neutral-400 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
