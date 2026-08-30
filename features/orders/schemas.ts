import { z } from "zod";
import { amountSchema, isoDateSchema } from "@/lib/validations/common";
import { garmentTypeSchema } from "@/features/measurements/schemas";

export const orderItemFormSchema = z.object({
  label: z.string().trim().min(1, "Le libellé de la ligne est obligatoire."),
  garmentType: garmentTypeSchema,
  quantity: z.number().int().min(1),
  unitPrice: amountSchema,
});

export const orderFormBaseSchema = z.object({
  clientId: z.string().min(1, "Sélectionnez un client."),
  garmentType: garmentTypeSchema,
  title: z.string().trim().min(1, "Le titre de la commande est obligatoire."),
  description: z.string().trim().optional(),
  items: z.array(orderItemFormSchema).min(1, "Ajoutez au moins une ligne de prestation."),
  measurementProfileId: z.string().min(1, "Sélectionnez un profil de mesures."),
  /** Modèle du catalogue à l'origine de la commande, quand elle en vient d'un. */
  catalogItemId: z.string().optional(),
  totalAmount: amountSchema,
  discountAmount: amountSchema,
  eventDate: isoDateSchema.optional(),
  deliveryDate: isoDateSchema,
  depositDueDate: isoDateSchema.optional(),
});

/** Une remise supérieure au total produirait un solde négatif : refusé à la source. */
export const orderFormSchema = orderFormBaseSchema.refine(
  (data) => data.discountAmount <= data.totalAmount,
  { message: "La remise ne peut pas dépasser le montant total.", path: ["discountAmount"] }
);

export type OrderFormValues = z.infer<typeof orderFormBaseSchema>;

/**
 * Modification d'une commande existante. Le client, le profil de mesures et le
 * snapshot ne sont volontairement PAS modifiables ici : un snapshot figé ne se
 * réécrit jamais (PROJECT_RULES.md §6 « Clients et mesures »).
 */
export const orderUpdateSchema = z
  .object({
    orderId: z.string().min(1),
    title: z.string().trim().min(1, "Le titre de la commande est obligatoire."),
    garmentType: garmentTypeSchema,
    description: z.string().trim().optional(),
    priority: z.enum(["normale", "urgente"]),
    totalAmount: amountSchema,
    discountAmount: amountSchema,
    eventDate: isoDateSchema.optional(),
    deliveryDate: isoDateSchema,
    depositDueDate: isoDateSchema.optional(),
  })
  .refine((data) => data.discountAmount <= data.totalAmount, {
    message: "La remise ne peut pas dépasser le montant total.",
    path: ["discountAmount"],
  });

export type OrderUpdateValues = z.infer<typeof orderUpdateSchema>;

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
