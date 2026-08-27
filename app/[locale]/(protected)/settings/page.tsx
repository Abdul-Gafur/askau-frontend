import { redirect } from "next/navigation";

/**
 * Settings page — redirects to /chat.
 *
 * Settings are now accessed via the modal opened from the sidebar gear icon,
 * consistent with the patterns used by Gemini, Claude, and ChatGPT.
 * This redirect ensures any direct navigation to /settings still works gracefully.
 */
export default function SettingsPage() {
  redirect("/chat");
}
