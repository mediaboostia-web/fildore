import { z } from "zod";
import { phoneSchema } from "@/lib/validations/common";

export const clientFormSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est obligatoire."),
  lastName: z.string().trim().min(1, "Le nom est obligatoire."),
  phone: phoneSchema,
  city: z.string().trim().min(1, "La ville est obligatoire."),
  district: z.string().trim().optional().default(""),
  address: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

/**
 * Type d'entrée (avant application des `.default()` de Zod) — utilisé pour
 * typer `useForm` côté client : `zodResolver` valide `ClientFormInput` en
 * entrée et produit `ClientFormValues` en sortie (voir app/(dashboard)/clients/_components/client-form.tsx).
 */
export type ClientFormInput = z.input<typeof clientFormSchema>;
