import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ErrorStateProps {
  title?: string;
  /** Cause compréhensible, sans jargon technique (jamais "Erreur 500"). */
  description?: string;
  /** Action de réessai (ex. <Button onClick={refetch}>Réessayer</Button>). */
  action?: ReactNode;
  className?: string;
}

/**
 * État "erreur" obligatoire (PROJECT_RULES.md §3) : cause compréhensible +
 * action de réessai. Reste un Server Component — l'action interactive est
 * composée par l'appelant (Client Component) et passée en `action`.
 */
export function ErrorState({
  title = "Une erreur est survenue",
  description = "Vérifiez votre connexion puis réessayez.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-danger-bg/40 px-6 py-12 text-center",
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-danger-bg text-danger">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-text">{title}</p>
        {description ? <p className="text-sm text-text-muted">{description}</p> : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
