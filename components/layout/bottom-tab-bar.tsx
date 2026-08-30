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

/** Navigation mobile — zones tactiles ≥ 44×44 px (PROJECT_RULES.md §3). */
export function BottomTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] shadow-lg md:hidden"
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
                "flex flex-1 flex-col items-center justify-center gap-1 py-1.5 text-xs font-medium transition-colors active:bg-surface-muted",
                active ? "text-primary-900 font-semibold" : "text-text-muted hover:text-text"
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          aria-label="Ouvrir le menu Plus"
          onClick={() => setMoreOpen(true)}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-1.5 text-xs font-medium transition-colors active:bg-surface-muted cursor-pointer",
            moreOpen ? "text-primary-900 font-semibold" : "text-text-muted hover:text-text"
          )}
        >
          <MoreHorizontal className="size-5" aria-hidden="true" />
          <span>Plus</span>
        </button>
      </nav>
      <MoreMenuSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </>
  );
}
