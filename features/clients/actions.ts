"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/session";
import { clientFormSchema } from "./schemas";
import { createClient, updateClient, archiveClient, findClientByPhone } from "@/lib/mock-data/clients";

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Vérifie session + payload Zod avant toute mutation (règle non négociable #4
 * du cahier des charges). Le contrôle de rôle fin par membre d'équipe arrive
 * en V1 (cahier des charges §7.2) — pour l'instant, tout utilisateur
 * authentifié de l'atelier peut gérer les clients.
 */
export async function createClientAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const user = await requireCurrentUser();

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
  return { success: true, data: { id: client.id } };
}

export async function updateClientAction(
  clientId: string,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  await requireCurrentUser();

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
  await requireCurrentUser();
  const client = await archiveClient(clientId);
  revalidatePath("/clients");
  return { success: true, data: { id: client.id } };
}
