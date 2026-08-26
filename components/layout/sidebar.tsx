"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { Session } from "next-auth";

interface NavItem {
  href: string;
  label: string;
  emoji: string;
  ariaLabel: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/chat", label: "Chat", emoji: "💬", ariaLabel: "Chat" },
  { href: "/conversations", label: "Conversations", emoji: "📋", ariaLabel: "Conversations" },
  { href: "/settings", label: "Settings", emoji: "⚙️", ariaLabel: "Settings" },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
  session: Session;
}

/**
 * Application Sidebar.
 *
 * On desktop (md+): sticky column on the left.
 * On mobile: slides in as an overlay drawer.
 *
 * Uses CSS logical properties (ms-*, ps-*, etc.) for RTL compatibility.
 * Uses aria-current="page" for active link accessibility.
 */
export function AppSidebar({ open, onClose, session: _ }: AppSidebarProps) {
  const pathname = usePathname();

  // Close sidebar on escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const sidebarContent = (
    <nav
      id="sidebar"
      aria-label="Main navigation"
      className="flex h-full w-56 flex-col border-e border-sidebar-border bg-sidebar py-4"
    >
      <ul className="flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/chat"
              ? pathname === "/chat" || pathname.startsWith("/chat/")
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.ariaLabel}
                onClick={onClose}
                className={[
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                ].join(" ")}
              >
                <span aria-hidden="true" className="text-base">
                  {item.emoji}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom: version info */}
      <div className="mt-auto px-4 pb-2">
        <p className="text-xs text-sidebar-muted-foreground">
          AskAU v{process.env["NEXT_PUBLIC_APP_VERSION"] ?? "0.1.0"}
        </p>
        <p className="text-xs text-sidebar-muted-foreground">Phase 1 — Foundation</p>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden md:flex">{sidebarContent}</div>

      {/* Mobile: drawer overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-hidden="true"
            onClick={onClose}
          />
          {/* Drawer */}
          <div
            className="fixed inset-y-0 start-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
