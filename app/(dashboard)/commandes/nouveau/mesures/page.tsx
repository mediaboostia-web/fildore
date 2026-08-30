"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Plus, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useOrderWizardStore } from "@/features/orders/store";
import { createMeasurementProfileAction } from "@/features/measurements/actions";
import {
  GARMENT_TYPE_LABELS,
  MEASUREMENT_FIELDS_BY_GARMENT_TYPE,
} from "@/features/measurements/constants";
import { getProfilesByClient } from "@/lib/mock-data/measurement-profiles";
import type { MeasurementProfile } from "@/features/measurements/types";

export default function OrderWizardMeasurementsStep() {
  const router = useRouter();
  const draft = useOrderWizardStore((state) => state.draft);
  const setStepData = useOrderWizardStore((state) => state.setStepData);

  const [profiles, setProfiles] = useState<MeasurementProfile[]>([]);
  const [loading, setLoading] = useState(() => Boolean(draft.clientId));
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    draft.measurementProfileId || ""
  );
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const garmentType = draft.garmentType || "robe";
  const [newLabel, setNewLabel] = useState(`Mesures ${GARMENT_TYPE_LABELS[garmentType]}`);
  const standardFields = MEASUREMENT_FIELDS_BY_GARMENT_TYPE[garmentType] || [];
  const [measurementValues, setMeasurementValues] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!draft.clientId) return;

    let isMounted = true;
    getProfilesByClient(draft.clientId).then((data) => {
      if (isMounted) {
        setProfiles(data);
        if (data.length > 0) {
          const match = data.find((p) => p.garmentType === garmentType) || data[0];
          setSelectedProfileId(match.id);
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [draft.clientId, garmentType]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) {
      setErrorMsg("Veuillez donner un nom à ce profil de mesures.");
      return;
    }

    startTransition(async () => {
      const res = await createMeasurementProfileAction({
        clientId: draft.clientId!,
        garmentType,
        label: newLabel.trim(),
        isPrimary: profiles.length === 0,
        standardMeasurements: measurementValues,
        customMeasurements: [],
        notes: "Créé lors de la commande",
      });

      if (res.success && res.data) {
        setStepData({ measurementProfileId: res.data.id });
        router.push("/commandes/nouveau/prix");
      } else {
        setErrorMsg(res.error || "Erreur lors de la création du profil de mesures.");
      }
    });
  };

  const handleNext = () => {
    if (!selectedProfileId) {
      setErrorMsg("Veuillez sélectionner un profil de mesures pour cette tenue.");
      return;
    }
    setStepData({ measurementProfileId: selectedProfileId });
    router.push("/commandes/nouveau/prix");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-text">Étape 3 : Profil de mesures</h2>
        <p className="text-sm text-text-muted">
          Sélectionnez les mensurations à utiliser pour cette confection. Une copie figée
          sera conservée avec la commande.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-danger-bg p-3 text-sm text-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {!isCreatingNew ? (
        <>
          <div className="space-y-3">
            {loading ? (
              <div className="py-8 text-center text-sm text-text-muted">
                Chargement des profils de mesures...
              </div>
            ) : profiles.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <Ruler className="mx-auto size-8 text-text-subtle mb-2" />
                <p className="font-medium text-text">Aucun profil de mesures pour ce client.</p>
                <p className="text-xs text-text-muted mt-1">
                  Enregistrez ses mesures dès maintenant pour lancer la coupe.
                </p>
                <Button
                  type="button"
                  onClick={() => setIsCreatingNew(true)}
                  className="mt-4"
                  icon={<Plus className="size-4" />}
                >
                  Saisir les mesures
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Profils enregistrés ({profiles.length})
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsCreatingNew(true)}
                    icon={<Plus className="size-3" />}
                  >
                    Nouveau profil
                  </Button>
                </div>

                <div className="space-y-2">
                  {profiles.map((profile) => {
                    const isSelected = selectedProfileId === profile.id;
                    const isTypeMatch = profile.garmentType === garmentType;
                    const sampleMeasurements = Object.entries(profile.standardMeasurements || {})
                      .slice(0, 3)
                      .map(([k, v]) => `${k} : ${v} cm`)
                      .join(" · ");

                    return (
                      <div
                        key={profile.id}
                        onClick={() => {
                          setSelectedProfileId(profile.id);
                          setErrorMsg("");
                        }}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-all ${
                          isSelected
                            ? "border-primary-800 bg-primary-50/50 shadow-sm"
                            : "border-border bg-surface hover:border-border-strong hover:bg-canvas"
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text">{profile.label}</span>
                            <Badge tone={isTypeMatch ? "info" : "neutral"} className="text-xs">
                              {GARMENT_TYPE_LABELS[profile.garmentType]}
                            </Badge>
                            {profile.isPrimary && (
                              <Badge tone="success" className="text-xs">
                                Principal
                              </Badge>
                            )}
                          </div>
                          {sampleMeasurements && (
                            <span className="text-xs text-text-muted">{sampleMeasurements}</span>
                          )}
                        </div>

                        {isSelected ? (
                          <span className="flex size-6 items-center justify-center rounded-full bg-primary-900 text-white">
                            <Check className="size-4" />
                          </span>
                        ) : (
                          <Badge tone="neutral" className="text-xs">
                            Choisir
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <LinkButton href="/commandes/nouveau/details" variant="secondary" icon={<ArrowLeft className="size-4" />}>
              Retour aux détails
            </LinkButton>
            <Button
              type="button"
              onClick={handleNext}
              disabled={!selectedProfileId}
              icon={<ArrowRight className="size-4" />}
            >
              Continuer vers Prix
            </Button>
          </div>
        </>
      ) : (
        <form onSubmit={handleCreateProfile} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text">
              Nom du profil de mesures *
            </label>
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Ex. Mesures Robe 2026"
              required
            />
          </div>

          <div className="rounded-lg border border-border bg-canvas/50 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-text uppercase tracking-wider">
              Mesures standard pour {GARMENT_TYPE_LABELS[garmentType]} (en cm)
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {standardFields.map((field) => (
                <div key={field}>
                  <label className="mb-1 block text-xs text-text-muted truncate" title={field}>
                    {field}
                  </label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="cm"
                    value={measurementValues[field] ?? ""}
                    onChange={(e) =>
                      setMeasurementValues({
                        ...measurementValues,
                        [field]: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="tertiary"
              onClick={() => setIsCreatingNew(false)}
            >
              Annuler et choisir un profil existant
            </Button>
            <Button type="submit" isLoading={isPending} icon={<ArrowRight className="size-4" />}>
              Enregistrer et continuer
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
