"use server";

import { revalidatePath } from "next/cache";
import { requireCan } from "@/lib/auth/session";
import { measurementProfileFormSchema, measurementProfileUpdateSchema } from "./schemas";
import {
  createMeasurementProfile,
  updateMeasurementProfile,
  duplicateMeasurementProfile,
  getProfileById,
} from "@/lib/mock-data/measurement-profiles";
import type { ActionResult } from "@/features/clients/actions";

export async function createMeasurementProfileAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const user = await requireCan("mesures:enregistrer");
  const parsed = measurementProfileFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const profile = await createMeasurementProfile({ workshopId: user.workshopId, ...parsed.data });
  revalidatePath(`/clients/${parsed.data.clientId}`);
  return { success: true, data: { id: profile.id } };
}

/**
 * Corrige un profil de mesures existant.
 *
 * Les commandes déjà créées gardent leurs mesures : elles portent un snapshot
 * figé, jamais une lecture en direct du profil. Corriger une mesure sert aux
 * prochaines commandes, sans jamais réécrire l'historique.
 */
export async function updateMeasurementProfileAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const user = await requireCan("mesures:corriger");
  const parsed = measurementProfileUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await getProfileById(parsed.data.profileId);
  if (!existing || existing.workshopId !== user.workshopId) {
    return { success: false, error: "Profil de mesures introuvable." };
  }

  const profile = await updateMeasurementProfile(parsed.data.profileId, {
    label: parsed.data.label,
    standardMeasurements: parsed.data.standardMeasurements,
    customMeasurements: parsed.data.customMeasurements,
    observations: parsed.data.observations,
  });

  revalidatePath(`/clients/${existing.clientId}`);
  revalidatePath(`/clients/${existing.clientId}/mesures/${profile.id}`);
  return { success: true, data: { id: profile.id } };
}

export async function duplicateMeasurementProfileAction(
  profileId: string,
  newLabel: string,
  clientId: string
): Promise<ActionResult<{ id: string }>> {
  await requireCan("mesures:enregistrer");
  const duplicate = await duplicateMeasurementProfile(profileId, newLabel);
  revalidatePath(`/clients/${clientId}`);
  return { success: true, data: { id: duplicate.id } };
}
