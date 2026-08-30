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
 * Navigation mobile 100% pleine largeur fixe et opaque :
 * Occupe toute la largeur du bas de l'écran (left-0 right-0 w-full),
 * fond totalement blanc et opaque pour masquer les contenus qui défilent derrière,
 * bordure supérieure nette et gestion de la zone de sécurité (safe-area).
 */
export function BottomTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Navigation mobile principale"
        className="fixed inset-x-0 bottom-0 left-0 right-0 z-50 w-full border-t border-border bg-surface pb-[max(env(safe-area-inset-bottom),0.35rem)] md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="flex h-15 w-full items-center justify-around px-2">
          {TAB_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center py-1 text-[11px] font-semibold transition-all duration-150",
                  active
                    ? "text-primary-900 font-bold"
                    : "text-text-muted hover:text-text"
                )}
              >
                <div
                  className={cn(
                    "flex size-8.5 items-center justify-center rounded-xl transition-all",
                    active ? "bg-primary-900 text-white shadow-xs scale-105" : "bg-transparent"
                  )}
                >
                  <Icon className="size-4.5 shrink-0" aria-hidden="true" />
                </div>
                <span className="mt-0.5 truncate text-[10px] sm:text-[11px]">{item.label}</span>
              </Link>
            );
          })}

          {/* Bouton Plus */}
          <button
            type="button"
            aria-label="Ouvrir le menu Plus"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center py-1 text-[11px] font-semibold transition-all duration-150 cursor-pointer",
              moreOpen ? "text-primary-900 font-bold" : "text-text-muted hover:text-text"
            )}
          >
            <div
              className={cn(
                "flex size-8.5 items-center justify-center rounded-xl transition-all",
                moreOpen ? "bg-primary-900 text-white shadow-xs scale-105" : "bg-transparent"
              )}
            >
              <MoreHorizontal className="size-4.5 shrink-0" aria-hidden="true" />
            </div>
            <span className="mt-0.5 truncate text-[10px] sm:text-[11px]">Plus</span>
          </button>
        </div>
      </nav>

      <MoreMenuSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </>
  );
}
