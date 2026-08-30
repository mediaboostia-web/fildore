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
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/tableau-de-bord", label: "Tableau de bord", icon: LayoutGrid },
  { href: "/commandes", label: "Commandes", icon: ClipboardList },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/modeles", label: "Modèles & Catalogue", icon: Shirt },
  { href: "/messages", label: "Messagerie", icon: MessageCircle },
  { href: "/factures", label: "Factures & Paiements", icon: Receipt },
  { href: "/parametres", label: "Paramètres", icon: Settings },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Navigation principale desktop. Périmètre volontairement restreint à cette phase :
 * pas de Projets / Équipe / Rapports (hors scope, voir consigne de mission). */
export function SidebarDesktop() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="hidden md:flex fixed inset-y-0 left-0 z-40 w-60 flex-col gap-1 border-r border-border bg-surface px-3 py-4 overflow-y-auto"
    >
      <Link href="/tableau-de-bord" className="mb-4 px-2 text-lg font-bold text-primary-900 tracking-tight flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary-900 text-white text-xs font-black">F</span>
        <span>Fildor</span>
      </Link>
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
    </nav>
  );
}
