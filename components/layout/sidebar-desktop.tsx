"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ClipboardList,
  Users,
  Shirt,
  MessageCircle,
  Receipt,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { logoutAction } from "@/features/auth/actions";
import { NotificationPopover } from "./notification-popover";

const NAV_ITEMS = [
  { href: "/tableau-de-bord", label: "Tableau de bord", icon: LayoutGrid },
  { href: "/commandes", label: "Commandes", icon: ClipboardList },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/modeles", label: "Modèles & Catalogue", icon: Shirt },
  { href: "/messages", label: "Messagerie", icon: MessageCircle },
  { href: "/factures", label: "Factures & Documents", icon: Receipt },
  { href: "/parametres", label: "Paramètres", icon: Settings },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Navigation principale desktop fixe avec déconnexion et notifications. */
export function SidebarDesktop() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="hidden md:flex fixed inset-y-0 left-0 z-40 w-60 flex-col justify-between border-r border-border bg-surface px-3 py-4 overflow-y-auto"
    >
      <div className="space-y-1">
        {/* Logo atelier */}
        <Link
          href="/tableau-de-bord"
          className="mb-4 px-2 text-lg font-bold text-primary-900 tracking-tight flex items-center gap-2"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary-900 text-white text-xs font-black">
            F
          </span>
          <span>Fildor</span>
        </Link>

        {/* Liens principaux */}
        <div className="space-y-1 pt-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-100 text-primary-900"
                    : "text-text-muted hover:bg-surface-muted hover:text-text"
                )}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Section Bas : Notifications, Profil & Déconnexion */}
      <div className="border-t border-border pt-3 space-y-1">
        {/* Bouton de notifications */}
        <NotificationPopover />

        {/* Lien Mon profil */}
        <Link
          href="/profil"
          className={cn(
            "flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-sm font-medium transition-colors",
            pathname === "/profil"
              ? "bg-primary-100 text-primary-900"
              : "text-text-muted hover:bg-surface-muted hover:text-text"
          )}
        >
          <User className="size-5 shrink-0 text-text-muted" aria-hidden="true" />
          <span>Mon profil</span>
        </Link>

        {/* Bouton de déconnexion direct */}
        <form action={logoutAction} className="w-full">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-sm font-medium text-danger hover:bg-danger-bg transition-colors cursor-pointer"
          >
            <LogOut className="size-5 shrink-0" aria-hidden="true" />
            <span>Se déconnecter</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
