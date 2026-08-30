"use client";

import { useId, useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils/cn";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  containerClassName?: string;
}

/**
 * Sélecteur avec recherche (ex. choisir un client parmi une longue liste).
 * Construit sur Radix Popover — pas de dépendance supplémentaire (pas de cmdk).
 */
export function Combobox({
  options,
  value,
  onChange,
  label,
  hint,
  error,
  placeholder = "Sélectionner…",
  searchPlaceholder = "Rechercher…",
  emptyMessage = "Aucun résultat",
  required,
  disabled,
  id,
  containerClassName,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const generatedId = useId();
  const triggerId = id ?? generatedId;

  const selected = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, search]);

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label ? (
        <label htmlFor={triggerId} className="text-sm font-medium text-text">
          {label}
          {required ? <span className="text-danger"> *</span> : null}
        </label>
      ) : null}
      <Popover.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setSearch("");
        }}
      >
        <Popover.Trigger asChild>
          <button
            type="button"
            id={triggerId}
            disabled={disabled}
            className={cn(
              "flex h-11 w-full items-center justify-between gap-2 rounded-[var(--radius-md)] border bg-surface px-3 text-left text-sm",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle",
              error ? "border-danger" : "border-border-strong",
              selected ? "text-text" : "text-text-subtle"
            )}
          >
            <span className="truncate">{selected ? selected.label : placeholder}</span>
            <ChevronDown className="size-4 shrink-0 text-text-subtle" aria-hidden="true" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            className="z-50 w-[var(--radix-popover-trigger-width)] rounded-[var(--radius-md)] border border-border bg-surface shadow-md"
          >
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <Search className="size-4 shrink-0 text-text-subtle" aria-hidden="true" />
              <input
                autoFocus
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm text-text placeholder:text-text-subtle focus:outline-none"
              />
            </div>
            <ul className="max-h-64 overflow-y-auto p-1" role="listbox">
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-sm text-text-subtle">{emptyMessage}</li>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onChange(option.value);
                          setOpen(false);
                          setSearch("");
                        }}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] px-2.5 py-2 text-left text-sm hover:bg-surface-muted",
                          isSelected ? "text-primary-900 font-medium" : "text-text"
                        )}
                      >
                        <span className="flex flex-col">
                          <span>{option.label}</span>
                          {option.description ? (
                            <span className="text-xs text-text-subtle">{option.description}</span>
                          ) : null}
                        </span>
                        {isSelected ? (
                          <Check className="size-4 shrink-0 text-primary-700" aria-hidden="true" />
                        ) : null}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : hint ? (
        <p className="text-sm text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
