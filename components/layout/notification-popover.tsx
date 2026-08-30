"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Check, Clock, AlertTriangle, MessageSquare, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function NotificationPopover({ compact = false }: { compact?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      type: "urgent",
      title: "Livraison aujourd'hui",
      desc: "Robe cérémonie — Aïcha D. (FIL-CTN-000124)",
      time: "Aujourd'hui à 16h",
      href: "/commandes",
      read: false,
    },
    {
      id: "notif-2",
      type: "warning",
      title: "Livraison imminente",
      desc: "Ensemble homme brodé — Koffi A. (FIL-CTN-000125)",
      time: "Demain",
      href: "/commandes",
      read: false,
    },
    {
      id: "notif-3",
      type: "message",
      title: "Message WhatsApp prêt",
      desc: "Invitation essayage prête pour Sandrine Codjo",
      time: "Il y a 1h",
      href: "/messages",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications (${unreadCount} non lues)`}
        className={
          compact
            ? "relative flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-text-muted hover:bg-surface-muted hover:text-text transition-colors cursor-pointer"
            : "relative flex w-full items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-sm font-medium text-text-muted hover:bg-surface-muted hover:text-text transition-colors cursor-pointer"
        }
      >
        <div className="relative">
          <Bell className="size-5 shrink-0" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex size-2.5 rounded-full bg-danger ring-2 ring-surface" />
          )}
        </div>
        {!compact && (
          <div className="flex flex-1 items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge tone="danger" className="text-[10px] px-1.5 py-0">
                {unreadCount}
              </Badge>
            )}
          </div>
        )}
      </button>

      {/* Panneau des notifications */}
      {isOpen && (
        <>
          {/* Overlay clic pour fermer */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute left-0 bottom-full mb-2 w-80 sm:w-96 rounded-xl border border-border bg-surface shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-surface-muted/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-primary-900" />
                <span className="text-sm font-bold text-text">Notifications d'atelier</span>
                {unreadCount > 0 && (
                  <Badge tone="danger" className="text-[10px]">
                    {unreadCount} nouvelles
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-primary-800 hover:underline cursor-pointer"
                  >
                    Tout lire
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded p-1 text-text-muted hover:bg-surface-muted cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Liste */}
            <div className="divide-y divide-border max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-start gap-3 p-3.5 transition-colors hover:bg-canvas ${
                    !n.read ? "bg-primary-50/30" : ""
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {n.type === "urgent" ? (
                      <div className="flex size-7 items-center justify-center rounded-lg bg-danger-bg text-danger">
                        <AlertTriangle className="size-3.5" />
                      </div>
                    ) : n.type === "warning" ? (
                      <div className="flex size-7 items-center justify-center rounded-lg bg-warning-bg text-warning">
                        <Clock className="size-3.5" />
                      </div>
                    ) : (
                      <div className="flex size-7 items-center justify-center rounded-lg bg-[#E7F7EE] text-[#128C7E]">
                        <MessageSquare className="size-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-text truncate">{n.title}</p>
                      <span className="text-[10px] text-text-subtle">{n.time}</span>
                    </div>
                    <p className="text-xs text-text-muted leading-tight line-clamp-2">{n.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
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
