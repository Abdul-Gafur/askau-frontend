/**
 * Site configuration for AskAU.
 */
export const siteConfig = {
  name: "AskAU",
  fullName: "AskAU — AUC AI Knowledge Assistant",
  description:
    "Your AI-powered knowledge assistant for the African Union Commission. Ask questions about AU policies, procedures, and official documents.",
  organisation: "African Union Commission",
  organisationShort: "AU Commission",
  url: process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000",
  version: process.env["NEXT_PUBLIC_APP_VERSION"] ?? "0.1.0",
  /** Phase identifier for UI display */
  phase: "Phase 1 — Foundation",
  /** Support contact */
  supportEmail: "ict-helpdesk@africaunion.org",
} as const;
