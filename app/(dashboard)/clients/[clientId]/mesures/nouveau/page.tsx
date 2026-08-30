import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { getClientById } from "@/lib/mock-data/clients";
import { clientDisplayName } from "@/features/clients/types";
import { MeasurementProfileForm } from "./_components/measurement-profile-form";

/**
 * Server Component : valide l'existence du client (notFound sinon) et affiche
 * son nom dans l'en-tête. Le formulaire lui-même est isolé dans un Client
 * Component pour la réactivité du changement de type de vêtement.
 */
export default async function NouveauProfilMesuresPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = await getClientById(clientId);
  if (!client) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Clients", href: "/clients" },
          { label: clientDisplayName(client), href: `/clients/${clientId}` },
          { label: "Nouveau profil de mesures" },
        ]}
        className="mb-3"
      />
      <PageHeader
        title="Nouveau profil de mesures"
        description={`Enregistrez les mesures de ${clientDisplayName(client)} pour un type de vêtement.`}
      />
      <MeasurementProfileForm clientId={clientId} />
    </>
  );
}
