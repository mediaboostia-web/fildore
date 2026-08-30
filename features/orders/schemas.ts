import { z } from "zod";
import { amountSchema, isoDateSchema } from "@/lib/validations/common";
import { garmentTypeSchema } from "@/features/measurements/schemas";

export const orderItemFormSchema = z.object({
  label: z.string().trim().min(1, "Le libellé de la ligne est obligatoire."),
  garmentType: garmentTypeSchema,
  quantity: z.number().int().min(1),
  unitPrice: amountSchema,
});

export const orderFormSchema = z.object({
  clientId: z.string().min(1, "Sélectionnez un client."),
  garmentType: garmentTypeSchema,
  title: z.string().trim().min(1, "Le titre de la commande est obligatoire."),
  description: z.string().trim().optional(),
  items: z.array(orderItemFormSchema).min(1, "Ajoutez au moins une ligne de prestation."),
  measurementProfileId: z.string().min(1, "Sélectionnez un profil de mesures."),
  totalAmount: amountSchema,
  discountAmount: amountSchema,
  eventDate: isoDateSchema.optional(),
  deliveryDate: isoDateSchema,
  depositDueDate: isoDateSchema.optional(),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export const orderStatusUpdateSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "brouillon",
    "a_confirmer",
    "acompte_attendu",
    "confirmee",
    "mesures_a_prendre",
    "tissu_fournitures",
    "coupe",
    "couture",
    "essayage",
    "retouche",
    "prete",
    "livree",
    "terminee",
    "suspendue",
    "annulee",
  ]),
  note: z.string().trim().optional(),
});

export const orderCancelSchema = z.object({
  orderId: z.string().min(1),
  reason: z.string().trim().min(1, "Indiquez un motif d'annulation."),
});
