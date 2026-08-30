import { z } from "zod";
import { roleSchema } from "@/features/workshop/schemas";

/**
 * Le mot de passe n'est pas encore vérifié : le mock ne stocke aucun hash et
 * n'en fabriquera pas un faux (PROJECT_RULES.md §2 « ne pas fabriquer de fausses
 * intégrations »). La vérification arrivera avec Supabase Auth. On valide donc
 * uniquement le format côté formulaire, comme le fera le vrai backend.
 */
export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.");

export const loginSchema = z.object({
  email: z.email("Adresse e-mail invalide."),
  password: z.string().min(1, "Saisissez votre mot de passe."),
});

export const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Indiquez votre nom complet."),
  workshopName: z.string().trim().min(2, "Indiquez le nom de votre atelier."),
  email: z.email("Adresse e-mail invalide."),
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.email("Adresse e-mail invalide."),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les deux mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export const onboardingSchema = z.object({
  country: z.string().trim().min(1, "Sélectionnez un pays."),
  city: z.string().trim().min(1, "Indiquez la ville principale de l'atelier."),
  whatsappPhone: z
    .string()
    .trim()
    .min(6, "Numéro WhatsApp trop court.")
    .regex(/^[\d+\s.-]+$/, "Numéro WhatsApp invalide."),
});

export { roleSchema };
