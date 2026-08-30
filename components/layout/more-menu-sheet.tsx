"use client";

import Link from "next/link";
import { Shirt, Receipt, CreditCard, Settings, User, LogOut } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { logoutAction } from "@/features/auth/actions";

const MORE_ITEMS = [
  { href: "/profil", label: "Mon profil", icon: User },
  { href: "/modeles", label: "Modèles", icon: Shirt },
  { href: "/factures", label: "Factures & Documents", icon: Receipt },
  { href: "/paiements", label: "Paiements & Reçus", icon: CreditCard },
  { href: "/parametres", label: "Paramètres de l'atelier", icon: Settings },
] as const;

export interface MoreMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Menu mobile "Plus" — accès aux sections secondaires et profil */
export function MoreMenuSheet({ open, onOpenChange }: MoreMenuSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent size="auto">
        <DrawerHeader>
          <DrawerTitle>Menu de l&apos;atelier</DrawerTitle>
        </DrawerHeader>
        <ul className="flex flex-col gap-1">
          {MORE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium text-text hover:bg-surface-muted active:bg-primary-50 transition-colors"
                >
                  <Icon className="size-5 text-primary-800" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="pt-2 border-t border-border mt-1">
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                void logoutAction();
              }}
              className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium text-danger hover:bg-danger-bg active:bg-danger-bg transition-colors"
            >
              <LogOut className="size-5" aria-hidden="true" />
              Se déconnecter
            </button>
          </li>
        </ul>
      </DrawerContent>
    </Drawer>
  );
}
