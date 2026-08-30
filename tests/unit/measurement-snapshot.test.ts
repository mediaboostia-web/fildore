import { describe, expect, it } from "vitest";
import { toMeasurementSnapshot } from "@/features/measurements/types";
import type { MeasurementProfile } from "@/features/measurements/types";

function makeProfile(overrides: Partial<MeasurementProfile> = {}): MeasurementProfile {
  return {
    id: "profile-1",
    clientId: "client-1",
    workshopId: "workshop-1",
    label: "Mesures robe",
    garmentType: "robe",
    isPrimary: true,
    standardMeasurements: { "Tour de poitrine": 94, "Tour de taille": 76 },
    customMeasurements: [{ label: "Longueur souhaitée", valueCm: 130 }],
    takenAt: "2026-08-01",
    createdAt: "2026-08-01",
    updatedAt: "2026-08-01",
    ...overrides,
  };
}

describe("toMeasurementSnapshot", () => {
  it("copie les champs du profil dans le snapshot", () => {
    const profile = makeProfile();
    const snapshot = toMeasurementSnapshot(profile);

    expect(snapshot.profileId).toBe(profile.id);
    expect(snapshot.label).toBe(profile.label);
    expect(snapshot.garmentType).toBe(profile.garmentType);
    expect(snapshot.standardMeasurements).toEqual(profile.standardMeasurements);
    expect(snapshot.customMeasurements).toEqual(profile.customMeasurements);
  });

  it("produit une copie profonde : modifier le profil après coup ne change pas le snapshot déjà pris", () => {
    const profile = makeProfile();
    const snapshot = toMeasurementSnapshot(profile);

    // Une commande existante ne doit jamais refléter une modification ultérieure du profil.
    profile.standardMeasurements["Tour de poitrine"] = 999;
    profile.customMeasurements[0].valueCm = 999;
    profile.customMeasurements.push({ label: "Nouvelle mesure", valueCm: 42 });

    expect(snapshot.standardMeasurements["Tour de poitrine"]).toBe(94);
    expect(snapshot.customMeasurements[0].valueCm).toBe(130);
    expect(snapshot.customMeasurements).toHaveLength(1);
  });

  it("horodate le snapshot au moment de la prise", () => {
    const before = Date.now();
    const snapshot = toMeasurementSnapshot(makeProfile());
    const snapshotTime = new Date(snapshot.snapshotAt).getTime();

    expect(snapshotTime).toBeGreaterThanOrEqual(before);
    expect(snapshotTime).toBeLessThanOrEqual(Date.now());
  });
});
