"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Users, MessageCircle, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MoreMenuSheet } from "./more-menu-sheet";

const TAB_ITEMS = [
  { href: "/tableau-de-bord", label: "Accueil", icon: Home },
  { href: "/commandes", label: "Commandes", icon: ClipboardList },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageCircle },
] as const;

function isActive(pathname: string, href: string): boolean {
  return pathname.startsWith(href);
}

/**
 * Navigation mobile inspirée du Mac OS Dock :
 * Barre flottante avec effet de verre dépoli, pastilles d'icônes tactiles et retour d'état instantané.
 */
export function BottomTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-3 z-40 flex justify-center px-4 md:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]">
        <nav
          aria-label="Navigation mobile"
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-border/80 bg-surface/92 px-2.5 py-1.5 shadow-2xl backdrop-blur-xl transition-all"
        >
          {TAB_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex size-12 flex-col items-center justify-center rounded-full text-xs font-semibold transition-all duration-150 active:scale-90",
                  active
                    ? "bg-primary-900 text-white shadow-md shadow-primary-950/20"
                    : "text-text-muted hover:bg-surface-muted hover:text-text"
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                {active && (
                  <span className="absolute -bottom-1 size-1 rounded-full bg-primary-900 md:hidden" />
                )}
              </Link>
            );
          })}

          {/* Séparateur subtil dock */}
          <span className="h-6 w-px bg-border/80 mx-0.5" />

          {/* Bouton Plus */}
          <button
            type="button"
            aria-label="Ouvrir le menu Plus"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "relative flex size-12 flex-col items-center justify-center rounded-full text-xs font-semibold transition-all duration-150 active:scale-90 cursor-pointer",
              moreOpen
                ? "bg-primary-900 text-white shadow-md shadow-primary-950/20"
                : "text-text-muted hover:bg-surface-muted hover:text-text"
            )}
          >
            <MoreHorizontal className="size-5" aria-hidden="true" />
          </button>
        </nav>
      </div>

      <MoreMenuSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </>
  );
}
