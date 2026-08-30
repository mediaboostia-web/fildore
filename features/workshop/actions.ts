"use server";

import { revalidatePath } from "next/cache";
import { requireCan } from "@/lib/auth/session";
import { updateWorkshop } from "@/lib/mock-data/workshop";
import { createUser, findUserByEmail } from "@/lib/mock-data/users";
import { workshopSettingsSchema, inviteMemberSchema } from "./schemas";
import type { ActionResult } from "@/features/clients/actions";

/**
 * Coordonnées de l'atelier et gestion d'équipe. Le contrôle serveur est le seul
 * qui compte — les Server Actions ne passent pas par `proxy.ts`. L'interface
 * masque les mêmes actions via `RoleGate`, à partir des mêmes droits.
 */
export async function updateWorkshopAction(input: unknown): Promise<ActionResult<{ name: string }>> {
  await requireCan("atelier:parametres");

  const parsed = workshopSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const workshop = await updateWorkshop(parsed.data);

  // Le nom et le numéro de l'atelier apparaissent sur les documents et dans les
  // messages WhatsApp : on rafraîchit les vues qui les affichent.
  revalidatePath("/parametres");
  revalidatePath("/factures");
  revalidatePath("/messages");
  return { success: true, data: { name: workshop.name } };
}

export async function inviteMemberAction(
  input: unknown
): Promise<ActionResult<{ id: string; fullName: string }>> {
  const currentUser = await requireCan("equipe:gerer");

  const parsed = inviteMemberSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await findUserByEmail(parsed.data.email);
  if (existing) {
    return {
      success: false,
      fieldErrors: { email: ["Un membre utilise déjà cette adresse e-mail."] },
    };
  }

  const member = await createUser({
    workshopId: currentUser.workshopId,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    role: parsed.data.role,
  });

  revalidatePath("/parametres");
  return { success: true, data: { id: member.id, fullName: member.fullName } };
}
