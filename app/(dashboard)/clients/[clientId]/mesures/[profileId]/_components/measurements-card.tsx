"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { RoleGate } from "@/components/shared/role-gate";
import { updateMeasurementProfileAction } from "@/features/measurements/actions";
import { MEASUREMENT_FIELDS_BY_GARMENT_TYPE } from "@/features/measurements/constants";
import type { MeasurementProfile } from "@/features/measurements/types";
import type { Role } from "@/features/auth/types";

export interface MeasurementsCardProps {
  profile: MeasurementProfile;
  currentUserRole: Role | null | undefined;
}

/**
 * Mesures d'un profil : lecture par défaut, correction sur place.
 *
 * Corriger une mesure sert aux prochaines commandes. Les commandes déjà passées
 * gardent les leurs : elles portent une copie figée, jamais une lecture en
 * direct de ce profil.
 */
export function MeasurementsCard({ profile, currentUserRole }: MeasurementsCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  // Champs affichés : ceux déjà saisis, plus ceux attendus pour ce type de
  // vêtement mais encore vides — pour pouvoir compléter un profil incomplet.
  const expectedFields = MEASUREMENT_FIELDS_BY_GARMENT_TYPE[profile.garmentType] ?? [];
  const allFields = Array.from(
    new Set([...Object.keys(profile.standardMeasurements), ...expectedFields])
  );

  const [label, setLabel] = useState(profile.label);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      allFields.map((field) => [field, String(profile.standardMeasurements[field] ?? "")])
    )
  );
  const [observations, setObservations] = useState(profile.observations ?? "");
  const [errorMsg, setErrorMsg] = useState("");

  function cancelEditing() {
    setLabel(profile.label);
    setValues(
      Object.fromEntries(
        allFields.map((field) => [field, String(profile.standardMeasurements[field] ?? "")])
      )
    );
    setObservations(profile.observations ?? "");
    setErrorMsg("");
    setIsEditing(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Un champ laissé vide n'est pas une mesure à zéro : on ne l'enregistre pas.
    const standardMeasurements: Record<string, number> = {};
    for (const [field, raw] of Object.entries(values)) {
      if (raw.trim() === "") continue;
      const value = Number(raw);
      if (!Number.isInteger(value) || value < 0) {
        setErrorMsg(`« ${field} » doit être un nombre entier de centimètres.`);
        return;
      }
      standardMeasurements[field] = value;
    }

    if (Object.keys(standardMeasurements).length === 0) {
      setErrorMsg("Renseignez au moins une mesure.");
      return;
    }

    startTransition(async () => {
      const res = await updateMeasurementProfileAction({
        profileId: profile.id,
        label: label.trim(),
        standardMeasurements,
        customMeasurements: profile.customMeasurements,
        observations: observations.trim() || undefined,
      });

      if (res.success) {
        toast.success("Mesures corrigées");
        setIsEditing(false);
        router.refresh();
        return;
      }

      setErrorMsg(
        res.error ??
          res.fieldErrors?.label?.[0] ??
          "Les mesures n'ont pas pu être enregistrées. Réessayez."
      );
    });
  };

  if (!isEditing) {
    return (
      <Card>
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-text">Mesures (cm)</p>
          <RoleGate require="mesures:corriger" role={currentUserRole}>
            <Button
              variant="secondary"
              size="sm"
              icon={<Pencil className="size-4" aria-hidden="true" />}
              onClick={() => setIsEditing(true)}
            >
              Corriger
            </Button>
          </RoleGate>
        </div>

        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {Object.entries(profile.standardMeasurements).map(([field, value]) => (
            <div
              key={field}
              className="flex items-center justify-between border-b border-border py-1.5 text-sm"
            >
              <dt className="text-text-muted">{field}</dt>
              <dd className="font-medium text-text tabular-nums">{value} cm</dd>
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
                  <dd className="font-medium text-text tabular-nums">{measurement.valueCm} cm</dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <p className="text-sm font-medium text-text">Corriger les mesures</p>

        <p className="rounded-[var(--radius-md)] bg-info-bg p-3 text-xs text-info">
          Les commandes déjà enregistrées gardent les mesures prises à l&apos;époque. Cette
          correction s&apos;appliquera aux prochaines commandes de ce client.
        </p>

        {errorMsg && (
          <div className="rounded bg-danger-bg p-3 text-sm text-danger" role="alert">
            {errorMsg}
          </div>
        )}

        <Input
          label="Nom du profil"
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {allFields.map((field) => (
            <Input
              key={field}
              label={field}
              type="number"
              min={0}
              inputMode="numeric"
              hint="en cm"
              value={values[field] ?? ""}
              onChange={(e) => setValues({ ...values, [field]: e.target.value })}
            />
          ))}
        </div>

        <Textarea
          label="Observations"
          rows={3}
          placeholder="Ex. Préfère une coupe ample aux épaules."
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="tertiary" onClick={cancelEditing} disabled={isPending}>
            Annuler
          </Button>
          <Button type="submit" isLoading={isPending} icon={<Check className="size-4" />}>
            Enregistrer les mesures
          </Button>
        </div>
      </form>
    </Card>
  );
}
