import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * Configuration de colonne partagée entre `Table` (desktop) et
 * `MobileCardList` (mobile) — une seule source de vérité, jamais deux
 * mappings dupliqués. Les pages choisissent laquelle afficher via
 * `hidden md:block` / `md:hidden`, sans JS de détection de viewport.
 */
export interface DataTableColumn<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  /** Classe appliquée à la cellule desktop (ex. alignement, largeur). */
  className?: string;
  /** Colonne mise en avant comme titre de carte sur `MobileCardList`. */
  emphasis?: boolean;
  /** Masque la colonne dans `MobileCardList` (ex. colonne déjà résumée par `emphasis`). */
  hideOnCard?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  /** Rend chaque ligne cliquable via un lien (navigation, pas d'onClick JS). */
  getRowHref?: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}

/** Tableau desktop. Alternative mobile : `MobileCardList` avec les mêmes colonnes. */
export function Table<T>({
  columns,
  data,
  getRowKey,
  getRowHref,
  emptyMessage = "Aucune donnée à afficher.",
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <p className="px-1 py-6 text-sm text-text-muted">{emptyMessage}</p>;
  }

  return (
    <div className={cn("overflow-x-auto rounded-[var(--radius-lg)] border border-border", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-muted">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn("px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-text-subtle", column.className)}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const href = getRowHref?.(row);
            return (
              <tr key={getRowKey(row)} className="border-b border-border bg-surface last:border-b-0 hover:bg-surface-muted">
                {columns.map((column, index) => (
                  <td key={column.key} className={cn("px-4 py-3 align-middle text-text", column.className)}>
                    {href && index === 0 ? (
                      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 rounded-[var(--radius-sm)]">
                        {column.render(row)}
                      </Link>
                    ) : (
                      column.render(row)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
