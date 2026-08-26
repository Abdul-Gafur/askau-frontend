"use client";

import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { siteConfig } from "@/config/site";
import { localeDisplayNames, type Locale } from "@/i18n/config";

// Note: Metadata export not compatible with "use client" —
// settings page metadata is defined in a parent segment or layout.

const LOCALES: Locale[] = ["en", "fr", "ar", "pt"];
const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

/**
 * Settings page — Phase 1 foundation.
 * Provides theme and language settings that work immediately.
 */
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();

  return (
    <main id="main-content" className="flex flex-1 flex-col p-6">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-6 text-xl font-bold">Settings</h1>

        {/* Appearance section */}
        <section className="mb-8" aria-labelledby="appearance-heading">
          <h2
            id="appearance-heading"
            className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Appearance
          </h2>
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Choose your preferred color theme</p>
              </div>
              <div className="flex gap-2" role="radiogroup" aria-label="Theme">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    role="radio"
                    aria-checked={theme === t.value}
                    onClick={() => setTheme(t.value)}
                    className={[
                      "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      theme === t.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Language section */}
        <section className="mb-8" aria-labelledby="language-heading">
          <h2
            id="language-heading"
            className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Language
          </h2>
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Interface Language</p>
                <p className="text-sm text-muted-foreground">
                  Current: {localeDisplayNames[locale as Locale] ?? locale}
                </p>
              </div>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Language">
                {LOCALES.map((l) => (
                  <a
                    key={l}
                    href={`/${l}/settings`}
                    role="radio"
                    aria-checked={locale === l}
                    lang={l}
                    className={[
                      "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      locale === l
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted",
                    ].join(" ")}
                  >
                    {localeDisplayNames[l]}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About section */}
        <section aria-labelledby="about-heading">
          <h2
            id="about-heading"
            className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
          >
            About
          </h2>
          <div className="rounded-xl border border-border bg-surface p-4 text-sm">
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Application</dt>
                <dd className="font-medium">{siteConfig.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Version</dt>
                <dd className="font-mono">{siteConfig.version}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Phase</dt>
                <dd>{siteConfig.phase}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Organisation</dt>
                <dd>{siteConfig.organisation}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
}
