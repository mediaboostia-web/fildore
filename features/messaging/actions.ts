"use server";

import { revalidatePath } from "next/cache";
import { requireCan } from "@/lib/auth/session";
import { logMessage } from "@/lib/mock-data/message-log";
import { getClientById } from "@/lib/mock-data/clients";
import { getOrderById } from "@/lib/mock-data/orders";
import { logMessageSchema, type LogMessageInput } from "./schemas";
import type { ActionResult } from "@/features/clients/actions";

export type { LogMessageInput };

/**
 * Journalise un envoi WhatsApp après ouverture du lien (le message reste
 * modifiable par le couturier avant l'envoi réel).
 *
 * L'entrée est validée par Zod puis rattachée à l'atelier du demandeur : le
 * client et la commande cités doivent lui appartenir. Une action serveur reçoit
 * ce qui arrive sur le réseau, pas ce que le composant a bien voulu envoyer.
 */
export async function logMessageAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const user = await requireCan("message:envoyer");

  const parsed = logMessageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const client = await getClientById(parsed.data.clientId);
  if (!client || client.workshopId !== user.workshopId) {
    return { success: false, error: "Client introuvable." };
  }

  if (parsed.data.orderId) {
    const order = await getOrderById(parsed.data.orderId);
    if (!order || order.workshopId !== user.workshopId || order.clientId !== client.id) {
      return { success: false, error: "Commande introuvable pour ce client." };
    }
  }

  const entry = await logMessage({
    workshopId: user.workshopId,
    clientId: parsed.data.clientId,
    orderId: parsed.data.orderId,
    templateKey: parsed.data.templateKey,
    resolvedBody: parsed.data.resolvedBody,
    sentByUserId: user.id,
  });

  revalidatePath(`/clients/${parsed.data.clientId}`);
  if (parsed.data.orderId) revalidatePath(`/commandes/${parsed.data.orderId}`);
  return { success: true, data: { id: entry.id } };
}
