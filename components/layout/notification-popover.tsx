"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, AlertTriangle, Clock, Inbox, Wallet, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { WorkshopNotification } from "@/features/dashboard/notifications";

export interface NotificationPopoverProps {
  /**
   * Alertes calculées côté serveur à partir des vraies commandes
   * (`buildWorkshopNotifications`). Ce composant n'invente aucune donnée : un
   * atelier sans échéance affiche un état vide, pas un exemple.
   */
  notifications: WorkshopNotification[];
  compact?: boolean;
}

const TONE_STYLES: Record<WorkshopNotification["tone"], string> = {
  danger: "bg-danger-bg text-danger",
  warning: "bg-warning-bg text-warning",
  info: "bg-info-bg text-info",
};

function NotificationIcon({ notification }: { notification: WorkshopNotification }) {
  const Icon =
    notification.kind === "demande"
      ? Inbox
      : notification.kind === "paiement"
        ? Wallet
        : notification.tone === "danger"
          ? AlertTriangle
          : Clock;

  return (
    <div
      className={`flex size-7 items-center justify-center rounded-lg ${TONE_STYLES[notification.tone]}`}
    >
      <Icon className="size-3.5" aria-hidden="true" />
    </div>
  );
}

export function NotificationPopover({ notifications, compact = false }: NotificationPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Une alerte reste une alerte tant que la commande n'a pas avancé : rien à
  // « marquer comme lu » ici, le compteur suit l'état réel de l'atelier.
  const count = notifications.length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={
          count > 0 ? `Notifications : ${count} à traiter` : "Notifications : rien à signaler"
        }
        aria-expanded={isOpen}
        className={
          compact
            ? "relative flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:bg-surface-muted hover:text-text"
            : "relative flex w-full cursor-pointer items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-muted hover:text-text"
        }
      >
        <div className="relative">
          <Bell className="size-5 shrink-0" aria-hidden="true" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex size-2.5 rounded-full bg-danger ring-2 ring-surface" />
          )}
        </div>
        {!compact && (
          <div className="flex flex-1 items-center justify-between">
            <span>Notifications</span>
            {count > 0 && (
              <Badge tone="danger" className="px-1.5 py-0 text-[10px]">
                {count}
              </Badge>
            )}
          </div>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden="true" />

          <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl sm:w-96">
            <div className="flex items-center justify-between border-b border-border bg-surface-muted/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-primary-900" aria-hidden="true" />
                <span className="text-sm font-bold text-text">À traiter</span>
                {count > 0 && (
                  <Badge tone="danger" className="text-[10px]">
                    {count}
                  </Badge>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer les notifications"
                className="cursor-pointer rounded p-1 text-text-muted hover:bg-surface-muted"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {count === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium text-text">Rien à signaler.</p>
                <p className="mt-1 text-xs text-text-muted">
                  Aucune livraison proche, acompte en retard ni demande en attente.
                </p>
              </div>
            ) : (
              <div className="max-h-80 divide-y divide-border overflow-y-auto">
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={notification.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 p-3.5 transition-colors hover:bg-canvas"
                  >
                    <div className="mt-0.5 shrink-0">
                      <NotificationIcon notification={notification} />
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <p className="truncate text-xs font-bold text-text">{notification.title}</p>
                        <span className="shrink-0 text-[10px] text-text-subtle">
                          {notification.timing}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-xs leading-tight text-text-muted">
                        {notification.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="border-t border-border bg-surface-muted/40 p-2.5 text-center">
              <Link
                href="/tableau-de-bord"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-primary-900 hover:underline"
              >
                Voir tout sur le tableau de bord &rarr;
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
