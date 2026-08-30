"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/session";
import { measurementProfileFormSchema } from "./schemas";
import { createMeasurementProfile, duplicateMeasurementProfile } from "@/lib/mock-data/measurement-profiles";
import type { ActionResult } from "@/features/clients/actions";

export async function createMeasurementProfileAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const user = await requireCurrentUser();
  const parsed = measurementProfileFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const profile = await createMeasurementProfile({ workshopId: user.workshopId, ...parsed.data });
  revalidatePath(`/clients/${parsed.data.clientId}`);
  return { success: true, data: { id: profile.id } };
}

export async function duplicateMeasurementProfileAction(
  profileId: string,
  newLabel: string,
  clientId: string
): Promise<ActionResult<{ id: string }>> {
  await requireCurrentUser();
  const duplicate = await duplicateMeasurementProfile(profileId, newLabel);
  revalidatePath(`/clients/${clientId}`);
  return { success: true, data: { id: duplicate.id } };
}
