"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import {
  acceptOrderRequestAction,
  refuseOrderRequestAction,
} from "@/features/public-orders/actions";
import { GARMENT_TYPE_LABELS } from "@/features/measurements/constants";
import type { GarmentType } from "@/features/measurements/types";

export interface ReviewRequestPanelProps {
  requestId: string;
  defaultTitle: string;
  defaultGarmentType: GarmentType;
  defaultDeliveryDate: string;
  defaultTotalAmount: number;
  canReview: boolean;
}

const GARMENT_OPTIONS = Object.entries(GARMENT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

/**
 * Décision de l'atelier sur une demande reçue en ligne.
 *
 * Le montant n'est **pas** prérempli au hasard : il vient du prix indicatif du
 * modèle demandé quand il existe, sinon l'atelier le saisit. C'est lui qui
 * fixera le prix après avoir parlé au client — Fildor n'en invente aucun.
 */
export function ReviewRequestPanel({
  requestId,
  defaultTitle,
  defaultGarmentType,
  defaultDeliveryDate,
  defaultTotalAmount,
  canReview,
}: ReviewRequestPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(defaultTitle);
  const [garmentType, setGarmentType] = useState<GarmentType>(defaultGarmentType);
  const [deliveryDate, setDeliveryDate] = useState(defaultDeliveryDate);
  const [totalAmount, setTotalAmount] = useState(defaultTotalAmount);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [isRefuseOpen, setIsRefuseOpen] = useState(false);
  const [refusalReason, setRefusalReason] = useState("");

  if (!canReview) {
    return (
      <Card>
        <p className="text-sm text-text-muted">
          Seuls le propriétaire, un manager ou la réception peuvent accepter ou refuser une
          demande.
        </p>
      </Card>
    );
  }

  const handleAccept = () => {
    setErrorMsg("");
    setFieldErrors({});

    startTransition(async () => {
      const res = await acceptOrderRequestAction({
        requestId,
        title: title.trim(),
        garmentType,
        deliveryDate,
        totalAmount,
      });

      if (res.success && res.data) {
        toast.success("Demande acceptée : la commande est créée");
        router.push(`/commandes/${res.data.orderId}`);
        return;
      }

      setFieldErrors(res.fieldErrors ?? {});
      setErrorMsg(
        res.error ??
          (res.fieldErrors
            ? "Vérifiez les champs signalés ci-dessous."
            : "La demande n'a pas pu être acceptée. Réessayez.")
      );
    });
  };

  const handleRefuse = () => {
    startTransition(async () => {
      const res = await refuseOrderRequestAction({ requestId, reason: refusalReason.trim() });

      if (res.success) {
        toast.success("Demande refusée. Aucun client ni commande n'a été créé.");
        setIsRefuseOpen(false);
        router.refresh();
        return;
      }

      toast.error(res.error ?? "La demande n'a pas pu être refusée. Réessayez.");
    });
  };

  return (
    <>
      <Card>
        <h2 className="mb-1 text-sm font-bold text-text">Accepter cette demande</h2>
        <p className="mb-4 text-xs text-text-muted">
          À l&apos;acceptation, Fildor crée la fiche client (ou la retrouve si le numéro est déjà
          connu) et une commande « À confirmer ». Vous gardez la main sur le prix et la date.
        </p>

        {errorMsg ? (
          <div className="mb-4 rounded-[var(--radius-md)] bg-danger-bg p-3 text-sm text-danger" role="alert">
            {errorMsg}
          </div>
        ) : null}

        <div className="space-y-4">
          <Input
            label="Titre de la commande"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={fieldErrors.title?.[0]}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Type de vêtement"
              value={garmentType}
              onChange={(e) => setGarmentType(e.target.value as GarmentType)}
              options={GARMENT_OPTIONS}
            />
            <Input
              label="Date de livraison"
              type="date"
              required
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              error={fieldErrors.deliveryDate?.[0]}
            />
          </div>

          <CurrencyInput
            label="Montant convenu"
            required
            value={totalAmount}
            onChange={setTotalAmount}
            error={fieldErrors.totalAmount?.[0]}
            hint="Le prix que vous avez confirmé avec le client. Vous pourrez le modifier ensuite."
          />
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-between">
          <Button
            variant="secondary"
            fullWidth="mobile"
            disabled={isPending}
            onClick={() => setIsRefuseOpen(true)}
            icon={<X className="size-4" />}
          >
            Refuser
          </Button>
          <Button
            fullWidth="mobile"
            isLoading={isPending}
            onClick={handleAccept}
            icon={<Check className="size-4" />}
          >
            Accepter et créer la commande
          </Button>
        </div>
      </Card>

      <Dialog open={isRefuseOpen} onOpenChange={setIsRefuseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser cette demande ?</DialogTitle>
            <DialogDescription>
              Aucun client ni commande ne sera créé. Le motif reste dans votre atelier : il vous
              aidera à répondre au client si vous le rappelez.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <Textarea
              label="Motif du refus"
              required
              rows={3}
              placeholder="Ex. Délai trop court pour cette période, ou modèle que nous ne réalisons plus."
              value={refusalReason}
              onChange={(e) => setRefusalReason(e.target.value)}
            />
          </DialogBody>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsRefuseOpen(false)} disabled={isPending}>
              Revenir
            </Button>
            <Button
              variant="danger"
              isLoading={isPending}
              disabled={refusalReason.trim().length < 3}
              onClick={handleRefuse}
            >
              Refuser la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
