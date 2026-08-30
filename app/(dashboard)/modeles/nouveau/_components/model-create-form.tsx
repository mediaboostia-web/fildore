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
import { createCatalogItemAction } from "@/features/catalog/actions";
import { CATALOG_CATEGORY_LABELS, type CatalogCategory } from "@/features/catalog/types";
import { GARMENT_TYPE_LABELS } from "@/features/measurements/constants";
import type { GarmentType } from "@/features/measurements/types";

export function ModelCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<CatalogCategory>("robe");
  const [garmentType, setGarmentType] = useState<GarmentType>("robe");
  const [description, setDescription] = useState("");
  const [indicativePrice, setIndicativePrice] = useState<number>(35000);
  const [estimatedDelayDays, setEstimatedDelayDays] = useState<number>(7);
  const [tagInput, setTagInput] = useState("Wax, Soirée, Moderne");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Le nom du modèle est obligatoire.");
      return;
    }

    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    startTransition(async () => {
      const res = await createCatalogItemAction({
        name: name.trim(),
        category,
        garmentType,
        description: description.trim() || undefined,
        indicativePrice: indicativePrice > 0 ? indicativePrice : undefined,
        estimatedDelayDays: estimatedDelayDays > 0 ? estimatedDelayDays : undefined,
        tags,
      });

      if (res.success && res.data) {
        router.push(`/modeles/${res.data.id}`);
      } else {
        setErrorMsg(res.error || "Erreur lors de l'enregistrement du modèle.");
      }
    });
  };

  const categoryOptions = Object.entries(CATALOG_CATEGORY_LABELS).map(([val, label]) => ({
    value: val,
    label,
  }));

  const garmentTypeOptions = Object.entries(GARMENT_TYPE_LABELS).map(([val, label]) => ({
    value: val,
    label,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="rounded bg-danger-bg p-3 text-xs text-danger" role="alert">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium text-text">Nom de la création / du modèle *</label>
        <Input
          placeholder="Ex. Robe Kaba Élégance 2026"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Catégorie catalogue"
          value={category}
          onChange={(e) => setCategory(e.target.value as CatalogCategory)}
          options={categoryOptions}
        />

        <Select
          label="Type de vêtement associé"
          value={garmentType}
          onChange={(e) => setGarmentType(e.target.value as GarmentType)}
          options={garmentTypeOptions}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-text">Description & Conseils tissus</label>
        <Textarea
          placeholder="Ex. Idéal pour wax hollandais, bazin riche ou soie. Coupe cintrée avec fente latérale..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-text">Prix indicatif de confection</label>
          <CurrencyInput
            value={indicativePrice}
            onChange={(val) => setIndicativePrice(val)}
            placeholder="0"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text">Délai estimé (en jours)</label>
          <Input
            type="number"
            min={1}
            value={estimatedDelayDays}
            onChange={(e) => setEstimatedDelayDays(parseInt(e.target.value, 10) || 7)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-text">
          Tags / Mots-clés (séparés par des virgules)
        </label>
        <Input
          placeholder="Wax, Mariage, Broderie, Tendance..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <LinkButton href="/modeles" variant="secondary">
          Annuler
        </LinkButton>
        <Button type="submit" isLoading={isPending} icon={<Check className="size-4" />}>
          Ajouter au catalogue
        </Button>
      </div>
    </form>
  );
}
