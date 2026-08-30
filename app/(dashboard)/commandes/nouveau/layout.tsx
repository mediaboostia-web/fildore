"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { Stepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useOrderWizardStore } from "@/features/orders/store";

const STEPS = [
  { key: "client", label: "Client" },
  { key: "details", label: "Détails" },
  { key: "mesures", label: "Mesures" },
  { key: "prix", label: "Prix" },
  { key: "verification", label: "Vérification" },
];

export default function OrderWizardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const resetStore = useOrderWizardStore((state) => state.reset);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const getCurrentStepIndex = () => {
    if (pathname.includes("/client")) return 0;
    if (pathname.includes("/details")) return 1;
    if (pathname.includes("/mesures")) return 2;
    if (pathname.includes("/prix")) return 3;
    if (pathname.includes("/verification")) return 4;
    return 0;
  };

  // `window.confirm` bloquait la page avec une boîte du navigateur, dans sa
  // propre langue et son propre style. On garde la confirmation, pas l'alerte.
  const handleCancel = () => {
    resetStore();
    router.push("/commandes");
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Boutons de navigation et d'annulation pleins et bien visibles */}
      <div className="flex items-center justify-between gap-3">
        <LinkButton
          href="/commandes"
          variant="secondary"
          size="sm"
          icon={<ArrowLeft className="size-4" />}
          className="border border-border font-bold bg-surface shadow-xs hover:bg-surface-muted active:scale-98"
        >
          Retour aux commandes
        </LinkButton>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsCancelOpen(true)}
          icon={<X className="size-4" />}
        >
          Annuler
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs md:p-6">
        <Stepper steps={STEPS} currentStep={currentStep} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs md:p-6">
        {children}
      </div>

      <ConfirmDialog
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        tone="danger"
        title="Abandonner cette commande ?"
        description="Le brouillon sera effacé : le client choisi, les mesures et le prix saisis seront perdus."
        confirmLabel="Abandonner"
        cancelLabel="Continuer la commande"
        onConfirm={handleCancel}
      />
    </div>
  );
}
