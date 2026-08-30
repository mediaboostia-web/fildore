"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useOrderWizardStore } from "@/features/orders/store";
import { GARMENT_TYPE_LABELS } from "@/features/measurements/constants";
import type { GarmentType } from "@/features/measurements/types";

export default function OrderWizardDetailsStep() {
  const router = useRouter();
  const draft = useOrderWizardStore((state) => state.draft);
  const setStepData = useOrderWizardStore((state) => state.setStepData);

  const [garmentType, setGarmentType] = useState<GarmentType>(draft.garmentType || "robe");
  const [title, setTitle] = useState(draft.title || "");
  const [description, setDescription] = useState(draft.description || "");
  const [eventDate, setEventDate] = useState(draft.eventDate || "");
  const [deliveryDate, setDeliveryDate] = useState(draft.deliveryDate || "");

  // Date "livraison dans 7 jours" par défaut : calculée après montage (effet),
  // jamais lors du rendu — `Date.now()` y est impur (react-hooks/purity). C'est
  // le seul cas légitime de setState synchrone dans un effet ici : il n'existe
  // pas d'équivalent "dérivé du rendu" pour une valeur qui dépend de l'horloge.
  useEffect(() => {
    if (!draft.deliveryDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeliveryDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    }
  }, [draft.deliveryDate]);

  const [items, setItems] = useState<
    { label: string; garmentType: GarmentType; quantity: number; unitPrice: number }[]
  >(
    draft.items && draft.items.length > 0
      ? draft.items
      : [{ label: "Confection sur mesure", garmentType: "robe", quantity: 1, unitPrice: 25000 }]
  );

  const [errorMsg, setErrorMsg] = useState("");

  const handleAddItem = () => {
    setItems([
      ...items,
      { label: "Finitions & accessoires", garmentType, quantity: 1, unitPrice: 5000 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: "label" | "quantity" | "unitPrice" | "garmentType",
    value: string | number
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const calculatedTotal = items.reduce(
    (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
    0
  );

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Le titre de la commande est obligatoire.");
      return;
    }
    if (!deliveryDate) {
      setErrorMsg("La date de livraison prévue est obligatoire.");
      return;
    }
    if (items.length === 0 || !items.some((i) => i.label.trim())) {
      setErrorMsg("Ajoutez au moins une ligne de prestation avec un libellé.");
      return;
    }

    setStepData({
      garmentType,
      title: title.trim(),
      description: description.trim() || undefined,
      eventDate: eventDate || undefined,
      deliveryDate,
      items,
      totalAmount: calculatedTotal,
    });

    router.push("/commandes/nouveau/mesures");
  };

  const garmentOptions = Object.entries(GARMENT_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-text">Étape 2 : Détails de la tenue</h2>
        <p className="text-sm text-text-muted">
          Précisez le type de vêtement, le titre descriptif et les dates d&apos;échéance.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-danger-bg p-3 text-sm text-danger" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Type principal"
          required
          value={garmentType}
          onChange={(e) => {
            const newType = e.target.value as GarmentType;
            setGarmentType(newType);
            if (!title || title.startsWith("Confection")) {
              setTitle(`Confection ${GARMENT_TYPE_LABELS[newType]}`);
            }
          }}
          options={garmentOptions}
        />

        <Input
          label="Titre de la commande"
          required
          placeholder="Ex. Robe sirène wax pour mariage"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-text">
          Description / Instructions particulières
        </label>
        <Textarea
          placeholder="Ex. Manches bouffantes, col bateau, fermeture éclair invisible dans le dos..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-text">
            Date de livraison prévue *
          </label>
          <Input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text">
            Date de l&apos;événement (facultatif)
          </label>
          <Input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>
      </div>

      {/* Lignes de prestations */}
      <div className="rounded-lg border border-border bg-canvas/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-text">Lignes de prestation / Articles</label>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleAddItem}
            icon={<Plus className="size-3" />}
          >
            Ajouter une ligne
          </Button>
        </div>

        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-2 rounded border border-border bg-surface p-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                placeholder="Libellé (ex. Confection robe)"
                value={item.label}
                onChange={(e) => handleItemChange(idx, "label", e.target.value)}
                required
              />
            </div>
            <div className="w-20">
              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, "quantity", parseInt(e.target.value, 10) || 1)}
                aria-label="Quantité"
              />
            </div>
            <div className="w-36">
              <CurrencyInput
                value={item.unitPrice}
                onChange={(val) => handleItemChange(idx, "unitPrice", val)}
                placeholder="Prix unit."
              />
            </div>
            {items.length > 1 && (
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                onClick={() => handleRemoveItem(idx)}
                className="text-text-muted hover:text-danger"
                aria-label="Supprimer la ligne"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <LinkButton href="/commandes/nouveau/client" variant="secondary" icon={<ArrowLeft className="size-4" />}>
          Retour au client
        </LinkButton>
        <Button type="submit" icon={<ArrowRight className="size-4" />}>
          Continuer vers Mesures
        </Button>
      </div>
    </form>
  );
}
