"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface FilterChip {
  key: string;
  label: string;
  active: boolean;
  /**
   * Destination de la puce. Quand elle est fournie, la puce est un vrai lien :
   * elle fonctionne avant l'hydratation React et se partage telle quelle. Sur un
   * Android d'entrée de gamme avec une connexion faible, une puce en `onClick`
   * avalait la première tape sans rien faire.
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
  "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function chipClasses(active: boolean): string {
  return cn(
    CHIP_BASE,
    active
      ? "border-primary-800 bg-primary-900 text-white"
      : "border-border-strong bg-surface text-text-muted hover:bg-surface-muted"
  );
}

/**
 * Rangée de filtres rapides au-dessus d'une liste — défilement horizontal sur mobile.
 *
 * Les puces sont des `<a>` natifs, volontairement PAS des `next/link` : avec
 * `Link`, le clic était intercepté puis la navigation n'aboutissait jamais
 * (même chemin, seuls les paramètres changent), et le filtre semblait mort.
 * Une ancre simple recharge la liste côté serveur en ~0,4 s, marche sans
 * JavaScript, et ne dépend d'aucun état client.
 */
export function FilterBar({ filters, onToggle, onReset, resetHref, className }: FilterBarProps) {
  const hasActiveFilters = filters.some((filter) => filter.active);

  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto pb-1", className)}>
      <div className="flex shrink-0 items-center gap-2">
        {filters.map((filter) =>
          filter.href ? (
            <a
              key={filter.key}
              href={filter.href}
              aria-current={filter.active ? "page" : undefined}
              className={chipClasses(filter.active)}
            >
              {filter.label}
            </a>
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
          <a
            href={resetHref}
            className="ml-1 flex min-h-11 shrink-0 items-center gap-1 px-2 text-sm font-medium text-text-muted no-underline hover:text-text"
          >
            <X className="size-3.5" aria-hidden="true" />
            Réinitialiser
          </a>
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
