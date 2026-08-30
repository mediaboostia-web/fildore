"use server";

import { revalidatePath } from "next/cache";
import { requireCan } from "@/lib/auth/session";
import {
  orderFormSchema,
  orderStatusUpdateSchema,
  orderCancelSchema,
  orderUpdateSchema,
} from "./schemas";
import {
  createOrder,
  updateOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderById,
} from "@/lib/mock-data/orders";
import { getProfileById, getProfilesByClient } from "@/lib/mock-data/measurement-profiles";
import { createDocument } from "@/lib/mock-data/documents";
import type { ActionResult } from "@/features/clients/actions";

export async function createOrderAction(input: unknown): Promise<ActionResult<{ id: string; reference: string }>> {
  const user = await requireCan("commande:creer");
  const parsed = orderFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let profile = await getProfileById(parsed.data.measurementProfileId);
  if (!profile) {
    const clientProfiles = await getProfilesByClient(parsed.data.clientId);
    profile =
      clientProfiles.find((p) => p.garmentType === parsed.data.garmentType) || clientProfiles[0];
  }
  if (!profile) {
    return { success: false, error: "Profil de mesures introuvable." };
  }

  const order = await createOrder({
    workshopId: user.workshopId,
    clientId: parsed.data.clientId,
    garmentType: parsed.data.garmentType,
    title: parsed.data.title,
    description: parsed.data.description,
    items: parsed.data.items,
    measurementProfile: profile,
    catalogItemId: parsed.data.catalogItemId,
    totalAmount: parsed.data.totalAmount,
    discountAmount: parsed.data.discountAmount,
    eventDate: parsed.data.eventDate,
    deliveryDate: parsed.data.deliveryDate,
    depositDueDate: parsed.data.depositDueDate,
    createdByUserId: user.id,
  });

  await createDocument({
    workshopId: user.workshopId,
    orderId: order.id,
    clientId: order.clientId,
    type: "facture",
    totalAmount: order.totalAmount,
    discountAmount: order.discountAmount,
    paidAmount: 0,
  });

  revalidatePath("/commandes");
  revalidatePath("/factures");
  return { success: true, data: { id: order.id, reference: order.reference } };
}

/**
 * Modification d'une commande existante.
 *
 * Passe obligatoirement par une Server Action : le formulaire d'édition écrivait
 * auparavant dans `getDb()` depuis le navigateur, ce qui touchait une copie
 * client du seed — la modification était silencieusement perdue au rechargement,
 * sans contrôle de session, de payload ni d'atelier.
 */
export async function updateOrderAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireCan("commande:modifier");
  const parsed = orderUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await getOrderById(parsed.data.orderId);
  if (!existing || existing.workshopId !== user.workshopId) {
    return { success: false, error: "Commande introuvable." };
  }
  if (existing.status === "annulee") {
    return { success: false, error: "Une commande annulée ne peut plus être modifiée." };
  }

  const order = await updateOrder(
    parsed.data.orderId,
    {
      title: parsed.data.title,
      garmentType: parsed.data.garmentType,
      description: parsed.data.description,
      priority: parsed.data.priority,
      totalAmount: parsed.data.totalAmount,
      discountAmount: parsed.data.discountAmount,
      eventDate: parsed.data.eventDate,
      deliveryDate: parsed.data.deliveryDate,
      depositDueDate: parsed.data.depositDueDate,
    },
    user.id
  );

  revalidatePath("/commandes");
  revalidatePath(`/commandes/${order.id}`);
  revalidatePath("/tableau-de-bord");
  return { success: true, data: { id: order.id } };
}

export async function updateOrderStatusAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireCan("commande:changer_statut");
  const parsed = orderStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const order = await updateOrderStatus(parsed.data.orderId, parsed.data.status, user.id, parsed.data.note);
  revalidatePath("/commandes");
  revalidatePath(`/commandes/${order.id}`);
  return { success: true, data: { id: order.id } };
}

/** Droit « commande:annuler » — même règle appliquée côté UI dans OrderActionsBar. */
export async function cancelOrderAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireCan("commande:annuler");
  const parsed = orderCancelSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const order = await cancelOrder(parsed.data.orderId, parsed.data.reason, user.id);
  revalidatePath("/commandes");
  revalidatePath(`/commandes/${order.id}`);
  return { success: true, data: { id: order.id } };
}
