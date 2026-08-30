import type { GarmentType } from "./types";

export const GARMENT_TYPE_LABELS: Record<GarmentType, string> = {
  robe: "Robe",
  boubou: "Boubou",
  costume: "Costume",
  chemise: "Chemise",
  pantalon: "Pantalon",
  enfant: "Tenue enfant",
  uniforme: "Uniforme",
  autre: "Autre",
};

/**
 * Le cahier des charges ne donne qu'une liste d'exemple générique de champs de
 * mesures, sans mapping strict par type de vêtement. Cette base est une
 * proposition raisonnable et adaptable — elle n'est pas figée par une source
 * externe et peut être ajustée avec les ateliers pilotes.
 */
const BASE_FIELDS = ["Tour de poitrine", "Tour de taille", "Tour de hanches", "Carrure"] as const;

export const MEASUREMENT_FIELDS_BY_GARMENT_TYPE: Record<GarmentType, string[]> = {
  robe: [...BASE_FIELDS, "Longueur robe", "Longueur manche", "Longueur buste"],
  boubou: [...BASE_FIELDS, "Longueur boubou", "Longueur manche"],
  costume: [...BASE_FIELDS, "Longueur veste", "Longueur manche", "Longueur pantalon"],
  chemise: ["Tour de poitrine", "Tour de cou", "Carrure", "Longueur chemise", "Longueur manche"],
  pantalon: ["Tour de taille", "Tour de hanches", "Tour de cuisse", "Longueur pantalon"],
  enfant: ["Tour de poitrine", "Tour de taille", "Tour de hanches", "Longueur"],
  uniforme: [...BASE_FIELDS, "Longueur", "Longueur manche"],
  autre: [...BASE_FIELDS],
};
