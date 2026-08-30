"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Libellé accessible (champ visuellement sans label, ex. dans une barre de recherche). */
  label?: string;
  disabled?: boolean;
  className?: string;
}

/** Champ de recherche pour listes (commandes, clients, modèles…). */
export function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
  label = "Rechercher",
  disabled,
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Search
        className="pointer-events-none absolute left-3 size-4 text-text-subtle"
        aria-hidden="true"
      />
      <input
        type="search"
        aria-label={label}
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-11 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface pl-10 pr-12 text-sm text-text placeholder:text-text-subtle",
          "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle",
          // Chrome/Safari dessinent leur propre croix sur `type="search"`. Sans
          // cette règle, l'utilisateur voit DEUX croix côte à côte et ne sait
          // pas laquelle efface quoi.
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:hidden",
          "[&::-webkit-search-decoration]:appearance-none"
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Effacer la recherche"
          // Cible tactile de 44 px (PROJECT_RULES §3), l'icône reste petite.
          className="absolute right-0 flex size-11 items-center justify-center rounded-[var(--radius-md)] text-text-subtle transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
