"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FildorLogo } from "@/components/brand/fildor-logo";
import {
  LayoutGrid,
  ClipboardList,
  Users,
  Shirt,
  Inbox,
  MessageCircle,
  Receipt,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { logoutAction } from "@/features/auth/actions";
import { useSidebar } from "./sidebar-context";

const NAV_ITEMS = [
  { href: "/tableau-de-bord", label: "Tableau de bord", icon: LayoutGrid },
  { href: "/commandes", label: "Commandes", icon: ClipboardList },
  { href: "/demandes", label: "Demandes en ligne", icon: Inbox },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/modeles", label: "Modèles", icon: Shirt },
  { href: "/messages", label: "Relances", icon: MessageCircle },
  { href: "/factures", label: "Factures", icon: Receipt },
  { href: "/paiements", label: "Paiements", icon: CreditCard },
  { href: "/parametres", label: "Paramètres", icon: Settings },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Navigation principale desktop rétractable avec action commande & déconnexion en bas. */
export function SidebarDesktop({ pendingRequestCount = 0 }: { pendingRequestCount?: number }) {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <nav
      aria-label="Navigation principale"
      className={cn(
        "hidden md:flex fixed inset-y-0 left-0 z-40 flex-col justify-between border-r border-border bg-surface px-3 py-4 transition-all duration-200 overflow-y-auto overflow-x-hidden",
        isCollapsed ? "w-18" : "w-60"
      )}
    >
      <div className="space-y-2">
        {/* En-tête : Logo & Bouton de réduction */}
        <div className="flex items-center justify-between px-1 mb-3">
          <Link
            href="/tableau-de-bord"
            className="flex items-center gap-2.5 group overflow-hidden"
            title="Fildor"
          >
            {isCollapsed ? (
              <FildorLogo
                variant="mark"
                height={30}
                className="shrink-0 transition-transform group-hover:scale-105"
              />
            ) : (
              <FildorLogo
                variant="lockup"
                height={28}
                className="shrink-0 transition-transform group-hover:scale-105"
              />
            )}
          </Link>

          {/* Bouton de réduction / déploiement de la sidebar */}
          <button
            type="button"
            onClick={toggleCollapsed}
            title={isCollapsed ? "Déplier le menu" : "Réduire le menu"}
            className="flex size-7 items-center justify-center rounded-lg border border-border bg-surface-muted text-text-muted hover:bg-border/60 hover:text-text transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronRight className="size-4 shrink-0" />
            ) : (
              <ChevronLeft className="size-4 shrink-0" />
            )}
          </button>
        </div>

        {/* Liens principaux */}
        <div className="space-y-1 pt-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            // Le compteur ne s'affiche que s'il y a réellement quelque chose à
            // traiter : une pastille « 0 » attire l'œil pour rien.
            const badge = item.href === "/demandes" && pendingRequestCount > 0
              ? pendingRequestCount
              : null;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={badge ? `${item.label} — ${badge} à traiter` : item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center px-0" : "",
                  active
                    ? "bg-primary-100 text-primary-900 font-semibold"
                    : "text-text-muted hover:bg-surface-muted hover:text-text"
                )}
              >
                <span className="relative flex shrink-0">
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  {badge && isCollapsed ? (
                    <span className="absolute -right-1.5 -top-1.5 flex size-2.5 rounded-full bg-accent-600 ring-2 ring-surface" />
                  ) : null}
                </span>
                {!isCollapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {badge ? (
                      <span className="ml-auto rounded-full bg-accent-600 px-1.5 text-[10px] font-bold leading-4 text-white">
                        {badge}
                      </span>
                    ) : null}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Actions en bas de la sidebar : Nouvelle commande + Déconnexion */}
      <div className="border-t border-border pt-3 space-y-2">
        <Link
          href="/commandes/nouveau/client"
          title="Nouvelle commande"
          className={cn(
            "flex items-center gap-2 rounded-xl bg-primary-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-800 active:scale-[0.98] transition-all",
            isCollapsed ? "justify-center px-0 size-11 mx-auto" : "w-full justify-center"
          )}
        >
          <Plus className="size-4.5 shrink-0 text-white" aria-hidden="true" />
          {!isCollapsed && <span className="truncate">Nouvelle commande</span>}
        </Link>

        <form action={logoutAction} className="w-full">
          <button
            type="submit"
            title="Se déconnecter"
            className={cn(
              "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-danger hover:bg-danger-bg transition-colors cursor-pointer",
              isCollapsed ? "justify-center px-0" : ""
            )}
          >
            <LogOut className="size-4.5 shrink-0" aria-hidden="true" />
            {!isCollapsed && <span className="truncate">Se déconnecter</span>}
          </button>
        </form>
      </div>
    </nav>
  );
}
