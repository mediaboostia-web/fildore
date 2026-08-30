import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/ui/link-button";
import { getCatalogItemById } from "@/lib/mock-data/catalog";
import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/features/auth/permissions";
import { ModelForm } from "../../_components/model-form";

export default async function ModifierModelePage({
  params,
}: {
  params: Promise<{ modeleId: string }>;
}) {
  const { modeleId } = await params;
  const [item, currentUser] = await Promise.all([getCatalogItemById(modeleId), getCurrentUser()]);

  if (!item || !currentUser || item.workshopId !== currentUser.workshopId) notFound();

  // Le droit est revérifié par l'action serveur ; on évite ici d'ouvrir un
  // formulaire dont l'enregistrement serait de toute façon refusé.
  if (!can(currentUser.role, "catalogue:gerer")) {
    redirect(`/modeles/${item.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <LinkButton
          href={`/modeles/${item.id}`}
          variant="tertiary"
          size="sm"
          icon={<ArrowLeft className="size-4" />}
        >
          Retour au modèle
        </LinkButton>
      </div>

      <PageHeader
        title={`Modifier ${item.name}`}
        description="Les commandes déjà passées avec ce modèle gardent leur titre et leur prix."
      />

      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <ModelForm item={item} />
      </div>
    </div>
  );
}
