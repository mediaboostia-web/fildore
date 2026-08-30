"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
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
        router.push(`/commandes/${order.id}`);
        router.refresh();
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

      <div className="flex items-center justify-between border-t border-border pt-4">
        <LinkButton href={`/commandes/${order.id}`} variant="secondary">
          Annuler
        </LinkButton>
        <Button type="submit" isLoading={isPending} icon={<Check className="size-4" />}>
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}
