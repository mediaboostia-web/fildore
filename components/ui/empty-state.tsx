import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  /** Action principale pour commencer (ex. <Button>Nouvelle commande</Button>). */
  action?: ReactNode;
  className?: string;
}

/**
 * État "vide" obligatoire sur tout écran alimenté par des données
 * (PROJECT_RULES.md §3 "États UX obligatoires") : explication simple +
 * action principale pour commencer.
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface px-6 py-12 text-center",
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-text-subtle">
        {icon ?? <Inbox className="size-6" aria-hidden="true" />}
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-text">{title}</p>
        {description ? <p className="text-sm text-text-muted">{description}</p> : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
