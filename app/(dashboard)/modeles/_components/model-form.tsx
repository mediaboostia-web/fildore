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
import { createCatalogItemAction, updateCatalogItemAction } from "@/features/catalog/actions";
import { CATALOG_CATEGORY_LABELS, type CatalogCategory, type CatalogItem } from "@/features/catalog/types";
import { GARMENT_TYPE_LABELS } from "@/features/measurements/constants";
import type { GarmentType } from "@/features/measurements/types";

export interface ModelFormProps {
  /** Modèle à modifier ; absent en création. */
  item?: CatalogItem;
}

const CATEGORY_OPTIONS = Object.entries(CATALOG_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const GARMENT_TYPE_OPTIONS = Object.entries(GARMENT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

/**
 * Formulaire unique du catalogue, en création et en modification : un seul jeu
 * de champs et de règles à maintenir, plutôt que deux écrans qui divergent.
 */
export function ModelForm({ item }: ModelFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = item !== undefined;

  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState<CatalogCategory>(item?.category ?? "robe");
  const [garmentType, setGarmentType] = useState<GarmentType>(item?.garmentType ?? "robe");
  const [description, setDescription] = useState(item?.description ?? "");
  // Pas de prix ni de tags suggérés au hasard : un exemple prérempli finit
  // enregistré tel quel. Les exemples restent dans les placeholders.
  const [indicativePrice, setIndicativePrice] = useState<number>(item?.indicativePrice ?? 0);
  const [estimatedDelayDays, setEstimatedDelayDays] = useState<number>(item?.estimatedDelayDays ?? 7);
  const [tagInput, setTagInput] = useState((item?.tags ?? []).join(", "));
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    const payload = {
      name: name.trim(),
      category,
      garmentType,
      description: description.trim() || undefined,
      indicativePrice: indicativePrice > 0 ? indicativePrice : undefined,
      estimatedDelayDays: estimatedDelayDays > 0 ? estimatedDelayDays : undefined,
      imageUrl: imageUrl || undefined,
      tags: tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    startTransition(async () => {
      const res = isEditing
        ? await updateCatalogItemAction({ itemId: item.id, ...payload })
        : await createCatalogItemAction(payload);

      if (res.success && res.data) {
        toast.success(isEditing ? "Modèle mis à jour" : "Modèle ajouté au catalogue");
        router.push(`/modeles/${res.data.id}`);
        router.refresh();
        return;
      }

      setFieldErrors(res.fieldErrors ?? {});
      setErrorMsg(
        res.error ??
          (res.fieldErrors
            ? "Vérifiez les champs signalés ci-dessous."
            : "Le modèle n'a pas pu être enregistré. Réessayez.")
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

      <Input
        label="Nom de la création / du modèle"
        required
        autoFocus
        placeholder="Ex. Robe Kaba Élégance 2026"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={fieldErrors.name?.[0]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Catégorie catalogue"
          value={category}
          onChange={(e) => setCategory(e.target.value as CatalogCategory)}
          options={CATEGORY_OPTIONS}
        />

        <Select
          label="Type de vêtement associé"
          value={garmentType}
          onChange={(e) => setGarmentType(e.target.value as GarmentType)}
          options={GARMENT_TYPE_OPTIONS}
          hint="Détermine les champs de mesures proposés."
        />
      </div>

      <Textarea
        label="Description & conseils tissus"
        rows={3}
        placeholder="Ex. Idéal pour wax hollandais, bazin riche ou soie. Coupe cintrée avec fente latérale…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <CurrencyInput
          label="Prix indicatif de confection"
          value={indicativePrice}
          onChange={setIndicativePrice}
          hint="Laissez à 0 pour un modèle « sur devis »."
          error={fieldErrors.indicativePrice?.[0]}
        />

        <Input
          label="Délai estimé (en jours)"
          type="number"
          min={1}
          value={estimatedDelayDays}
          onChange={(e) => setEstimatedDelayDays(parseInt(e.target.value, 10) || 0)}
          error={fieldErrors.estimatedDelayDays?.[0]}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-text">
          Photo du modèle ou création
        </label>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { label: "Robe soirée / Wax", src: "/Une Couturière Africaine Coud Avec Diligence Des Vêtements à Laide De Machines Dans Son Bureau De Tailleur Photo Et Image en Téléchargement Gratuit - Pngtree.jpg" },
            { label: "Créateur / Modéliste", src: "/Je suis votre modéliste.jpg" },
            { label: "Atelier pro", src: "/Images pro.jpg" },
            { label: "Couture africaine", src: "/African tailor happily standing in front of her sewing machine _ Premium Photo.jpg" },
          ].map((photo) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setImageUrl(photo.src)}
              className={`relative size-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                imageUrl === photo.src
                  ? "border-primary-900 ring-2 ring-primary-900/30 scale-105"
                  : "border-border hover:border-primary-800 opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.label} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        <p className="text-[11px] text-text-subtle">
          Sélectionnez une photo d&apos;atelier pour illustrer le modèle.
        </p>
      </div>

      <Input
        label="Tags / mots-clés"
        placeholder="Wax, Mariage, Broderie…"
        hint="Séparés par des virgules."
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
      />

      <div className="flex items-center justify-between border-t border-border pt-4">
        <LinkButton href={isEditing ? `/modeles/${item.id}` : "/modeles"} variant="secondary">
          Annuler
        </LinkButton>
        <Button type="submit" isLoading={isPending} icon={<Check className="size-4" />}>
          {isEditing ? "Enregistrer les modifications" : "Ajouter au catalogue"}
        </Button>
      </div>
    </form>
  );
}
