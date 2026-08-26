/**
 * Unit tests for i18n configuration.
 */
import { describe, it, expect } from "vitest";
import {
  locales,
  defaultLocale,
  getLocaleDir,
  isRtlLocale,
  localeDisplayNames,
} from "@/i18n/config";

describe("i18n configuration", () => {
  it("includes all required locales", () => {
    expect(locales).toContain("en");
    expect(locales).toContain("fr");
    expect(locales).toContain("ar");
    expect(locales).toContain("pt");
  });

  it("defaults to English", () => {
    expect(defaultLocale).toBe("en");
  });

  it("returns ltr for English", () => {
    expect(getLocaleDir("en")).toBe("ltr");
  });

  it("returns ltr for French", () => {
    expect(getLocaleDir("fr")).toBe("ltr");
  });

  it("returns rtl for Arabic", () => {
    expect(getLocaleDir("ar")).toBe("rtl");
  });

  it("returns ltr for Portuguese", () => {
    expect(getLocaleDir("pt")).toBe("ltr");
  });

  it("returns ltr for unknown locale (fallback)", () => {
    expect(getLocaleDir("xx")).toBe("ltr");
  });

  it("isRtlLocale returns true only for Arabic", () => {
    expect(isRtlLocale("ar")).toBe(true);
    expect(isRtlLocale("en")).toBe(false);
    expect(isRtlLocale("fr")).toBe(false);
    expect(isRtlLocale("pt")).toBe(false);
  });

  it("has display names for all locales", () => {
    for (const locale of locales) {
      expect(localeDisplayNames[locale]).toBeTruthy();
    }
  });

  it("Arabic display name is in Arabic script", () => {
    expect(localeDisplayNames.ar).toBe("العربية");
  });
});
