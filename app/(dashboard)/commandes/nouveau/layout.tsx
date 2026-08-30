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
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LinkButton href="/commandes" variant="tertiary" size="sm" icon={<ArrowLeft className="size-4" />}>
            Commandes
          </LinkButton>
        </div>
        <Button variant="tertiary" size="sm" onClick={handleCancel} className="text-text-muted hover:text-danger">
          <X className="size-4 mr-1" />
          Annuler
        </Button>
      </div>

      <div className="mb-8 rounded-lg border border-border bg-surface p-4 shadow-sm md:p-6">
        <Stepper steps={STEPS} currentStep={currentStep} />
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 shadow-sm md:p-6">
        {children}
      </div>
    </div>
  );
}
