import type { GarmentType } from "@/features/measurements/types";

export type CatalogCategory =
  | "robe"
  | "boubou_femme"
  | "boubou_homme"
  | "costume"
  | "chemise"
  | "ensemble"
  | "mariage"
  | "ceremonie"
  | "enfant"
  | "uniforme"
  | "accessoire"
  | "autre";

export const CATALOG_CATEGORY_LABELS: Record<CatalogCategory, string> = {
  robe: "Robe",
  boubou_femme: "Boubou femme",
  boubou_homme: "Boubou homme",
  costume: "Costume",
  chemise: "Chemise",
  ensemble: "Ensemble",
  mariage: "Mariage",
  ceremonie: "Cérémonie",
  enfant: "Enfant",
  uniforme: "Uniforme",
  accessoire: "Accessoire",
  autre: "Autre",
};

export interface CatalogItem {
  id: string;
  workshopId: string;
  name: string;
  category: CatalogCategory;
  garmentType: GarmentType;
  description?: string;
  indicativePrice?: number; // entier XOF, facultatif ("sur devis" si absent)
  estimatedDelayDays?: number;
  tags: string[];
  imageIds: string[]; // référence vers des placeholders locaux
  imageUrl?: string; // photo du modèle
  isArchived: boolean;
  createdAt: string;
}
