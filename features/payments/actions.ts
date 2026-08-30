"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser, requireRole } from "@/lib/auth/session";
import { paymentFormSchema, paymentCancelSchema } from "./schemas";
import {
  recordPayment,
  cancelPayment,
  getPaymentById,
  getPaymentsByOrder,
} from "@/lib/mock-data/payments";
import { getOrderById } from "@/lib/mock-data/orders";
import { computeBalance } from "@/lib/money/balance";
import { sumConfirmedPayments } from "./types";
import type { ActionResult } from "@/features/clients/actions";

/** Annuler un encaissement touche la trésorerie : réservé au propriétaire. */
const PAYMENT_CANCEL_ROLES = ["owner"] as const;

export async function recordPaymentAction(input: unknown): Promise<ActionResult<{ id: string; receiptNumber: string }>> {
  const user = await requireCurrentUser();
  const parsed = paymentFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const order = await getOrderById(parsed.data.orderId);
  if (!order || order.workshopId !== user.workshopId) {
    return { success: false, error: "Commande introuvable." };
  }

  // Un encaissement ne peut pas dépasser le solde restant : le serveur recalcule
  // le solde à partir des paiements confirmés, il ne fait pas confiance au client.
  // Un remboursement, lui, va dans l'autre sens et n'est pas concerné.
  if (parsed.data.type !== "remboursement") {
    const paidAmount = sumConfirmedPayments(await getPaymentsByOrder(order.id));
    const balance = computeBalance(order.totalAmount, order.discountAmount, paidAmount);
    if (parsed.data.amount > balance) {
      return {
        success: false,
        fieldErrors: {
          amount: [
            balance > 0
              ? `Le solde restant n'est que de ${balance.toLocaleString("fr-FR")} FCFA.`
              : "Cette commande est déjà entièrement payée.",
          ],
        },
      };
    }
  }

  const payment = await recordPayment({
    workshopId: user.workshopId,
    ...parsed.data,
    recordedByUserId: user.id,
  });

  revalidatePath(`/commandes/${parsed.data.orderId}`);
  revalidatePath("/paiements");
  revalidatePath("/factures");
  revalidatePath("/tableau-de-bord");
  return { success: true, data: { id: payment.id, receiptNumber: payment.receiptNumber } };
}

/**
 * Annule un encaissement saisi par erreur. Le paiement n'est jamais supprimé :
 * il reste au journal avec son motif et son auteur, et le solde de la commande
 * se recalcule automatiquement (PROJECT_RULES.md §6 « Paiements »).
 */
export async function cancelPaymentAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireRole([...PAYMENT_CANCEL_ROLES]);
  const parsed = paymentCancelSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const payment = await getPaymentById(parsed.data.paymentId);
  if (!payment || payment.workshopId !== user.workshopId) {
    return { success: false, error: "Paiement introuvable." };
  }
  if (payment.status !== "confirme") {
    return { success: false, error: "Ce paiement a déjà été annulé." };
  }

  await cancelPayment(parsed.data.paymentId, parsed.data.reason, user.id);

  revalidatePath(`/commandes/${payment.orderId}`);
  revalidatePath("/paiements");
  revalidatePath("/factures");
  revalidatePath("/tableau-de-bord");
  return { success: true, data: { id: payment.id } };
}
