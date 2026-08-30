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

/**
 * Correction d'un profil existant. Le type de vêtement n'y figure pas : il fixe
 * les champs de mesures, en changer revient à créer un autre profil.
 */
export const measurementProfileUpdateSchema = z.object({
  profileId: z.string().min(1),
  label: z.string().trim().min(1, "Le nom du profil est obligatoire."),
  standardMeasurements: z.record(z.string(), z.number().int().min(0)),
  customMeasurements: z
    .array(z.object({ label: z.string().trim().min(1), valueCm: z.number().int().min(0) }))
    .optional()
    .default([]),
  observations: z.string().trim().optional(),
});

export type MeasurementProfileUpdateValues = z.infer<typeof measurementProfileUpdateSchema>;
