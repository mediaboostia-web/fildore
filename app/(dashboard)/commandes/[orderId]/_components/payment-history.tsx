"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ban, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { RoleGate } from "@/components/shared/role-gate";
import { cancelPaymentAction } from "@/features/payments/actions";
import { PAYMENT_METHOD_LABELS, type Payment } from "@/features/payments/types";
import { formatAmount } from "@/lib/money/format";
import { formatDateFr } from "@/lib/utils/dates";
import type { Role } from "@/features/auth/types";

export interface PaymentHistoryProps {
  payments: Payment[];
  currentUserRole: Role | null | undefined;
}

export function PaymentHistory({ payments, currentUserRole }: PaymentHistoryProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [target, setTarget] = useState<Payment | null>(null);
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const confirmedCount = payments.filter((p) => p.status === "confirme").length;

  function closeDialog() {
    setTarget(null);
    setReason("");
    setErrorMsg("");
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    setErrorMsg("");

    startTransition(async () => {
      const res = await cancelPaymentAction({ paymentId: target.id, reason });

      if (res.success) {
        toast.success("Paiement annulé — le solde a été recalculé");
        closeDialog();
        router.refresh();
        return;
      }

      setErrorMsg(
        res.error ??
          res.fieldErrors?.reason?.[0] ??
          "Le paiement n'a pas pu être annulé. Réessayez."
      );
    });
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Règlements reçus ({confirmedCount})
        </span>
        <Receipt className="size-4 text-text-subtle" aria-hidden="true" />
      </div>

      {payments.length === 0 ? (
        <p className="text-xs italic text-text-muted">Aucun paiement encaissé pour l&apos;instant.</p>
      ) : (
        <div className="space-y-2">
          {payments.map((payment) => {
            const isCancelled = payment.status !== "confirme";
            return (
              <div
                key={payment.id}
                className="rounded border border-border bg-canvas/50 p-2.5 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span
                      className={
                        isCancelled
                          ? "font-semibold text-text-subtle line-through"
                          : "font-semibold text-text"
                      }
                    >
                      {formatAmount(payment.amount)}
                    </span>
                    <p className="text-text-muted">
                      {PAYMENT_METHOD_LABELS[payment.method]} · {formatDateFr(payment.createdAt)}
                    </p>
                  </div>
                  <Badge tone={isCancelled ? "danger" : "success"} className="shrink-0 text-xs">
                    {isCancelled ? "Annulé" : payment.receiptNumber}
                  </Badge>
                </div>

                {/*
                  Un paiement annulé reste visible avec son motif : il ne compte
                  plus dans le solde mais l'atelier garde la trace de ce qui s'est
                  passé (PROJECT_RULES.md §6).
                */}
                {isCancelled && payment.cancellationReason ? (
                  <p className="mt-1.5 border-t border-border pt-1.5 text-text-muted">
                    Motif : {payment.cancellationReason}
                  </p>
                ) : null}

                {!isCancelled ? (
                  <RoleGate require="paiement:annuler" role={currentUserRole}>
                    <button
                      type="button"
                      onClick={() => setTarget(payment)}
                      className="mt-1.5 inline-flex cursor-pointer items-center gap-1 font-medium text-danger hover:underline"
                    >
                      <Ban className="size-3" aria-hidden="true" />
                      Annuler ce paiement
                    </button>
                  </RoleGate>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={target !== null} onOpenChange={(open) => (open ? null : closeDialog())}>
        <DialogContent>
          <form onSubmit={handleCancel} className="space-y-4" noValidate>
            <DialogHeader>
              <DialogTitle>Annuler ce paiement</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-1">
              <p className="text-sm text-text-muted">
                Le paiement de{" "}
                <strong className="text-text">{target ? formatAmount(target.amount) : ""}</strong>{" "}
                sera retiré du solde de la commande. Il restera visible dans l&apos;historique avec
                son motif.
              </p>

              {errorMsg && (
                <div className="rounded bg-danger-bg p-3 text-sm text-danger" role="alert">
                  {errorMsg}
                </div>
              )}

              <Textarea
                label="Motif de l'annulation"
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex. Montant saisi en double, chèque sans provision…"
              />
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <Button type="button" variant="tertiary" onClick={closeDialog}>
                Revenir
              </Button>
              <Button
                type="submit"
                variant="danger"
                isLoading={isPending}
                icon={<Ban className="size-4" />}
              >
                Confirmer l&apos;annulation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
