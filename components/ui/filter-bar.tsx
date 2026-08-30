"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface FilterChip {
  key: string;
  label: string;
  active: boolean;
}

export interface FilterBarProps {
  filters: FilterChip[];
  onToggle: (key: string) => void;
  onReset?: () => void;
  className?: string;
}

/** Rangée de filtres rapides (chips) au-dessus d'une liste — défilement horizontal sur mobile. */
export function FilterBar({ filters, onToggle, onReset, className }: FilterBarProps) {
  const hasActiveFilters = filters.some((filter) => filter.active);

  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto pb-1", className)}>
      <div className="flex shrink-0 items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => onToggle(filter.key)}
            aria-pressed={filter.active}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              filter.active
                ? "border-primary-800 bg-primary-900 text-white"
                : "border-border-strong bg-surface text-text-muted hover:bg-surface-muted"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
      {hasActiveFilters && onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="ml-1 flex shrink-0 items-center gap-1 text-sm font-medium text-text-muted hover:text-text"
        >
          <X className="size-3.5" aria-hidden="true" />
          Réinitialiser
        </button>
      ) : null}
    </div>
  );
}
