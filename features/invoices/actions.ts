"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth/session";
import { createDocument } from "@/lib/mock-data/documents";
import { getOrderById } from "@/lib/mock-data/orders";
import { getPaidAmountForOrder } from "@/lib/mock-data/payments";
import type { ActionResult } from "@/features/clients/actions";

const generateDocumentSchema = z.object({
  orderId: z.string().min(1),
  type: z.enum(["devis", "bon_commande", "recu_acompte", "facture", "recu_paiement", "bon_livraison"]),
});

export async function generateDocumentAction(
  input: unknown
): Promise<ActionResult<{ id: string; number: string }>> {
  const user = await requireCurrentUser();
  const parsed = generateDocumentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const order = await getOrderById(parsed.data.orderId);
  if (!order) {
    return { success: false, error: "Commande introuvable." };
  }

  // Le solde affiché sur le document est toujours recalculé côté serveur au
  // moment de la génération, jamais recopié depuis une valeur client.
  const paidAmount = await getPaidAmountForOrder(order.id);

  const document = await createDocument({
    workshopId: user.workshopId,
    orderId: order.id,
    clientId: order.clientId,
    type: parsed.data.type,
    totalAmount: order.totalAmount,
    discountAmount: order.discountAmount,
    paidAmount,
  });

  revalidatePath(`/commandes/${order.id}`);
  revalidatePath("/factures");
  return { success: true, data: { id: document.id, number: document.number } };
}
