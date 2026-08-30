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
  // Le solde restant est la valeur attendue dans la quasi-totalité des cas ;
  // à zéro on laisse le champ vide plutôt que de suggérer un montant arbitraire.
  const [amount, setAmount] = useState<number>(balance > 0 ? balance : 0);
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [amountError, setAmountError] = useState<string | undefined>(undefined);

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
    setErrorMsg("");
    setAmountError(undefined);

    if (amount <= 0) {
      setAmountError("Indiquez le montant encaissé.");
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
        return;
      }

      // Le serveur recalcule le solde : c'est lui qui refuse un encaissement
      // supérieur au reste dû, et son message se rattache au champ Montant.
      setAmountError(res.fieldErrors?.amount?.[0]);
      if (!res.fieldErrors?.amount) {
        setErrorMsg(res.error || "Le paiement n'a pas pu être enregistré. Réessayez.");
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

          <CurrencyInput
            label="Montant encaissé"
            required
            value={amount}
            onChange={(val) => {
              setAmount(val);
              setErrorMsg("");
              setAmountError(undefined);
            }}
            error={amountError}
          />

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
