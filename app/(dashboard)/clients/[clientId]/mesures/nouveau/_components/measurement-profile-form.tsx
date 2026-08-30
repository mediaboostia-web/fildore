"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CancelFormButton } from "@/components/shared/cancel-form-button";
import { toast } from "@/components/ui/toast";
import { createMeasurementProfileAction } from "@/features/measurements/actions";
import { GARMENT_TYPE_LABELS, MEASUREMENT_FIELDS_BY_GARMENT_TYPE } from "@/features/measurements/constants";
import type { GarmentType } from "@/features/measurements/types";

const GARMENT_TYPE_OPTIONS = (Object.keys(GARMENT_TYPE_LABELS) as GarmentType[]).map((value) => ({
  value,
  label: GARMENT_TYPE_LABELS[value],
}));

export interface MeasurementProfileFormProps {
  clientId: string;
}

/**
 * Les champs de mesures standard sont dynamiques (dépendent du type de
 * vêtement sélectionné) et forment un objet `Record<string, number>` — gérés
 * en état contrôlé plutôt que via `react-hook-form` (dont les chemins de champ
 * typés se prêtent mal à des clés dynamiques). `createMeasurementProfileAction`
 * revalide de toute façon tout côté serveur avec le même schéma Zod.
 */
export function MeasurementProfileForm({ clientId }: MeasurementProfileFormProps) {
  const router = useRouter();
  const [garmentType, setGarmentType] = useState<GarmentType>("robe");
  const [label, setLabel] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [observations, setObservations] = useState("");
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [labelError, setLabelError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = MEASUREMENT_FIELDS_BY_GARMENT_TYPE[garmentType];

  // Dérivé, pas synchronisé : ce que l'utilisateur perdrait en quittant la page.
  const isDirty =
    label.trim() !== "" ||
    observations.trim() !== "" ||
    isPrimary ||
    Object.values(measurements).some((value) => value.trim() !== "");

  function handleGarmentTypeChange(value: string) {
    setGarmentType(value as GarmentType);
    // Les champs standard changent avec le type de vêtement : on repart d'un
    // formulaire de mesures vide plutôt que de garder des valeurs qui ne
    // correspondent plus aux nouveaux champs affichés.
    setMeasurements({});
  }

  function handleMeasurementChange(field: string, rawValue: string) {
    setMeasurements((prev) => ({ ...prev, [field]: rawValue.replace(/\D/g, "") }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(undefined);
    setLabelError(undefined);

    if (!label.trim()) {
      setLabelError("Le nom du profil est obligatoire.");
      return;
    }

    const standardMeasurements: Record<string, number> = {};
    for (const field of fields) {
      const raw = measurements[field];
      standardMeasurements[field] = raw ? Number.parseInt(raw, 10) : 0;
    }

    setIsSubmitting(true);
    const result = await createMeasurementProfileAction({
      clientId,
      label: label.trim(),
      garmentType,
      standardMeasurements,
      observations: observations.trim() || undefined,
      isPrimary,
    });
    setIsSubmitting(false);

    if (!result.success || !result.data) {
      setFormError(
        result.error ?? "Impossible d'enregistrer ce profil. Vérifiez les champs puis réessayez."
      );
      return;
    }

    toast.success("Profil de mesures créé");
    router.push(`/clients/${clientId}/mesures/${result.data.id}`);
  }

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Select
          label="Type de vêtement"
          required
          options={GARMENT_TYPE_OPTIONS}
          value={garmentType}
          onChange={(event) => handleGarmentTypeChange(event.target.value)}
        />
        <Input
          label="Nom du profil"
          required
          placeholder="Ex. Mesures robe de cérémonie"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          error={labelError}
        />

        <div>
          <p className="mb-3 text-sm font-medium text-text">
            Mesures ({GARMENT_TYPE_LABELS[garmentType]}) — en centimètres
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <Input
                key={field}
                type="number"
                inputMode="numeric"
                min={0}
                label={field}
                placeholder="0"
                value={measurements[field] ?? ""}
                onChange={(event) => handleMeasurementChange(field, event.target.value)}
              />
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(event) => setIsPrimary(event.target.checked)}
            className="size-4 rounded border-border-strong text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
          />
          Définir comme profil principal
        </label>

        <Textarea
          label="Observations"
          hint="Facultatif — particularités utiles pour la couture ou l'essayage."
          value={observations}
          onChange={(event) => setObservations(event.target.value)}
        />

        {formError ? (
          <p className="rounded-[var(--radius-md)] bg-danger-bg px-3 py-2 text-sm text-danger">{formError}</p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <CancelFormButton
            href={`/clients/${clientId}`}
            isDirty={isDirty}
            disabled={isSubmitting}
            description="Les mesures saisies ne seront pas enregistrées."
          />
          <Button type="submit" fullWidth="mobile" isLoading={isSubmitting}>
            Enregistrer le profil
          </Button>
        </div>
      </form>
    </Card>
  );
}
