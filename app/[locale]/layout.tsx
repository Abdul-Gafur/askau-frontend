import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryProvider } from "@/components/ui/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { getLocaleDir } from "@/i18n/config";
import "flag-icons/css/flag-icons.min.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "African Union",
    "AU Commission",
    "knowledge assistant",
    "AI",
    "policies",
    "procedures",
  ],
  authors: [{ name: siteConfig.organisation }],
  creator: siteConfig.organisation,
  robots: {
    // AskAU is an internal enterprise tool — do not index
    index: false,
    follow: false,
  },
  other: {
    // Prevent MS Edge and Chrome from offering translation of internal AU content
    google: "notranslate",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1e2e" },
  ],
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = getLocaleDir(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning // Required by next-themes to prevent hydration mismatch
    >
      <head>
        {/* Preconnect to Google Fonts for Inter and Noto Sans Arabic */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="text-sm">
        {/* Skip to content — accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <QueryProvider>
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster richColors closeButton position="top-right" />
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
