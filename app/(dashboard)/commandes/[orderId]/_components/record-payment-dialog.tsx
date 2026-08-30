"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { recordPaymentAction } from "@/features/payments/actions";
import { PAYMENT_METHOD_LABELS, type PaymentMethod, type PaymentType } from "@/features/payments/types";
import { formatAmount } from "@/lib/money/format";

interface RecordPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  clientId: string;
  balance: number;
}

export function RecordPaymentDialog({
  isOpen,
  onClose,
  orderId,
  clientId,
  balance,
}: RecordPaymentDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [type, setType] = useState<PaymentType>("acompte");
  const [method, setMethod] = useState<PaymentMethod>("especes");
  const [amount, setAmount] = useState<number>(balance > 0 ? balance : 10000);
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const typeOptions = [
    { value: "acompte", label: "Acompte initial" },
    { value: "partiel", label: "Paiement partiel" },
    { value: "final", label: "Règlement du solde (final)" },
  ];

  const methodOptions = Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => ({
    value: key,
    label,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setErrorMsg("Le montant du paiement doit être supérieur à 0.");
      return;
    }

    startTransition(async () => {
      const res = await recordPaymentAction({
        orderId,
        clientId,
        type,
        method,
        amount,
        reference: reference.trim() || undefined,
        note: note.trim() || undefined,
      });

      if (res.success) {
        onClose();
        router.refresh();
      } else {
        setErrorMsg(res.error || "Erreur lors de l'enregistrement du paiement.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement</DialogTitle>
            <DialogDescription>
              Solde restant sur cette commande : <strong>{formatAmount(balance)}</strong>
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="rounded bg-danger-bg p-2.5 text-xs text-danger" role="alert">
              {errorMsg}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Select
              label="Type de versement"
              value={type}
              onChange={(e) => setType(e.target.value as PaymentType)}
              options={typeOptions}
            />

            <Select
              label="Moyen de paiement"
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              options={methodOptions}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text">Montant encaissé *</label>
            <CurrencyInput
              value={amount}
              onChange={(val) => {
                setAmount(val);
                setErrorMsg("");
              }}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text">
              Référence transaction Mobile Money (facultatif)
            </label>
            <Input
              placeholder="Ex. TXN-98472918"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text">Note interne (facultatif)</label>
            <Input
              placeholder="Ex. Encaissé par Amina"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
              Annuler
            </Button>
            <Button type="submit" isLoading={isPending} icon={<Check className="size-4" />}>
              Valider le paiement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
