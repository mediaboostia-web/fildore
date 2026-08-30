import { formatXof } from "./currency-input";
import { cn } from "@/lib/utils/cn";
import { computeBalance } from "@/lib/money/balance";
import { FildorLogo } from "@/components/brand/fildor-logo";
import { CheckCircle2 } from "lucide-react";

export type FildorDocumentType = "devis" | "bon_commande" | "recu" | "facture" | "bon_livraison";

const DOCUMENT_TYPE_LABELS: Record<FildorDocumentType, string> = {
  devis: "DEVIS DE CONFECTION",
  bon_commande: "BON DE COMMANDE",
  recu: "REÇU DE PAIEMENT",
  facture: "FACTURE D'ATELIER",
  bon_livraison: "BON DE LIVRAISON",
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
  /** Date déjà formatée par l'appelant (ex. "30 août 2026"). */
  date: string;
  organizationName: string;
  organizationPhone?: string;
  organizationAddress?: string;
  clientName: string;
  clientPhone?: string;
  clientAddress?: string;
  lines?: DocumentPreviewLine[];
  totalAmount: number;
  /** Remise appliquée à la commande — toujours prise en compte dans le solde affiché. */
  discountAmount?: number;
  paidAmount?: number;
  notes?: string;
  className?: string;
}

export function DocumentPreview({
  documentType,
  number,
  date,
  organizationName,
  // Aucune valeur d'atelier inventée par défaut : ces coordonnées partent chez
  // le client. L'appelant les lit sur l'atelier réel (`getWorkshop`).
  organizationPhone,
  organizationAddress,
  clientName,
  clientPhone,
  clientAddress,
  lines = [],
  totalAmount,
  discountAmount = 0,
  paidAmount,
  notes,
  className,
}: DocumentPreviewProps) {
  const balance =
    paidAmount !== undefined ? computeBalance(totalAmount, discountAmount, paidAmount) : undefined;
  const isPaid = balance === 0;

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-border bg-surface p-6 sm:p-10 shadow-sm print:shadow-none print:border-none print:p-0 print:bg-white text-text",
        className
      )}
    >
      {/* En-tête officiel du document avec Logo et Coordonnées */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b-2 border-primary-900/20 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FildorLogo variant="lockup" height={32} />
          </div>
          <div>
            <p className="text-base font-extrabold text-primary-950">{organizationName}</p>
            <p className="text-xs text-text-muted">Maison de Couture & Confection Sur-Mesure</p>
            {organizationAddress || organizationPhone ? (
              <p className="mt-0.5 text-xs text-text-muted">
                {[organizationAddress, organizationPhone].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </div>
        </div>

        <div className="sm:text-right space-y-1">
          <span className="inline-block text-xs font-black tracking-widest uppercase text-primary-900 bg-primary-50 px-3 py-1 rounded-md border border-primary-200">
            {DOCUMENT_TYPE_LABELS[documentType]}
          </span>
          <p className="text-sm font-bold text-text mt-1">Réf : {number}</p>
          <p className="text-xs text-text-muted">Date d&apos;émission : {date}</p>
          {isPaid && paidAmount !== undefined && paidAmount > 0 && (
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success-bg px-2 py-0.5 rounded-md mt-1">
              <CheckCircle2 className="size-3.5" />
              <span>Facture Soldée</span>
            </div>
          )}
        </div>
      </div>

      {/* Cadre Destinataire / Client */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-surface-muted/60 p-4 border border-border/80 text-xs">
        <div>
          <p className="font-bold uppercase tracking-wider text-text-subtle text-[10px] mb-1">
            Facturé à
          </p>
          <p className="text-sm font-extrabold text-primary-950">{clientName}</p>
          {clientPhone && <p className="text-text-muted mt-0.5">Tél : {clientPhone}</p>}
          {clientAddress && <p className="text-text-muted">{clientAddress}</p>}
        </div>

        <div>
          <p className="font-bold uppercase tracking-wider text-text-subtle text-[10px] mb-1">
            Modalités d&apos;Atelier
          </p>
          <p className="text-text-muted">Devise : Franc CFA (FCFA)</p>
          <p className="text-text-muted">Paiement : Espèces, Mobile Money (MoMo / Celtiis / Wave)</p>
        </div>
      </div>

      {/* Tableau des articles / prestations */}
      {lines.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-primary-900/5 text-left text-xs uppercase tracking-wider text-primary-950 font-bold">
                <th className="px-4 py-3">Description de la prestation / modèle</th>
                <th className="px-4 py-3 text-right">Quantité</th>
                <th className="px-4 py-3 text-right">Prix Unitaire</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {lines.map((line) => (
                <tr key={line.id} className="hover:bg-surface-muted/30">
                  <td className="px-4 py-3.5 font-medium text-text">{line.label}</td>
                  <td className="px-4 py-3.5 text-right text-text-muted font-semibold">{line.quantity}</td>
                  <td className="px-4 py-3.5 text-right text-text tabular-nums">
                    {formatXof(line.unitAmount)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-text tabular-nums">
                    {formatXof(line.quantity * line.unitAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Synthèse Financière */}
      <div className="ml-auto flex w-full flex-col gap-2 sm:w-72 pt-2">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Sous-total</span>
          <span className="font-semibold tabular-nums text-text">{formatXof(totalAmount)}</span>
        </div>

        {discountAmount > 0 ? (
          <div className="flex items-center justify-between text-xs text-success font-medium">
            <span>Remise</span>
            <span className="tabular-nums">-{formatXof(discountAmount)}</span>
          </div>
        ) : null}

        {paidAmount !== undefined ? (
          <>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Encaissé</span>
              <span className="font-semibold tabular-nums text-text">{formatXof(paidAmount)}</span>
            </div>

            <div className="flex items-center justify-between border-t-2 border-border pt-2 text-sm">
              <span className="font-extrabold text-text">Solde restant</span>
              <span
                className={cn(
                  "font-extrabold tabular-nums text-base",
                  balance && balance > 0 ? "text-danger" : "text-success"
                )}
              >
                {formatXof(balance ?? 0)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between border-t-2 border-border pt-2 text-sm">
            <span className="font-extrabold text-text">Net à payer</span>
            <span className="font-extrabold tabular-nums text-base text-primary-900">
              {formatXof(totalAmount - discountAmount)}
            </span>
          </div>
        )}
      </div>

      {/* Notes et mentions légales de l'atelier */}
      <div className="border-t border-border/80 pt-4 space-y-2 text-xs text-text-muted">
        <p className="font-semibold text-text">Notes & Conditions d&apos;atelier :</p>
        <p className="leading-relaxed">
          {notes ||
            "Merci pour votre confiance. Les confections sur-mesure sont réalisées avec soin selon vos mensurations. Veuillez conserver ce document pour le retrait de votre commande."}
        </p>
      </div>

      {/* Signature / Tampon atelier */}
      <div className="pt-6 flex justify-between items-end border-t border-border/60 text-xs">
        <div className="text-[11px] text-text-subtle">
          <p>Généré via Fildor · Gestion d&apos;atelier de couture</p>
        </div>
        <div className="text-right space-y-10">
          <p className="font-bold text-text">Pour {organizationName}</p>
          <p className="text-[10px] text-text-subtle italic">Cachet / Signature</p>
        </div>
      </div>
    </div>
  );
}
