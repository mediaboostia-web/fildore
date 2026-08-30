"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  MessageCircle,
  MoreHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MoreMenuSheet } from "./more-menu-sheet";

/**
 * Onglets mobiles : `Accueil | Commandes | Clients | Messages | Plus`
 * (PROJECT_RULES.md §3). Relancer un client est une action quotidienne, elle
 * mérite un onglet ; consulter le catalogue ne l'est pas, Modèles est passé
 * dans « Plus ». Aucun libellé en anglais : « Dashboard » est devenu « Accueil ».
 */
const TAB_ITEMS = [
  { href: "/tableau-de-bord", label: "Accueil", icon: LayoutDashboard },
  { href: "/commandes", label: "Commandes", icon: ClipboardList },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageCircle },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
export function BottomTabBar({ pendingRequestCount = 0 }: { pendingRequestCount?: number }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Navigation mobile principale"
        className="fixed inset-x-0 bottom-0 left-0 right-0 z-50 w-full border-t border-border bg-surface pb-[max(env(safe-area-inset-bottom),0.35rem)] md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="flex h-16 w-full items-center justify-around px-2">
          {TAB_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex flex-1 flex-col items-center justify-center py-1 text-[10px] sm:text-[11px] font-semibold transition-all duration-200 cursor-pointer select-none",
                  active
                    ? "text-primary-950 font-bold"
                    : "text-text-muted hover:text-primary-900"
                )}
              >
                {/* Indicateur de pilule d'icône avec effet de transition couleur */}
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl transition-all duration-200 ease-out",
                    active
                      ? "bg-primary-900 text-white shadow-xs scale-105"
                      : "bg-transparent text-text-muted group-hover:bg-primary-50 group-hover:text-primary-900 active:scale-95"
                  )}
                >
                  <Icon className="size-4.5 shrink-0" aria-hidden="true" />
                </div>
                <span className={cn(
                  "mt-0.5 truncate tracking-tight transition-colors duration-150",
                  active ? "text-primary-950 font-extrabold" : "text-text-muted"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Bouton Plus avec bascule en croix X quand le menu est ouvert */}
          <button
            type="button"
            aria-label={
              moreOpen
                ? "Fermer le menu Plus"
                : pendingRequestCount > 0
                  ? `Ouvrir le menu Plus — ${pendingRequestCount} demande(s) à traiter`
                  : "Ouvrir le menu Plus"
            }
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              "group relative flex flex-1 flex-col items-center justify-center py-1 text-[10px] sm:text-[11px] font-semibold transition-all duration-200 cursor-pointer select-none",
              moreOpen
                ? "text-danger font-bold"
                : "text-text-muted hover:text-primary-900"
            )}
          >
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-xl transition-all duration-200 ease-out",
                moreOpen
                  ? "bg-danger text-white shadow-xs scale-105 rotate-90"
                  : "bg-transparent text-text-muted group-hover:bg-primary-50 group-hover:text-primary-900 active:scale-95"
              )}
            >
              {moreOpen ? (
                <X className="size-4.5 shrink-0" aria-hidden="true" />
              ) : (
                <MoreHorizontal className="size-4.5 shrink-0" aria-hidden="true" />
              )}
              {/* Une demande en attente est dans « Plus » : sans cette pastille,
                  elle resterait invisible depuis l'écran d'accueil mobile. */}
              {!moreOpen && pendingRequestCount > 0 ? (
                <span className="absolute right-0 top-0 flex size-2.5 rounded-full bg-accent-600 ring-2 ring-surface" />
              ) : null}
            </div>
            <span className={cn(
              "mt-0.5 truncate tracking-tight transition-colors duration-150",
              moreOpen ? "text-danger font-extrabold" : "text-text-muted"
            )}>
              {moreOpen ? "Fermer" : "Plus"}
            </span>
          </button>
        </div>
      </nav>

      <MoreMenuSheet
        open={moreOpen}
        onOpenChange={setMoreOpen}
        pendingRequestCount={pendingRequestCount}
      />
    </>
  );
}
