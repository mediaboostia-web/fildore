"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardList,
  Users,
  Shirt,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MoreMenuSheet } from "./more-menu-sheet";

const TAB_ITEMS = [
  { href: "/tableau-de-bord", label: "Accueil", icon: Home },
  { href: "/commandes", label: "Commandes", icon: ClipboardList },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/modeles", label: "Modèles", icon: Shirt },
  { href: "/messages", label: "Messages", icon: MessageCircle },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Navigation mobile pleine largeur fixe :
 * S'étend sur toute la largeur de l'écran avec 5 onglets directs + menu Plus,
 * fond solide avec léger flou, bordure supérieure nette et gestion de la zone de sécurité (safe-area).
 */
export function BottomTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Navigation mobile principale"
        className="fixed inset-x-0 bottom-0 z-40 w-full border-t border-border bg-surface/98 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden shadow-lg"
      >
        <div className="flex h-16 w-full items-center justify-around px-1">
          {TAB_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center py-1 text-[11px] font-semibold transition-colors duration-150",
                  active
                    ? "text-primary-900 font-bold"
                    : "text-text-muted hover:text-text"
                )}
              >
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl transition-all",
                    active ? "bg-primary-100 text-primary-900 scale-105" : "bg-transparent"
                  )}
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                </div>
                <span className="mt-0.5 truncate">{item.label}</span>
              </Link>
            );
          })}

          {/* Bouton Plus */}
          <button
            type="button"
            aria-label="Ouvrir le menu Plus"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center py-1 text-[11px] font-semibold transition-colors duration-150 cursor-pointer",
              moreOpen ? "text-primary-900 font-bold" : "text-text-muted hover:text-text"
            )}
          >
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-xl transition-all",
                moreOpen ? "bg-primary-100 text-primary-900 scale-105" : "bg-transparent"
              )}
            >
              <MoreHorizontal className="size-5 shrink-0" aria-hidden="true" />
            </div>
            <span className="mt-0.5 truncate">Plus</span>
          </button>
        </div>
      </nav>

      <MoreMenuSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </>
  );
}
