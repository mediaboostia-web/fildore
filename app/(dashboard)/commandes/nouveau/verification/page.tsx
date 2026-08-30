"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  User,
  Scissors,
  Ruler,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import { useOrderWizardStore } from "@/features/orders/store";
import { createOrderAction } from "@/features/orders/actions";
import {
  getWizardSummaryAction,
  type WizardClient,
  type WizardMeasurementProfile,
} from "@/features/orders/wizard-actions";
import { formatAmount } from "@/lib/money/format";
import { formatDateFr } from "@/lib/utils/dates";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { clientDisplayName } from "@/features/clients/types";
import { GARMENT_TYPE_LABELS } from "@/features/measurements/constants";
import { toast } from "@/components/ui/toast";

export default function OrderWizardVerificationStep() {
  const router = useRouter();
  const draft = useOrderWizardStore((state) => state.draft);
  const reset = useOrderWizardStore((state) => state.reset);

  const [client, setClient] = useState<WizardClient | null>(null);
  const [profile, setProfile] = useState<WizardMeasurementProfile | null>(null);
  const [loading, setLoading] = useState(() => Boolean(draft.clientId));
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!draft.clientId) return;

    getWizardSummaryAction({
      clientId: draft.clientId,
      measurementProfileId: draft.measurementProfileId,
    }).then(({ client: clientData, profile: profileData }) => {
      setClient(clientData);
      setProfile(profileData);
      setLoading(false);
    });
  }, [draft.clientId, draft.measurementProfileId]);

  const netPayable = Math.max(0, (draft.totalAmount || 0) - (draft.discountAmount || 0));

  const handleConfirmOrder = () => {
    if (!draft.clientId || !draft.title || !draft.deliveryDate || !draft.measurementProfileId) {
      setErrorMsg("Des informations obligatoires sont manquantes dans le brouillon.");
      return;
    }

    // Un montant absent est une erreur à corriger à l'étape Prix, jamais un prix
    // par défaut inventé : facturer un montant que le couturier n'a pas saisi est
    // le pire bug possible dans un outil qui encaisse (PROJECT_RULES.md §6).
    const totalAmount = Number(draft.totalAmount);
    if (!Number.isInteger(totalAmount) || totalAmount <= 0) {
      setErrorMsg("Indiquez le montant total de la commande à l'étape Prix avant de confirmer.");
      return;
    }

    const resolvedGarmentType = draft.garmentType || "robe";
    const resolvedItems = (draft.items && draft.items.length > 0 ? draft.items : [
      {
        label: draft.title!,
        garmentType: resolvedGarmentType,
        quantity: 1,
        unitPrice: totalAmount,
      }
    ]).map((it) => ({
      label: it.label || draft.title!,
      garmentType: it.garmentType || resolvedGarmentType,
      quantity: Number(it.quantity) || 1,
      unitPrice: Number(it.unitPrice) || 0,
    }));

    startTransition(async () => {
      const res = await createOrderAction({
        clientId: draft.clientId!,
        garmentType: resolvedGarmentType,
        title: draft.title!,
        description: draft.description || undefined,
        items: resolvedItems,
        measurementProfileId: draft.measurementProfileId!,
        catalogItemId: draft.catalogItemId || undefined,
        totalAmount,
        discountAmount: Number(draft.discountAmount) || 0,
        eventDate: draft.eventDate ? draft.eventDate : undefined,
        deliveryDate: draft.deliveryDate!,
        depositDueDate: draft.depositDueDate ? draft.depositDueDate : undefined,
      });

      if (res.success && res.data) {
        toast.success("Commande enregistrée avec succès !");
        reset();
        router.push(`/commandes/${res.data.id}`);
        router.refresh();
      } else {
        const errorText = res.error || (res.fieldErrors ? JSON.stringify(res.fieldErrors) : "Une erreur est survenue lors de la création de la commande.");
        setErrorMsg(errorText);
      }
    });
  };

  if (loading) {
    return <div className="py-12 text-center text-sm text-text-muted">Chargement du récapitulatif...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-text">Étape 5 : Vérification & Confirmation</h2>
        <p className="text-sm text-text-muted">
          Vérifiez les informations ci-dessous avant de valider et générer la référence de commande.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-danger-bg p-3 text-sm text-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {/* Cartes récapitulatives */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Client */}
        <div className="rounded-lg border border-border bg-canvas/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
            <User className="size-3.5" /> Client
          </div>
          {client ? (
            <div>
              <p className="font-semibold text-text">{clientDisplayName(client)}</p>
              <p className="text-xs text-text-muted">{formatPhoneDisplay(client.phone)}</p>
              {client.district && (
                <p className="text-xs text-text-muted">{client.city} · {client.district}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-danger">Client non sélectionné</p>
          )}
        </div>

        {/* Dates */}
        <div className="rounded-lg border border-border bg-canvas/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
            <Calendar className="size-3.5" /> Délais & Échéances
          </div>
          <div>
            <p className="text-sm text-text">
              <span className="text-text-muted">Livraison prévue : </span>
              <strong>{draft.deliveryDate ? formatDateFr(draft.deliveryDate) : "—"}</strong>
            </p>
            {draft.eventDate && (
              <p className="text-xs text-text-muted mt-1">
                Événement : {formatDateFr(draft.eventDate)}
              </p>
            )}
            {draft.depositDueDate && (
              <p className="text-xs text-text-muted">
                Acompte avant le : {formatDateFr(draft.depositDueDate)}
              </p>
            )}
          </div>
        </div>

        {/* Tenue & Prestations */}
        <div className="rounded-lg border border-border bg-canvas/60 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
              <Scissors className="size-3.5" /> Confection
            </div>
            {draft.garmentType && (
              <Badge tone="info" className="text-xs">
                {GARMENT_TYPE_LABELS[draft.garmentType]}
              </Badge>
            )}
          </div>
          <p className="font-semibold text-text">{draft.title}</p>
          {draft.description && (
            <p className="text-xs text-text-muted line-clamp-2">{draft.description}</p>
          )}
        </div>

        {/* Mesures */}
        <div className="rounded-lg border border-border bg-canvas/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
            <Ruler className="size-3.5" /> Profil de mesures
          </div>
          {profile ? (
            <div>
              <p className="font-semibold text-text">{profile.label}</p>
              <p className="text-xs text-text-muted">
                {Object.keys(profile.standardMeasurements || {}).length} mensurations enregistrées
              </p>
            </div>
          ) : (
            <p className="text-xs text-danger">Profil non sélectionné</p>
          )}
        </div>
      </div>

      {/* Détails financiers */}
      <div className="rounded-lg border border-border bg-surface p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border pb-2">
          <Wallet className="size-3.5" /> Synthèse financière
        </div>

        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Total de la commande :</span>
            <span className="font-medium text-text">{formatAmount(draft.totalAmount || 0)}</span>
          </div>
          {draft.discountAmount ? (
            <div className="flex justify-between text-success">
              <span>Remise accordée :</span>
              <span>- {formatAmount(draft.discountAmount)}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
            <span className="text-text">Net à payer :</span>
            <span className="text-primary-900">{formatAmount(netPayable)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <LinkButton href="/commandes/nouveau/prix" variant="secondary" icon={<ArrowLeft className="size-4" />}>
          Modifier le prix
        </LinkButton>
        <Button
          type="button"
          onClick={handleConfirmOrder}
          isLoading={isPending}
          icon={<CheckCircle2 className="size-4" />}
        >
          Confirmer et créer la commande
        </Button>
      </div>
    </div>
  );
}
