"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/session";
import { logMessage } from "@/lib/mock-data/message-log";
import type { MessageTemplateKey } from "./types";
import type { ActionResult } from "@/features/clients/actions";

export interface LogMessageActionInput {
  clientId: string;
  orderId?: string;
  templateKey: MessageTemplateKey;
  resolvedBody: string;
}

/** Journalise un envoi WhatsApp après ouverture du lien côté client (le message reste modifiable avant envoi). */
export async function logMessageAction(input: LogMessageActionInput): Promise<ActionResult<{ id: string }>> {
  const user = await requireCurrentUser();
  const entry = await logMessage({
    workshopId: user.workshopId,
    clientId: input.clientId,
    orderId: input.orderId,
    templateKey: input.templateKey,
    resolvedBody: input.resolvedBody,
    sentByUserId: user.id,
  });
  revalidatePath(`/clients/${input.clientId}`);
  if (input.orderId) revalidatePath(`/commandes/${input.orderId}`);
  return { success: true, data: { id: entry.id } };
}
