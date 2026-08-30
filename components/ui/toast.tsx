"use client";

import { nanoid } from "nanoid";
import { create } from "zustand";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ToastTone = "success" | "error" | "info";

interface ToastItem {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastState {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

const AUTO_DISMISS_MS = 4000;

const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (toast) => {
    const id = nanoid();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => get().dismiss(id), AUTO_DISMISS_MS);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

/**
 * API impérative pour déclencher une notification depuis n'importe quel
 * composant client — `toast.success("Acompte enregistré")`.
 */
export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: "success", title, description }),
  error: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: "error", title, description }),
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: "info", title, description }),
};

const TONE_CONFIG: Record<ToastTone, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "border-success/20 bg-success-bg text-success" },
  error: { icon: AlertCircle, className: "border-danger/20 bg-danger-bg text-danger" },
  info: { icon: Info, className: "border-info/20 bg-info-bg text-info" },
};

/**
 * Zone d'affichage des notifications — à monter une seule fois, par exemple
 * dans `AppShell`. État "succès" non intrusif (PROJECT_RULES.md §3).
 */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:w-96"
    >
      {toasts.map((item) => {
        const { icon: Icon, className } = TONE_CONFIG[item.tone];
        return (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto flex items-start gap-2 rounded-[var(--radius-md)] border bg-surface p-3 shadow-md",
              className
            )}
          >
            <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium text-text">{item.title}</p>
              {item.description ? (
                <p className="text-sm text-text-muted">{item.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Fermer la notification"
              className="shrink-0 rounded-full p-1 text-text-subtle hover:bg-surface-muted"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
