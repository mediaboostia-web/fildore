"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { Stepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
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

  const getCurrentStepIndex = () => {
    if (pathname.includes("/client")) return 0;
    if (pathname.includes("/details")) return 1;
    if (pathname.includes("/mesures")) return 2;
    if (pathname.includes("/prix")) return 3;
    if (pathname.includes("/verification")) return 4;
    return 0;
  };

  const handleCancel = () => {
    if (window.confirm("Abandonner la création de commande ? Le brouillon sera effacé.")) {
      resetStore();
      router.push("/commandes");
    }
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
          onClick={handleCancel}
          className="border border-danger/30 text-danger bg-danger-bg/60 hover:bg-danger-bg font-bold shadow-xs active:scale-98"
        >
          <X className="size-4 mr-1.5" />
          Annuler
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs md:p-6">
        <Stepper steps={STEPS} currentStep={currentStep} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs md:p-6">
        {children}
      </div>
    </div>
  );
}
