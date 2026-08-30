"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireCan } from "@/lib/auth/session";
import {
  createDocument,
  createShareToken,
  getDocumentById,
  getDocumentsByOrder,
  revokeShareToken,
} from "@/lib/mock-data/documents";
import { getOrderById } from "@/lib/mock-data/orders";
import { getPaidAmountForOrder } from "@/lib/mock-data/payments";
import {
  MANUAL_DOCUMENT_TYPES,
  SINGLE_ISSUE_DOCUMENT_TYPES,
  buildShareLinkPath,
} from "./types";
import type { ActionResult } from "@/features/clients/actions";

const generateDocumentSchema = z.object({
  orderId: z.string().min(1),
  type: z.enum(MANUAL_DOCUMENT_TYPES),
});

export async function generateDocumentAction(
  input: unknown
): Promise<ActionResult<{ id: string; number: string }>> {
  const user = await requireCan("document:generer");
  const parsed = generateDocumentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const order = await getOrderById(parsed.data.orderId);
  if (!order || order.workshopId !== user.workshopId) {
    return { success: false, error: "Commande introuvable." };
  }

  if (SINGLE_ISSUE_DOCUMENT_TYPES.includes(parsed.data.type)) {
    const existing = await getDocumentsByOrder(order.id);
    const alreadyIssued = existing.find((document) => document.type === parsed.data.type);
    if (alreadyIssued) {
      return {
        success: false,
        error: `La facture ${alreadyIssued.number} a déjà été émise pour cette commande.`,
      };
    }
  }

  // Le solde inscrit sur le document est toujours recalculé côté serveur au
  // moment de la génération, jamais recopié depuis une valeur venue du navigateur.
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

const documentIdSchema = z.object({ documentId: z.string().min(1) });

/**
 * Crée le lien public d'un document, à envoyer au client par WhatsApp.
 *
 * Jusqu'ici, « Partager » copiait l'adresse du tableau de bord
 * (`/factures/doc_…`) : le client cliquait et tombait sur l'écran de connexion.
 * Le lien renvoyé ici s'ouvre sans compte et ne donne accès qu'à CE document.
 */
export async function createDocumentShareLinkAction(
  input: unknown
): Promise<ActionResult<{ path: string }>> {
  const user = await requireCan("document:generer");
  const parsed = documentIdSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Document introuvable." };
  }

  const document = await getDocumentById(parsed.data.documentId);
  if (!document || document.workshopId !== user.workshopId) {
    return { success: false, error: "Document introuvable." };
  }

  const updated = await createShareToken(document.id);
  revalidatePath(`/factures/${document.id}`);
  return { success: true, data: { path: buildShareLinkPath(updated.shareToken!) } };
}

/** Désactive le lien public. Le document reste dans l'atelier, seul l'accès est coupé. */
export async function revokeDocumentShareLinkAction(
  input: unknown
): Promise<ActionResult<{ documentId: string }>> {
  const user = await requireCan("document:generer");
  const parsed = documentIdSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Document introuvable." };
  }

  const document = await getDocumentById(parsed.data.documentId);
  if (!document || document.workshopId !== user.workshopId) {
    return { success: false, error: "Document introuvable." };
  }

  await revokeShareToken(document.id);
  revalidatePath(`/factures/${document.id}`);
  return { success: true, data: { documentId: document.id } };
}

