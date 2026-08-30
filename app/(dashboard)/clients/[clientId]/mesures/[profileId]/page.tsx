import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getClientById } from "@/lib/mock-data/clients";
import { getProfileById } from "@/lib/mock-data/measurement-profiles";
import { clientDisplayName } from "@/features/clients/types";
import { GARMENT_TYPE_LABELS } from "@/features/measurements/constants";
import { formatDateFr } from "@/lib/utils/dates";
import { DuplicateProfileDialog } from "./_components/duplicate-profile-dialog";

export default async function ProfilMesuresPage({
  params,
}: {
  params: Promise<{ clientId: string; profileId: string }>;
}) {
  const { clientId, profileId } = await params;
  const [client, profile] = await Promise.all([getClientById(clientId), getProfileById(profileId)]);

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
          <DuplicateProfileDialog profileId={profileId} clientId={clientId} currentLabel={profile.label} />
        }
      />

      <div className="flex flex-col gap-4">
        {profile.isPrimary ? (
          <div>
            <Badge tone="primary">Profil principal</Badge>
          </div>
        ) : null}

        <Card>
          <p className="mb-3 text-sm font-medium text-text">Mesures (cm)</p>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {Object.entries(profile.standardMeasurements).map(([field, value]) => (
              <div key={field} className="flex items-center justify-between border-b border-border py-1.5 text-sm">
                <dt className="text-text-muted">{field}</dt>
                <dd className="font-medium text-text">{value} cm</dd>
              </div>
            ))}
          </dl>

          {profile.customMeasurements.length > 0 ? (
            <>
              <p className="mb-3 mt-5 text-sm font-medium text-text">Mesures personnalisées</p>
              <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {profile.customMeasurements.map((measurement) => (
                  <div
                    key={measurement.label}
                    className="flex items-center justify-between border-b border-border py-1.5 text-sm"
                  >
                    <dt className="text-text-muted">{measurement.label}</dt>
                    <dd className="font-medium text-text">{measurement.valueCm} cm</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : null}
        </Card>

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
