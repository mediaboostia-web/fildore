import { z } from "zod";
import { catalogCategorySchema } from "@/features/catalog/schemas";

/**
 * Validation d'une demande envoyée **sans session**.
 *
 * Une Server Action publique est appelable directement, sans passer par notre
 * formulaire : tout ce qui arrive ici est considéré hostile jusqu'à preuve du
 * contraire. Les bornes sont volontairement serrées — un champ « note » de
 * 50 000 caractères n'est pas une commande, c'est une attaque.
 */
export const orderRequestSchema = z.object({
  workshopSlug: z.string().trim().min(1).max(80),
  catalogItemId: z.string().trim().max(80).optional(),

  firstName: z
    .string()
    .trim()
    .min(2, "Indiquez votre prénom.")
    .max(60, "Ce prénom est trop long."),
  lastName: z
    .string()
    .trim()
    .min(2, "Indiquez votre nom.")
    .max(60, "Ce nom est trop long."),
  phone: z
    .string()
    .trim()
    .min(8, "Indiquez un numéro de téléphone valide.")
    .max(20, "Ce numéro est trop long."),
  city: z.string().trim().min(2, "Indiquez votre ville.").max(60),
  district: z.string().trim().max(80).optional(),

  desiredDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choisissez une date.")
    .optional()
    .or(z.literal("")),

  note: z.string().trim().max(600, "Message trop long : 600 caractères maximum.").optional(),

  /**
   * Champ appât : invisible pour une personne, rempli par la plupart des robots.
   * S'il contient quoi que ce soit, la demande est ignorée sans message d'erreur.
   */
  website: z.string().max(0).optional(),
});

export type OrderRequestValues = z.infer<typeof orderRequestSchema>;

/** Réglages de commande en ligne, modifiés depuis Paramètres. */
export const onlineOrderingSchema = z.object({
  enabled: z.boolean(),
  showPrices: z.boolean(),
  allowedCategories: z.array(catalogCategorySchema).default([]),
  minDelayDays: z
    .number()
    .int("Indiquez un nombre de jours entier.")
    .min(0, "Le délai ne peut pas être négatif.")
    .max(180, "Un délai de plus de 180 jours découragerait vos clients."),
  requireDeposit: z.boolean(),
  depositPercent: z
    .number()
    .int()
    .min(0, "L'acompte ne peut pas être négatif.")
    .max(100, "Un acompte ne dépasse pas 100 % du montant."),
  acceptMeasurementsOnline: z.boolean(),
  welcomeMessage: z.string().trim().max(400, "Message trop long : 400 caractères maximum."),
  closedMessage: z.string().trim().max(400, "Message trop long : 400 caractères maximum."),
});

export type OnlineOrderingValues = z.infer<typeof onlineOrderingSchema>;

export const refuseOrderRequestSchema = z.object({
  requestId: z.string().min(1),
  reason: z
    .string()
    .trim()
    .min(3, "Indiquez brièvement pourquoi vous refusez : le client le lira peut-être.")
    .max(300),
});

export const acceptOrderRequestSchema = z.object({
  requestId: z.string().min(1),
  title: z.string().trim().min(1, "Donnez un titre à cette commande."),
  garmentType: z.string().trim().min(1),
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choisissez une date de livraison."),
  totalAmount: z
    .number()
    .int("Le montant doit être un nombre entier de FCFA.")
    .min(1, "Indiquez le montant convenu avec le client."),
});
