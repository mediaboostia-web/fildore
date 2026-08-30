import { formatXof } from "./currency-input";
import { cn } from "@/lib/utils/cn";
import { computeBalance } from "@/lib/money/balance";

export type FildorDocumentType = "devis" | "bon_commande" | "recu" | "facture" | "bon_livraison";

const DOCUMENT_TYPE_LABELS: Record<FildorDocumentType, string> = {
  devis: "Devis",
  bon_commande: "Bon de commande",
  recu: "Reçu",
  facture: "Facture",
  bon_livraison: "Bon de livraison",
};

export interface DocumentPreviewLine {
  id: string;
  label: string;
  quantity: number;
  unitAmount: number;
}

export interface DocumentPreviewProps {
  documentType: FildorDocumentType;
  /** Numérotation lisible et unique (PROJECT_RULES.md §6 "Documents"). */
  number: string;
  /** Date déjà formatée par l'appelant (ex. "30/08/2026"). */
  date: string;
  organizationName: string;
  clientName: string;
  clientPhone?: string;
  lines?: DocumentPreviewLine[];
  totalAmount: number;
  /** Remise appliquée à la commande — toujours prise en compte dans le solde affiché. */
  discountAmount?: number;
  paidAmount?: number;
  notes?: string;
  className?: string;
}

/**
 * Aperçu visuel plat d'un document Fildor — pensé pour rester lisible aussi
 * bien en A4 qu'en mobile (PROJECT_RULES.md §4 "Images et fichiers").
 * Composant de présentation uniquement : la génération réelle du PDF sera
 * branchée dans une passe ultérieure.
 */
export function DocumentPreview({
  documentType,
  number,
  date,
  organizationName,
  clientName,
  clientPhone,
  lines = [],
  totalAmount,
  discountAmount = 0,
  paidAmount,
  notes,
  className,
}: DocumentPreviewProps) {
  const balance =
    paidAmount !== undefined ? computeBalance(totalAmount, discountAmount, paidAmount) : undefined;

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-[var(--radius-lg)] border border-border bg-surface p-5 sm:p-8",
        className
      )}
    >
      <div className="flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base font-semibold text-text">{organizationName}</p>
          <p className="text-sm text-text-muted">Atelier de couture</p>
        </div>
        <div className="sm:text-right">
          <p className="text-lg font-semibold text-primary-900">{DOCUMENT_TYPE_LABELS[documentType]}</p>
          <p className="text-sm text-text-muted">N° {number}</p>
          <p className="text-sm text-text-muted">{date}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">Client</p>
        <p className="text-sm font-medium text-text">{clientName}</p>
        {clientPhone ? <p className="text-sm text-text-muted">{clientPhone}</p> : null}
      </div>

      {lines.length > 0 ? (
        <div className="overflow-x-auto rounded-[var(--radius-md)] border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted text-left text-xs uppercase tracking-wide text-text-subtle">
                <th className="px-3 py-2 font-medium">Article</th>
                <th className="px-3 py-2 text-right font-medium">Qté</th>
                <th className="px-3 py-2 text-right font-medium">P.U.</th>
                <th className="px-3 py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2 text-text">{line.label}</td>
                  <td className="px-3 py-2 text-right text-text">{line.quantity}</td>
                  <td className="px-3 py-2 text-right text-text tabular-nums">
                    {formatXof(line.unitAmount)}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-text tabular-nums">
                    {formatXof(line.quantity * line.unitAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="ml-auto flex w-full flex-col gap-1.5 sm:w-64">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">Montant total</span>
          <span className="font-medium tabular-nums text-text">{formatXof(totalAmount)}</span>
        </div>
        {discountAmount > 0 ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Remise</span>
            <span className="tabular-nums text-text">-{formatXof(discountAmount)}</span>
          </div>
        ) : null}
        {paidAmount !== undefined ? (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Encaissé</span>
              <span className="tabular-nums text-text">{formatXof(paidAmount)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-1.5 text-sm">
              <span className="font-medium text-text">Solde restant</span>
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  balance && balance > 0 ? "text-danger" : "text-success"
                )}
              >
                {formatXof(balance ?? 0)}
              </span>
            </div>
          </>
        ) : null}
      </div>

      {notes ? (
        <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">Notes</p>
          <p className="mt-1 text-sm text-text">{notes}</p>
        </div>
      ) : null}
    </div>
  );
}
