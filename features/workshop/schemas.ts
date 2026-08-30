import { z } from "zod";
import { phoneSchema } from "@/lib/validations/common";

export const roleSchema = z.enum(["owner", "manager", "couturiere", "reception", "comptable"]);

export const workshopSettingsSchema = z.object({
  name: z.string().trim().min(2, "Le nom de l'atelier est obligatoire."),
  whatsappPhone: phoneSchema,
  city: z.string().trim().min(1, "Indiquez la ville de l'atelier."),
  country: z.string().trim().min(1, "Indiquez le pays de l'atelier."),
});

export type WorkshopSettingsValues = z.infer<typeof workshopSettingsSchema>;

export const inviteMemberSchema = z.object({
  fullName: z.string().trim().min(2, "Indiquez le nom du collaborateur."),
  email: z.email("Adresse e-mail invalide."),
  role: roleSchema,
});

export type InviteMemberValues = z.infer<typeof inviteMemberSchema>;
