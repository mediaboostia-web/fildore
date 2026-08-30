import { z } from "zod";
import { amountSchema } from "@/lib/validations/common";

export const paymentMethodSchema = z.enum([
  "especes",
  "mtn_momo",
  "moov_money",
  "orange_money",
  "wave",
  "virement",
  "carte",
  "paiement_livraison",
  "autre",
]);

export const paymentFormSchema = z.object({
  orderId: z.string().min(1),
  clientId: z.string().min(1),
  type: z.enum(["acompte", "partiel", "final", "remboursement"]),
  method: paymentMethodSchema,
  amount: amountSchema.refine((v) => v > 0, "Le montant doit être supérieur à zéro."),
  reference: z.string().trim().optional(),
  proofUrl: z.string().trim().optional(),
  note: z.string().trim().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

/** Un paiement annulé garde son motif : c'est ce qui rend l'annulation traçable. */
export const paymentCancelSchema = z.object({
  paymentId: z.string().min(1),
  reason: z.string().trim().min(1, "Indiquez le motif de l'annulation."),
});

export type PaymentCancelValues = z.infer<typeof paymentCancelSchema>;
