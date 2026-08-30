"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CancelFormButton } from "@/components/shared/cancel-form-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { toast } from "@/components/ui/toast";
import { updateOrderAction } from "@/features/orders/actions";
import type { Order } from "@/features/orders/types";
import { GARMENT_TYPE_LABELS } from "@/features/measurements/constants";
import type { GarmentType } from "@/features/measurements/types";

const PRIORITY_OPTIONS = [
  { value: "normale", label: "Normale" },
  { value: "urgente", label: "Urgente" },
];

export function OrderEditForm({ order }: { order: Order }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(order.title);
  const [garmentType, setGarmentType] = useState<GarmentType>(order.garmentType);
  const [description, setDescription] = useState(order.description || "");
  const [priority, setPriority] = useState<"normale" | "urgente">(order.priority);
  const [deliveryDate, setDeliveryDate] = useState(order.deliveryDate);
  const [eventDate, setEventDate] = useState(order.eventDate || "");
  const [totalAmount, setTotalAmount] = useState(order.totalAmount);
  const [discountAmount, setDiscountAmount] = useState(order.discountAmount || 0);
  const [errorMsg, setErrorMsg] = useState("");
  /** Erreurs Zod renvoyées par le serveur, affichées sous le champ concerné. */
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const garmentOptions = Object.entries(GARMENT_TYPE_LABELS).map(([val, label]) => ({
    value: val,
    label,
  }));

  // Comparaison avec la commande d'origine : sur un formulaire d'édition, seul
  // ce qui a réellement changé mérite une confirmation avant de sortir.
  const isDirty =
    title !== order.title ||
    garmentType !== order.garmentType ||
    description !== (order.description || "") ||
    priority !== order.priority ||
    deliveryDate !== order.deliveryDate ||
    eventDate !== (order.eventDate || "") ||
    totalAmount !== order.totalAmount ||
    discountAmount !== (order.discountAmount || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    startTransition(async () => {
      const res = await updateOrderAction({
        orderId: order.id,
        title: title.trim(),
        garmentType,
        description: description.trim() || undefined,
        priority,
        totalAmount,
        discountAmount,
        eventDate: eventDate || undefined,
        deliveryDate,
        depositDueDate: order.depositDueDate,
      });

      if (res.success) {
        toast.success("Commande mise à jour");
        // `updateOrderAction` a déjà revalidé la fiche : pas de second rendu.
        router.push(`/commandes/${order.id}`);
        return;
      }

      setFieldErrors(res.fieldErrors ?? {});
      setErrorMsg(
        res.error ??
          (res.fieldErrors
            ? "Vérifiez les champs signalés ci-dessous."
            : "La commande n'a pas pu être enregistrée. Réessayez.")
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {errorMsg && (
        <div className="rounded bg-danger-bg p-3 text-xs text-danger" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Type de vêtement"
          value={garmentType}
          onChange={(e) => setGarmentType(e.target.value as GarmentType)}
          options={garmentOptions}
        />

        <Input
          label="Titre de la commande"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={fieldErrors.title?.[0]}
        />
      </div>

      <Select
        label="Priorité"
        value={priority}
        onChange={(e) => setPriority(e.target.value as "normale" | "urgente")}
        options={PRIORITY_OPTIONS}
      />

      <Textarea
        label="Instructions atelier"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Date de livraison prévue"
          type="date"
          required
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          error={fieldErrors.deliveryDate?.[0]}
        />
        <Input
          label="Date de l'événement"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          error={fieldErrors.eventDate?.[0]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CurrencyInput
          label="Montant total"
          required
          value={totalAmount}
          onChange={setTotalAmount}
          error={fieldErrors.totalAmount?.[0]}
        />
        <CurrencyInput
          label="Remise"
          value={discountAmount}
          onChange={setDiscountAmount}
          error={fieldErrors.discountAmount?.[0]}
        />
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <CancelFormButton
          href={`/commandes/${order.id}`}
          isDirty={isDirty}
          disabled={isPending}
          description="Les modifications apportées à cette commande ne seront pas enregistrées."
        />
        <Button
          type="submit"
          fullWidth="mobile"
          isLoading={isPending}
          icon={<Check className="size-4" />}
        >
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}
