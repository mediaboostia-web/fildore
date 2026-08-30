import { CheckCircle2 } from "lucide-react";
import { computeBalance } from "@/lib/money/balance";
import { formatXof } from "./currency-input";
import { cn } from "@/lib/utils/cn";

export interface PaymentSummaryProps {
  totalAmount: number;
  discountAmount?: number;
  paidAmount: number;
  className?: string;
}

/**
 * Résumé financier d'une commande. Le solde est calculé via `computeBalance`
 * (`lib/money/balance.ts`) — point de calcul unique, jamais recopié
 * (PROJECT_RULES.md §6 "Paiements").
 */
export function PaymentSummary({
  totalAmount,
  discountAmount = 0,
  paidAmount,
  className,
}: PaymentSummaryProps) {
  const balance = computeBalance(totalAmount, discountAmount, paidAmount);
  const isFullyPaid = balance <= 0;

  return (
    <div className={cn("flex flex-col gap-2.5 rounded-[var(--radius-lg)] border border-border bg-surface p-4", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted">Montant total</span>
        <span className="tabular-nums font-medium text-text">{formatXof(totalAmount)}</span>
      </div>
      {discountAmount > 0 ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">Remise</span>
          <span className="tabular-nums text-text">− {formatXof(discountAmount)}</span>
        </div>
      ) : null}
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted">Encaissé</span>
        <span className="tabular-nums text-text">{formatXof(paidAmount)}</span>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-2.5">
        <span className="text-sm font-medium text-text">Solde restant</span>
        {isFullyPaid ? (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-success">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Payée en totalité
          </span>
        ) : (
          <span className="tabular-nums text-base font-semibold text-danger">{formatXof(balance)}</span>
        )}
      </div>
    </div>
  );
}
