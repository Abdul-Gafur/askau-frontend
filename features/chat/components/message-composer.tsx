"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface MessageComposerProps {
  onSend: (
    text: string,
    variant?: "normal" | "insufficient" | "conflicting" | "error",
  ) => void;
  floating?: boolean;
  disabled?: boolean;
}

/**
 * MessageComposer — the pill-shaped chat input box.
 * Matches reference UI styles.
 */
export function MessageComposer({
  onSend,
  floating = false,
  disabled = false,
}: MessageComposerProps) {
  const t = useTranslations("chat");
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  const autosize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;

    // Simulate different variations based on keywords (for demo)
    const lower = text.toLowerCase();
    let variant: "normal" | "insufficient" | "conflicting" | "error" = "normal";

    if (lower.includes("carry") || lower.includes("conflict")) {
      variant = "conflicting";
    } else if (lower.includes("error") || lower.includes("fail")) {
      variant = "error";
    } else if (lower.includes("secret") || lower.includes("classified")) {
      variant = "insufficient";
    }

    onSend(text, variant);
    setValue("");

    if (ref.current) {
      ref.current.style.height = "auto";
    }
  };

  return (
    <div
      className={`relative ${floating ? "mx-auto w-full max-w-2xl" : "w-full"}`}
    >
      <div className="flex items-end gap-2 rounded-[28px] border border-neutral-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900">
        <button
          type="button"
          aria-label={t("attach")}
          className="flex-shrink-0 p-1 text-neutral-400 dark:text-neutral-500 transition-colors hover:text-black dark:hover:text-white"
        >
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            autosize();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={t("placeholder")}
          disabled={disabled}
          className="min-h-[26px] flex-1 resize-none bg-transparent py-0.5 text-sm leading-relaxed text-black placeholder-neutral-400 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed dark:text-white dark:placeholder-neutral-500"
          aria-label={t("placeholder")}
        />

        <button
          type="button"
          onClick={submit}
          disabled={!value.trim() || disabled}
          aria-label={t("send")}
          className="flex-shrink-0 rounded-full bg-blue-500 p-2 text-white transition-opacity hover:opacity-90 disabled:opacity-20 disabled:bg-neutral-200 disabled:text-neutral-400 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600"
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
