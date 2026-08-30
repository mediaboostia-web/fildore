import { notFound } from "next/navigation";
import { Scissors } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { getClientById } from "@/lib/mock-data/clients";
import { getProfileById } from "@/lib/mock-data/measurement-profiles";
import { clientDisplayName } from "@/features/clients/types";
import { GARMENT_TYPE_LABELS } from "@/features/measurements/constants";
import { formatDateFr } from "@/lib/utils/dates";
import { getCurrentUser } from "@/lib/auth/session";
import { DuplicateProfileDialog } from "./_components/duplicate-profile-dialog";
import { MeasurementsCard } from "./_components/measurements-card";

export default async function ProfilMesuresPage({
  params,
}: {
  params: Promise<{ clientId: string; profileId: string }>;
}) {
  const { clientId, profileId } = await params;
  const [client, profile, currentUser] = await Promise.all([
    getClientById(clientId),
    getProfileById(profileId),
    getCurrentUser(),
  ]);

  // Un profil qui n'appartient pas à ce client ne doit jamais s'afficher ici,
  // même en devinant un ID valide (PROJECT_RULES.md §7 — isolation des données).
  if (!client || !profile || profile.clientId !== clientId) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Clients", href: "/clients" },
          { label: clientDisplayName(client), href: `/clients/${clientId}` },
          { label: profile.label },
        ]}
        className="mb-3"
      />
      <PageHeader
        title={profile.label}
        description={`${GARMENT_TYPE_LABELS[profile.garmentType]} · ${clientDisplayName(client)}`}
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <DuplicateProfileDialog
              profileId={profileId}
              clientId={clientId}
              currentLabel={profile.label}
            />
            {/* Le couturier vient de vérifier les mesures : la commande part
                d'ici avec le client ET le profil déjà choisis. */}
            <LinkButton
              href={`/commandes/nouveau/client?client=${clientId}&profil=${profileId}`}
              size="sm"
              fullWidth="mobile"
              icon={<Scissors className="size-4" aria-hidden="true" />}
            >
              Commander avec ces mesures
            </LinkButton>
          </div>
        }
      />

      <div className="flex flex-col gap-4">
        {profile.isPrimary ? (
          <div>
            <Badge tone="primary">Profil principal</Badge>
          </div>
        ) : null}

        <MeasurementsCard profile={profile} currentUserRole={currentUser?.role} />

        {profile.observations ? (
          <Card>
            <p className="mb-2 text-sm font-medium text-text">Observations</p>
            <p className="text-sm text-text-muted">{profile.observations}</p>
          </Card>
        ) : null}

        <Card>
          <p className="mb-2 text-sm font-medium text-text">Historique</p>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-text-subtle">Date de prise</dt>
              <dd className="text-text">{formatDateFr(profile.takenAt)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-text-subtle">Dernière modification</dt>
              <dd className="text-text">{formatDateFr(profile.updatedAt)}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}
