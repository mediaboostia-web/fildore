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
      <Search className="pointer-events-none absolute left-3 size-4 text-text-subtle" aria-hidden="true" />
      <input
        type="search"
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-11 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface pl-10 pr-9 text-sm text-text placeholder:text-text-subtle",
          "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle"
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Effacer la recherche"
          className="absolute right-2.5 rounded-full p-1 text-text-subtle hover:bg-surface-muted hover:text-text"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
