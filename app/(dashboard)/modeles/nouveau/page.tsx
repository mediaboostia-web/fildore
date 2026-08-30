import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/ui/link-button";
import { ModelForm } from "../_components/model-form";

export default function NouveauModelePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <LinkButton href="/modeles" variant="tertiary" size="sm" icon={<ArrowLeft className="size-4" />}>
          Tous les modèles
        </LinkButton>
      </div>

      <PageHeader
        title="Nouveau modèle au catalogue"
        description="Ajoutez une création à votre catalogue pour la présenter aux clients et créer rapidement des commandes."
      />

      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <ModelForm />
      </div>
    </div>
  );
}
