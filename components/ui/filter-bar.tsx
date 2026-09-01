"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface FilterChip {
  key: string;
  label: string;
  active: boolean;
  /**
   * Destination de la puce. Quand elle est fournie, la puce est un vrai lien :
   * elle fonctionne avant l'hydratation React. Sur un Android d'entrée de gamme
   * avec une connexion faible, une puce en `onClick` avalait la première tape
   * sans rien faire — l'utilisateur croyait le filtre cassé.
   */
  href?: string;
}

export interface FilterBarProps {
  filters: FilterChip[];
  onToggle: (key: string) => void;
  onReset?: () => void;
  resetHref?: string;
  className?: string;
}

/** Cible tactile de 44 px minimum (PROJECT_RULES.md §3) — la puce se vise au pouce. */
const CHIP_BASE =
  "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function chipClasses(active: boolean): string {
  return cn(
    CHIP_BASE,
    active
      ? "border-primary-800 bg-primary-900 text-white"
      : "border-border-strong bg-surface text-text-muted hover:bg-surface-muted"
  );
}

/** Rangée de filtres rapides (chips) au-dessus d'une liste — défilement horizontal sur mobile. */
export function FilterBar({ filters, onToggle, onReset, resetHref, className }: FilterBarProps) {
  const hasActiveFilters = filters.some((filter) => filter.active);

  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto pb-1", className)}>
      <div className="flex shrink-0 items-center gap-2">
        {filters.map((filter) =>
          filter.href ? (
            <Link
              key={filter.key}
              href={filter.href}
              scroll={false}
              replace
              // Pas de `role="button"` : la puce EST un lien, et forcer ce rôle
              // empêchait Next d'intercepter le clic — la navigation ne partait
              // plus du tout. `aria-current` est aussi l'attribut juste pour
              // dire « c'est le filtre en cours » sur un lien.
              aria-current={filter.active ? "page" : undefined}
              className={chipClasses(filter.active)}
            >
              {filter.label}
            </Link>
          ) : (
            <button
              key={filter.key}
              type="button"
              onClick={() => onToggle(filter.key)}
              aria-pressed={filter.active}
              className={chipClasses(filter.active)}
            >
              {filter.label}
            </button>
          )
        )}
      </div>

      {hasActiveFilters && (resetHref || onReset) ? (
        resetHref ? (
          <Link
            href={resetHref}
            scroll={false}
            replace
            className="ml-1 flex min-h-11 shrink-0 items-center gap-1 px-2 text-sm font-medium text-text-muted hover:text-text"
          >
            <X className="size-3.5" aria-hidden="true" />
            Réinitialiser
          </Link>
        ) : (
          <button
            type="button"
            onClick={onReset}
            className="ml-1 flex min-h-11 shrink-0 items-center gap-1 px-2 text-sm font-medium text-text-muted hover:text-text"
          >
            <X className="size-3.5" aria-hidden="true" />
            Réinitialiser
          </button>
        )
      ) : null}
    </div>
  );
}
