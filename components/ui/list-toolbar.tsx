"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { SearchInput } from "./search-input";
import { FilterBar, type FilterChip } from "./filter-bar";
import {
  useSearchParamInput,
  useSearchParamSetter,
} from "@/lib/hooks/use-search-params-state";

export interface ListToolbarFilter {
  key: string;
  label: string;
  /** Nombre d'éléments correspondant à ce filtre, affiché dans la puce. */
  count?: number;
}

export interface ListToolbarProps {
  /** Nom du paramètre d'URL de la recherche. Omettre pour une liste sans recherche. */
  searchParam?: string;
  /** Valeur venue du rendu serveur (`searchParams`), pas d'un état local. */
  searchValue?: string;
  searchPlaceholder?: string;
  searchLabel?: string;

  /** Nom du paramètre d'URL du filtre. Omettre pour une liste sans filtre. */
  filterParam?: string;
  filterValue?: string;
  filters?: ListToolbarFilter[];
  /** Clé signifiant « pas de filtre » : elle est retirée de l'URL. */
  allFilterKey?: string;

  /** Comptage affiché sous la barre : « 12 commandes sur 34 ». */
  resultCount: number;
  totalCount: number;
  /** Nom de l'objet listé, au singulier et au pluriel. */
  noun: [singular: string, plural: string];

  /** Action secondaire alignée à droite de la recherche (ex. « Nouveau client »). */
  children?: ReactNode;
  className?: string;
}

/**
 * Barre d'outils commune aux listes (commandes, clients, modèles, factures,
 * paiements) : recherche, puces de filtre et comptage de résultats, dans la
 * même disposition partout.
 *
 * Le comptage n'est pas décoratif : sans lui, un filtre qui ne renvoie rien est
 * indiscernable d'une liste vide, et l'utilisateur croit avoir perdu ses données.
 */
export function ListToolbar({
  searchParam,
  searchValue = "",
  searchPlaceholder,
  searchLabel = "Rechercher",
  filterParam,
  filterValue = "all",
  filters,
  allFilterKey = "all",
  resultCount,
  totalCount,
  noun,
  children,
  className,
}: ListToolbarProps) {
  const search = useSearchParamInput(searchParam ?? "q", searchValue);
  const { set, isPending: isFilterPending } = useSearchParamSetter();

  const hasSearch = Boolean(searchParam);
  const hasFilters = Boolean(filterParam && filters && filters.length > 0);
  const isFiltered = resultCount !== totalCount;
  const [singular, plural] = noun;

  const chips: FilterChip[] = (filters ?? []).map((filter) => ({
    key: filter.key,
    label: filter.count === undefined ? filter.label : `${filter.label} (${filter.count})`,
    active: filterValue === filter.key,
  }));

  const handleToggle = (key: string) => {
    if (!filterParam) return;
    set({ [filterParam]: key === allFilterKey ? null : key });
  };

  const handleReset = () => {
    if (!filterParam) return;
    set({ [filterParam]: null });
  };

  return (
    <div
      className={cn("mb-4 flex flex-col gap-3", className)}
      data-pending={search.isPending || isFilterPending ? "" : undefined}
    >
      {hasSearch || children ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {hasSearch ? (
            <SearchInput
              className="w-full sm:max-w-md"
              value={search.value}
              onChange={search.setValue}
              label={searchLabel}
              placeholder={searchPlaceholder}
            />
          ) : null}
          {children ? <div className="shrink-0">{children}</div> : null}
        </div>
      ) : null}

      {hasFilters ? (
        <FilterBar
          filters={chips}
          onToggle={handleToggle}
          onReset={filterValue !== allFilterKey ? handleReset : undefined}
        />
      ) : null}

      <p className="text-xs text-text-muted" aria-live="polite">
        {isFiltered
          ? `${resultCount} ${resultCount > 1 ? plural : singular} sur ${totalCount}`
          : `${totalCount} ${totalCount > 1 ? plural : singular}`}
      </p>
    </div>
  );
}
