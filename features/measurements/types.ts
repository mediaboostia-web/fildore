export type GarmentType =
  | "robe"
  | "boubou"
  | "costume"
  | "chemise"
  | "pantalon"
  | "enfant"
  | "uniforme"
  | "autre";

export interface CustomMeasurement {
  label: string;
  valueCm: number;
}

export interface MeasurementProfile {
  id: string;
  clientId: string;
  workshopId: string;
  label: string;
  garmentType: GarmentType;
  isPrimary: boolean;
  standardMeasurements: Record<string, number>; // cm, entiers
  customMeasurements: CustomMeasurement[];
  observations?: string;
  takenAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Copie profonde et immuable, figée dans la commande au moment de sa validation.
 * Ne jamais relire un profil "en live" pour afficher une commande existante —
 * une modification ultérieure du profil ne doit jamais réécrire l'historique.
 */
export interface MeasurementSnapshot {
  profileId: string | null; // traçabilité seulement
  label: string;
  garmentType: GarmentType;
  standardMeasurements: Record<string, number>;
  customMeasurements: CustomMeasurement[];
  snapshotAt: string;
}

export function toMeasurementSnapshot(profile: MeasurementProfile): MeasurementSnapshot {
  return {
    profileId: profile.id,
    label: profile.label,
    garmentType: profile.garmentType,
    standardMeasurements: { ...profile.standardMeasurements },
    customMeasurements: profile.customMeasurements.map((m) => ({ ...m })),
    snapshotAt: new Date().toISOString(),
  };
}
