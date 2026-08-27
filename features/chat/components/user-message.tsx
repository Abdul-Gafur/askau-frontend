import type { Message } from "@/features/chat/types";

interface UserMessageProps {
  message: Message;
}

/**
 * UserMessage — right-aligned user message bubble.
 */
export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex justify-end py-5">
      <div className="max-w-[78%] rounded-[22px] rounded-tr-lg bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
        <p className="text-[16px] leading-relaxed text-black dark:text-white">{message.content}</p>
      </div>
    </div>
  );
}
