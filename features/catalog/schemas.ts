import { z } from "zod";
import { amountSchema } from "@/lib/validations/common";
import { garmentTypeSchema } from "@/features/measurements/schemas";

export const catalogCategorySchema = z.enum([
  "robe",
  "boubou_femme",
  "boubou_homme",
  "costume",
  "chemise",
  "ensemble",
  "mariage",
  "ceremonie",
  "enfant",
  "uniforme",
  "accessoire",
  "autre",
]);

/**
 * Plafond de la photo, revérifié côté serveur : le navigateur compresse déjà,
 * mais une Server Action est appelable directement, sans passer par notre
 * formulaire. Aligné sur `MAX_PHOTO_BYTES` de `components/ui/photo-field.tsx`.
 */
const MAX_PHOTO_LENGTH = 400 * 1024;

export const modelPhotoSchema = z
  .string()
  .trim()
  .max(MAX_PHOTO_LENGTH, "Cette photo est trop lourde. Choisissez une photo moins détaillée.")
  .refine(
    (value) => value === "" || value.startsWith("data:image/") || value.startsWith("/"),
    "Ce fichier n'est pas une photo."
  );

export const catalogItemFormSchema = z.object({
  name: z.string().trim().min(1, "Le nom du modèle est obligatoire."),
  category: catalogCategorySchema,
  garmentType: garmentTypeSchema,
  description: z.string().trim().optional(),
  indicativePrice: amountSchema.optional(),
  estimatedDelayDays: z.number().int().min(0).optional(),
  imageUrl: modelPhotoSchema.optional(),
  tags: z.array(z.string()).optional().default([]),
});

export type CatalogItemFormValues = z.infer<typeof catalogItemFormSchema>;

export const catalogItemUpdateSchema = catalogItemFormSchema.extend({
  itemId: z.string().min(1),
});

export type CatalogItemUpdateValues = z.infer<typeof catalogItemUpdateSchema>;
