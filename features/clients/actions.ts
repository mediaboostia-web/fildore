"use server";

import { revalidatePath } from "next/cache";
import { requireCan } from "@/lib/auth/session";
import { clientFormSchema } from "./schemas";
import {
  createClient,
  updateClient,
  archiveClient,
  findClientByPhone,
  getClientById,
} from "@/lib/mock-data/clients";
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
  const user = await requireCan("client:modifier");

  // Même règle que pour l'archivage : le droit ne dit pas à qui appartient la
  // fiche. Sans ce contrôle, un identifiant suffirait à modifier le client d'un
  // autre atelier.
  const existing = await getClientById(clientId);
  if (!existing || existing.workshopId !== user.workshopId) {
    return { success: false, error: "Client introuvable." };
  }

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
  const user = await requireCan("client:archiver");

  // Le droit ne suffit pas : il faut aussi que la fiche appartienne à cet
  // atelier. Sans ce contrôle, un identifiant deviné suffirait à archiver le
  // client d'un autre atelier — RLS ne doit pas être la seule barrière.
  const existing = await getClientById(clientId);
  if (!existing || existing.workshopId !== user.workshopId) {
    return { success: false, error: "Client introuvable." };
  }

  const client = await archiveClient(clientId);
  revalidatePath("/clients");
  return { success: true, data: { id: client.id } };
}
