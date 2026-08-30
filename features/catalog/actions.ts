"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/session";
import { catalogItemFormSchema } from "./schemas";
import { createCatalogItem, archiveCatalogItem } from "@/lib/mock-data/catalog";
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

export async function archiveCatalogItemAction(itemId: string): Promise<ActionResult<{ id: string }>> {
  await requireCurrentUser();
  const item = await archiveCatalogItem(itemId);
  revalidatePath("/modeles");
  return { success: true, data: { id: item.id } };
}
