"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useOrderWizardStore } from "@/features/orders/store";
import { formatAmount } from "@/lib/money/format";

export default function OrderWizardPricingStep() {
  const router = useRouter();
  const draft = useOrderWizardStore((state) => state.draft);
  const setStepData = useOrderWizardStore((state) => state.setStepData);

  // Pas de prix par défaut inventé : le montant vient du modèle du catalogue
  // quand la commande en vient, sinon le couturier le saisit. Un tarif suggéré
  // au hasard finirait tôt ou tard facturé tel quel.
  const [totalAmount, setTotalAmount] = useState<number>(draft.totalAmount ?? 0);
  const [discountAmount, setDiscountAmount] = useState<number>(draft.discountAmount || 0);
  const [depositDueDate, setDepositDueDate] = useState<string>(draft.depositDueDate || "");
  const [errorMsg, setErrorMsg] = useState("");

  const netPayable = Math.max(0, totalAmount - discountAmount);
  // Suggestion d'acompte 50%
  const suggestedDeposit = Math.round(netPayable / 2);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalAmount <= 0) {
      setErrorMsg("Le montant total de la commande doit être supérieur à 0.");
      return;
    }
    if (discountAmount > totalAmount) {
      setErrorMsg("La remise ne peut pas être supérieure au montant total.");
      return;
    }

    setStepData({
      totalAmount,
      discountAmount,
      depositDueDate: depositDueDate || undefined,
    });

    router.push("/commandes/nouveau/verification");
  };

  return (
    /* `noValidate` : sans lui, le navigateur bloque avec sa propre bulle (dans sa
       langue, hors de notre design) et notre message français ne s'affiche jamais.
       La validation reste faite ici, puis revérifiée côté serveur. */
    <form onSubmit={handleNext} className="space-y-6" noValidate>
      <div>
        <h2 className="text-lg font-bold text-text">Étape 4 : Prix et acompte</h2>
        <p className="text-sm text-text-muted">
          Définissez le montant total convenu avec le client et l&apos;échéance de l&apos;acompte.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-danger-bg p-3 text-sm text-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {/* Label rattaché au champ (prop `label`) plutôt qu'un <label> détaché :
          le lecteur d'écran l'annonce, et le champ devient adressable par son nom. */}
      <div className="space-y-4">
        <CurrencyInput
          label="Montant total"
          required
          value={totalAmount}
          onChange={(val) => {
            setTotalAmount(val);
            setErrorMsg("");
          }}
          placeholder="0"
          hint="Le prix convenu avec le client pour cette tenue."
        />

        <CurrencyInput
          label="Remise accordée"
          value={discountAmount}
          onChange={(val) => {
            setDiscountAmount(val);
            setErrorMsg("");
          }}
          placeholder="0"
          hint="Facultatif."
        />

        <Input
          label="Date limite de l'acompte"
          type="date"
          value={depositDueDate}
          onChange={(e) => setDepositDueDate(e.target.value)}
          hint="Facultatif. Sert à vous alerter si l'acompte tarde."
        />
      </div>

      {/* Récapitulatif financier interactif */}
      <div className="rounded-lg border border-border bg-canvas p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Sous-total :</span>
          <span className="font-medium text-text">{formatAmount(totalAmount)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Remise :</span>
            <span className="font-medium text-danger">- {formatAmount(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
          <span className="text-text">Total net à payer :</span>
          <span className="text-primary-900">{formatAmount(netPayable)}</span>
        </div>
        <p className="text-xs text-text-muted pt-1">
          Acompte standard recommandé (50%) : <strong>{formatAmount(suggestedDeposit)}</strong>. Vous
          pourrez encaisser le premier versement dès la confirmation de la commande.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <LinkButton
          href="/commandes/nouveau/mesures"
          variant="secondary"
          fullWidth="mobile"
          icon={<ArrowLeft className="size-4" />}
        >
          Retour aux mesures
        </LinkButton>
        <Button type="submit" fullWidth="mobile" icon={<ArrowRight className="size-4" />}>
          Continuer vers Vérification
        </Button>
      </div>
    </form>
  );
}
