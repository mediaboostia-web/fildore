import { z } from "zod";

export const garmentTypeSchema = z.enum([
  "robe",
  "boubou",
  "costume",
  "chemise",
  "pantalon",
  "enfant",
  "uniforme",
  "autre",
]);

export const measurementProfileFormSchema = z.object({
  clientId: z.string().min(1),
  label: z.string().trim().min(1, "Le nom du profil est obligatoire."),
  garmentType: garmentTypeSchema,
  standardMeasurements: z.record(z.string(), z.number().int().min(0)),
  customMeasurements: z
    .array(z.object({ label: z.string().trim().min(1), valueCm: z.number().int().min(0) }))
    .optional()
    .default([]),
  observations: z.string().trim().optional(),
  isPrimary: z.boolean().optional().default(false),
});

export type MeasurementProfileFormValues = z.infer<typeof measurementProfileFormSchema>;
