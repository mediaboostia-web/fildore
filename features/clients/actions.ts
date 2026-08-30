"use server";

import { revalidatePath } from "next/cache";
import { requireCan } from "@/lib/auth/session";
import { clientFormSchema } from "./schemas";
import { createClient, updateClient, archiveClient, findClientByPhone } from "@/lib/mock-data/clients";
import type { Client } from "./types";

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Vérifie le droit métier puis le payload Zod avant toute mutation (règle non
 * négociable #4 du cahier des charges). Les droits sont définis une seule fois
 * dans `features/auth/permissions.ts`.
 */
export async function createClientAction(
  formData: FormData
): Promise<ActionResult<{ id: string; client: Client }>> {
  const user = await requireCan("client:creer");

  const parsed = clientFormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    district: formData.get("district") ?? "",
    address: formData.get("address") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const duplicate = await findClientByPhone(parsed.data.phone);
  if (duplicate) {
    return {
      success: false,
      error: `Un client existe déjà avec ce numéro : ${duplicate.firstName} ${duplicate.lastName}.`,
    };
  }

  const client = await createClient({ workshopId: user.workshopId, ...parsed.data });
  revalidatePath("/clients");
  // On renvoie le client complet : l'appelant (wizard de commande) l'affiche
  // immédiatement au lieu d'en reconstruire une copie approximative côté client.
  return { success: true, data: { id: client.id, client } };
}

export async function updateClientAction(
  clientId: string,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  await requireCan("client:modifier");

  const parsed = clientFormSchema.partial().safeParse({
    firstName: formData.get("firstName") || undefined,
    lastName: formData.get("lastName") || undefined,
    phone: formData.get("phone") || undefined,
    city: formData.get("city") || undefined,
    district: formData.get("district") || undefined,
    address: formData.get("address") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const client = await updateClient(clientId, parsed.data);
  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
  return { success: true, data: { id: client.id } };
}

export async function archiveClientAction(clientId: string): Promise<ActionResult<{ id: string }>> {
  await requireCan("client:archiver");
  const client = await archiveClient(clientId);
  revalidatePath("/clients");
  return { success: true, data: { id: client.id } };
}
