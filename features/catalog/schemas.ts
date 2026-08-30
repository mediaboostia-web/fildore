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

export const catalogItemFormSchema = z.object({
  name: z.string().trim().min(1, "Le nom du modèle est obligatoire."),
  category: catalogCategorySchema,
  garmentType: garmentTypeSchema,
  description: z.string().trim().optional(),
  indicativePrice: amountSchema.optional(),
  estimatedDelayDays: z.number().int().min(0).optional(),
  tags: z.array(z.string()).optional().default([]),
});

export type CatalogItemFormValues = z.infer<typeof catalogItemFormSchema>;
