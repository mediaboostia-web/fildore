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
