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
import type { Order } from "@/features/orders/types";
import { GARMENT_TYPE_LABELS } from "@/features/measurements/constants";
import type { GarmentType } from "@/features/measurements/types";

export function OrderEditForm({ order }: { order: Order }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(order.title);
  const [garmentType, setGarmentType] = useState<GarmentType>(order.garmentType);
  const [description, setDescription] = useState(order.description || "");
  const [deliveryDate, setDeliveryDate] = useState(order.deliveryDate);
  const [eventDate, setEventDate] = useState(order.eventDate || "");
  const [totalAmount, setTotalAmount] = useState(order.totalAmount);
  const [discountAmount, setDiscountAmount] = useState(order.discountAmount || 0);
  const [errorMsg, setErrorMsg] = useState("");

  const garmentOptions = Object.entries(GARMENT_TYPE_LABELS).map(([val, label]) => ({
    value: val,
    label,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Le titre est obligatoire.");
      return;
    }
    if (!deliveryDate) {
      setErrorMsg("La date de livraison est obligatoire.");
      return;
    }

    startTransition(async () => {
      const { getDb } = await import("@/lib/mock-data/store");
      const db = getDb();
      const existing = db.orders.find((o) => o.id === order.id);
      if (existing) {
        existing.title = title.trim();
        existing.garmentType = garmentType;
        existing.description = description.trim() || undefined;
        existing.deliveryDate = deliveryDate;
        existing.eventDate = eventDate || undefined;
        existing.totalAmount = totalAmount;
        existing.discountAmount = discountAmount;
        existing.updatedAt = new Date().toISOString();
      }
      router.push(`/commandes/${order.id}`);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="mb-1 block text-xs font-medium text-text">Titre de la commande *</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-text">Instructions atelier</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-text">Date de livraison prévue *</label>
          <Input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text">Date de l&apos;événement</label>
          <Input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-text">Montant total *</label>
          <CurrencyInput
            value={totalAmount}
            onChange={(val) => setTotalAmount(val)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text">Remise</label>
          <CurrencyInput
            value={discountAmount}
            onChange={(val) => setDiscountAmount(val)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
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
