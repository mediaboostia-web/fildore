"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/session";
import { catalogItemFormSchema, catalogItemUpdateSchema } from "./schemas";
import {
  createCatalogItem,
  updateCatalogItem,
  archiveCatalogItem,
  getCatalogItemById,
} from "@/lib/mock-data/catalog";
import type { ActionResult } from "@/features/clients/actions";

export async function createCatalogItemAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireCurrentUser();
  const parsed = catalogItemFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const item = await createCatalogItem({ workshopId: user.workshopId, ...parsed.data });
  revalidatePath("/modeles");
  return { success: true, data: { id: item.id } };
}

/**
 * Modifie un modèle du catalogue. Les commandes déjà créées à partir de ce
 * modèle ne bougent pas : elles portent leur propre titre, leur propre prix et
 * leur snapshot de mesures.
 */
export async function updateCatalogItemAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireCurrentUser();
  const parsed = catalogItemUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { itemId, ...patch } = parsed.data;
  const existing = await getCatalogItemById(itemId);
  if (!existing || existing.workshopId !== user.workshopId) {
    return { success: false, error: "Modèle introuvable." };
  }

  const item = await updateCatalogItem(itemId, patch);
  revalidatePath("/modeles");
  revalidatePath(`/modeles/${item.id}`);
  return { success: true, data: { id: item.id } };
}

export async function archiveCatalogItemAction(itemId: string): Promise<ActionResult<{ id: string }>> {
  const user = await requireCurrentUser();

  const existing = await getCatalogItemById(itemId);
  if (!existing || existing.workshopId !== user.workshopId) {
    return { success: false, error: "Modèle introuvable." };
  }

  const item = await archiveCatalogItem(itemId);
  revalidatePath("/modeles");
  revalidatePath(`/modeles/${item.id}`);
  return { success: true, data: { id: item.id } };
}
