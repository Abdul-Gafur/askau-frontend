/**
 * i18n Configuration
 *
 * Defines supported locales, default locale, and direction mappings.
 * Arabic uses RTL; all other initial locales are LTR.
 */

export const locales = ["en", "fr", "ar", "pt"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Map locale to text direction */
export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
  ar: "rtl",
  pt: "ltr",
};

/** Human-readable locale display names (in the locale's own language) */
export const localeDisplayNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
  pt: "Português",
};

/** Language tags for the HTML lang attribute */
export const localeLangTags: Record<Locale, string> = {
  en: "en",
  fr: "fr",
  ar: "ar",
  pt: "pt",
};

/**
 * Returns the text direction for a given locale.
 * Defaults to "ltr" for unknown locales.
 */
export function getLocaleDir(locale: string): "ltr" | "rtl" {
  return localeDirections[locale as Locale] ?? "ltr";
}

/**
 * Returns true if the locale is RTL.
 */
export function isRtlLocale(locale: string): boolean {
  return getLocaleDir(locale) === "rtl";
}
