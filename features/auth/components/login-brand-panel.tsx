import { FileTextIcon, LockIcon, ShieldCheckIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/config/site";

const TRUST_SIGNALS = [
  { key: "trust.sso", Icon: ShieldCheckIcon },
  { key: "trust.cited", Icon: FileTextIcon },
  { key: "trust.restricted", Icon: LockIcon },
] as const;

/**
 * LoginBrandPanel — the institutional half of the login page.
 *
 * Carries the identity, positioning line, trust signals and security notice, so the
 * sign-in card beside it stays a single uncluttered action.
 *
 * Skinned with the --sidebar tokens - the same treatment the app gives its own
 * persistent side chrome - so login matches the shipped application palette.
 *
 * Hidden below `md`, where the layout collapses to the centred card alone.
 * Uses logical properties (border-e) so it mirrors to the opposite side in Arabic.
 */
export async function LoginBrandPanel() {
  const t = await getTranslations("auth");

  return (
    <aside className="hidden w-[42%] max-w-xl flex-col justify-between border-e border-panel-border bg-panel p-10 text-panel-foreground md:flex">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background">
          AU
        </span>
        <span className="text-base font-semibold">{siteConfig.name}</span>
      </div>

      <div className="my-10">
        <p className="text-xl leading-snug font-semibold">{t("brandHeadline")}</p>
        <p className="mt-3 text-sm leading-relaxed text-panel-muted-foreground">{t("brandBody")}</p>
      </div>

      <div>
        <ul className="space-y-3.5">
          {TRUST_SIGNALS.map(({ key, Icon }) => (
            <li key={key} className="flex items-start gap-3">
              <Icon
                className="mt-0.5 size-4 shrink-0 text-panel-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-xs leading-relaxed text-panel-muted-foreground">{t(key)}</span>
            </li>
          ))}
        </ul>

        <p className="mt-8 border-t border-panel-border pt-5 text-xs text-panel-muted-foreground">
          {t("securityNotice")}
        </p>
      </div>
    </aside>
  );
}
