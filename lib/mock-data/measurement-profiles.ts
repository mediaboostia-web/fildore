import { getDb, wait } from "./store";
import { generateId } from "./ids";
import type { GarmentType, MeasurementProfile, CustomMeasurement } from "@/features/measurements/types";

export async function getProfilesByClient(clientId: string): Promise<MeasurementProfile[]> {
  await wait();
  return getDb().measurementProfiles.filter((p) => p.clientId === clientId);
}

export async function getProfileById(id: string): Promise<MeasurementProfile | undefined> {
  await wait();
  return getDb().measurementProfiles.find((p) => p.id === id);
}

export interface CreateMeasurementProfileInput {
  clientId: string;
  workshopId: string;
  label: string;
  garmentType: GarmentType;
  standardMeasurements: Record<string, number>;
  customMeasurements?: CustomMeasurement[];
  observations?: string;
  isPrimary?: boolean;
}

export async function createMeasurementProfile(
  input: CreateMeasurementProfileInput
): Promise<MeasurementProfile> {
  await wait();
  const db = getDb();
  const now = new Date().toISOString();
  const profile: MeasurementProfile = {
    id: generateId("profile"),
    clientId: input.clientId,
    workshopId: input.workshopId,
    label: input.label,
    garmentType: input.garmentType,
    isPrimary: input.isPrimary ?? false,
    standardMeasurements: input.standardMeasurements,
    customMeasurements: input.customMeasurements ?? [],
    observations: input.observations,
    takenAt: now,
    createdAt: now,
    updatedAt: now,
  };
  db.measurementProfiles.push(profile);
  return profile;
}

export interface UpdateMeasurementProfileInput {
  label: string;
  standardMeasurements: Record<string, number>;
  customMeasurements?: CustomMeasurement[];
  observations?: string;
}

/**
 * Corrige un profil de mesures — une erreur de saisie sur un tour de poitrine
 * doit pouvoir être rattrapée.
 *
 * Le type de vêtement n'est pas modifiable : il détermine les champs de mesures,
 * en changer reviendrait à créer un autre profil (utiliser la duplication).
 *
 * Point capital : les commandes déjà passées ne bougent pas. Elles portent un
 * snapshot figé (`toMeasurementSnapshot`), jamais une lecture en direct du
 * profil — corriger les mesures d'un client ne réécrit donc aucun historique
 * (PROJECT_RULES.md §6 « Clients et mesures »).
 */
export async function updateMeasurementProfile(
  id: string,
  patch: UpdateMeasurementProfileInput
): Promise<MeasurementProfile> {
  await wait();
  const db = getDb();
  const profile = db.measurementProfiles.find((p) => p.id === id);
  if (!profile) throw new Error(`Profil de mesures introuvable : ${id}`);

  const now = new Date().toISOString();
  profile.label = patch.label;
  profile.standardMeasurements = { ...patch.standardMeasurements };
  profile.customMeasurements = (patch.customMeasurements ?? []).map((m) => ({ ...m }));
  profile.observations = patch.observations;
  // `takenAt` suit la correction : c'est la date des mesures réellement valides.
  profile.takenAt = now;
  profile.updatedAt = now;
  return profile;
}

export async function duplicateMeasurementProfile(id: string, newLabel: string): Promise<MeasurementProfile> {
  await wait();
  const db = getDb();
  const source = db.measurementProfiles.find((p) => p.id === id);
  if (!source) throw new Error(`Profil de mesures introuvable : ${id}`);
  const now = new Date().toISOString();
  const duplicate: MeasurementProfile = {
    ...source,
    id: generateId("profile"),
    label: newLabel,
    isPrimary: false,
    standardMeasurements: { ...source.standardMeasurements },
    customMeasurements: source.customMeasurements.map((m) => ({ ...m })),
    takenAt: now,
    createdAt: now,
    updatedAt: now,
  };
  db.measurementProfiles.push(duplicate);
  return duplicate;
}
