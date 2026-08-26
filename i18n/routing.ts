import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./config";

/**
 * next-intl routing configuration.
 *
 * Uses prefix-based routing: /{locale}/...
 * The default locale (en) is NOT prefixed so that
 * existing bookmarks and SEO links work without a locale prefix.
 *
 * NOTE: When the default locale is not prefixed, the canonical
 * URL for English content is "/chat" rather than "/en/chat".
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always prefix the locale (e.g., /en/chat)
  localePrefix: "always",
});
