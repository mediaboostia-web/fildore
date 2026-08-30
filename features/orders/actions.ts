"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser, requireRole } from "@/lib/auth/session";
import { orderFormSchema, orderStatusUpdateSchema, orderCancelSchema } from "./schemas";
import { createOrder, updateOrderStatus, cancelOrder } from "@/lib/mock-data/orders";
import { getProfileById, getProfilesByClient } from "@/lib/mock-data/measurement-profiles";
import { createDocument } from "@/lib/mock-data/documents";
import type { ActionResult } from "@/features/clients/actions";

export async function createOrderAction(input: unknown): Promise<ActionResult<{ id: string; reference: string }>> {
  const user = await requireCurrentUser();
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

export async function updateOrderStatusAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireCurrentUser();
  const parsed = orderStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const order = await updateOrderStatus(parsed.data.orderId, parsed.data.status, user.id, parsed.data.note);
  revalidatePath("/commandes");
  revalidatePath(`/commandes/${order.id}`);
  return { success: true, data: { id: order.id } };
}

/** Annulation réservée aux propriétaires (voir la même règle côté UI dans OrderActionsBar). */
export async function cancelOrderAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireRole(["owner"]);
  const parsed = orderCancelSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const order = await cancelOrder(parsed.data.orderId, parsed.data.reason, user.id);
  revalidatePath("/commandes");
  revalidatePath(`/commandes/${order.id}`);
  return { success: true, data: { id: order.id } };
}
