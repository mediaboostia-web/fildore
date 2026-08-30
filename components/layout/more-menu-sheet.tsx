"use client";

import Link from "next/link";
import {
  Inbox,
  Shirt,
  Receipt,
  CreditCard,
  CalendarClock,
  Settings,
  User,
  LogOut,
  X,
} from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { logoutAction } from "@/features/auth/actions";

/**
 * « Planning des livraisons » pointait vers `/planning`, une route qui n'existe
 * pas : le menu renvoyait sur un 404. La liste des commandes filtrée sur les
 * livraisons proches rend le même service et existe vraiment.
 */
const MORE_ITEMS = [
  { href: "/demandes", label: "Demandes en ligne", icon: Inbox },
  { href: "/modeles", label: "Modèles & catalogue", icon: Shirt },
  { href: "/factures", label: "Factures", icon: Receipt },
  { href: "/paiements", label: "Paiements & acomptes", icon: CreditCard },
  { href: "/commandes?status=due_soon", label: "Livraisons à venir", icon: CalendarClock },
  { href: "/parametres", label: "Paramètres de l'atelier", icon: Settings },
  { href: "/profil", label: "Mon profil", icon: User },
] as const;

export interface MoreMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Demandes en ligne restant à traiter, affichées en pastille. */
  pendingRequestCount?: number;
}

/** Menu mobile "Plus" — accès aux sections secondaires, messages et profil avec croix de fermeture */
export function MoreMenuSheet({
  open,
  onOpenChange,
  pendingRequestCount = 0,
}: MoreMenuSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent size="auto" className="p-4 sm:p-6">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
          <DrawerTitle className="text-base font-bold text-primary-950">
            Menu de l&apos;atelier
          </DrawerTitle>
          <DrawerClose className="rounded-full p-1.5 text-text-muted hover:bg-surface-muted hover:text-text cursor-pointer transition-colors">
            <X className="size-5" />
            <span className="sr-only">Fermer</span>
          </DrawerClose>
        </div>

        <ul className="flex flex-col gap-1">
          {MORE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-text transition-colors hover:bg-surface-muted active:bg-primary-50"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary-900">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </div>
                  <span>{item.label}</span>
                  {item.href === "/demandes" && pendingRequestCount > 0 ? (
                    <span className="ml-auto rounded-full bg-accent-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      {pendingRequestCount} à traiter
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}

          <li className="pt-2 border-t border-border mt-2">
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                void logoutAction();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-danger hover:bg-danger-bg active:bg-danger-bg transition-colors cursor-pointer"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-danger-bg text-danger">
                <LogOut className="size-4.5" aria-hidden="true" />
              </div>
              <span>Se déconnecter de l&apos;atelier</span>
            </button>
          </li>
        </ul>
      </DrawerContent>
    </Drawer>
  );
}
