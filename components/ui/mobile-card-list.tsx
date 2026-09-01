import Link from "next/link";
import type { DataTableColumn, DataTableProps } from "./table";
import { Card } from "./card";
import { cn } from "@/lib/utils/cn";

/**
 * Alternative mobile de `Table`, alimentée par la même config `columns`
 * (PROJECT_RULES.md §4 "Cartes, tableaux et listes"). La colonne marquée
 * `emphasis` sert de titre de carte ; les autres colonnes s'affichent en
 * paires libellé / valeur, dans l'ordre fourni.
 */
export function MobileCardList<T>({
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

  const titleColumn = columns.find((column) => column.emphasis) ?? columns[0];
  const detailColumns = columns.filter(
    (column) => column.key !== titleColumn?.key && !column.hideOnCard
  );

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {data.map((row) => {
        const href = getRowHref?.(row);
        const content = (
          <Card padding="sm" elevated={Boolean(href)} className={href ? "transition-colors hover:bg-surface-muted" : undefined}>
            {titleColumn ? (
              // `render` peut renvoyer un bloc (deux lignes empilées) : un <p> ne
              // peut pas en contenir, le navigateur réécrit l'arbre et l'hydratation
              // échoue — la carte perd alors ses gestionnaires au premier rendu.
              <div className="text-sm font-semibold text-text">{titleColumn.render(row)}</div>
            ) : null}
            <dl className="mt-2 flex flex-col gap-1.5">
              {detailColumns.map((column: DataTableColumn<T>) => (
                <div key={column.key} className="flex items-center justify-between gap-3 text-sm">
                  <dt className="text-text-subtle">{column.label}</dt>
                  <dd className="text-right text-text">{column.render(row)}</dd>
                </div>
              ))}
            </dl>
          </Card>
        );

        return href ? (
          <Link
            key={getRowKey(row)}
            href={href}
            className="block rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
          >
            {content}
          </Link>
        ) : (
          <div key={getRowKey(row)}>{content}</div>
        );
      })}
    </div>
  );
}
