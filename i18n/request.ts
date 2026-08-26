import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * next-intl request configuration.
 *
 * This file is referenced in next.config.ts via:
 *   createNextIntlPlugin("./i18n/request.ts")
 *
 * It loads the locale message files for every server request.
 * Messages are split by namespace to enable code-splitting.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the [locale] segment
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const [common, navigation, chat, citations, errors, settings, auth] = await Promise.all([
    import(`./locales/${locale}/common.json`),
    import(`./locales/${locale}/navigation.json`),
    import(`./locales/${locale}/chat.json`),
    import(`./locales/${locale}/citations.json`),
    import(`./locales/${locale}/errors.json`),
    import(`./locales/${locale}/settings.json`),
    import(`./locales/${locale}/auth.json`),
  ]);

  return {
    locale,
    messages: {
      common: common.default,
      navigation: navigation.default,
      chat: chat.default,
      citations: citations.default,
      errors: errors.default,
      settings: settings.default,
      auth: auth.default,
    },
  };
});
