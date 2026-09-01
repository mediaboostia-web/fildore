import { getDb, wait } from "./store";
import { generateId } from "./ids";
import type { CatalogItem, CatalogCategory } from "@/features/catalog/types";
import type { GarmentType } from "@/features/measurements/types";

export async function getCatalogItems(workshopId: string): Promise<CatalogItem[]> {
  await wait();
  return getDb().catalogItems.filter((c) => c.workshopId === workshopId && !c.isArchived);
}

export async function getCatalogItemById(id: string): Promise<CatalogItem | undefined> {
  await wait();
  return getDb().catalogItems.find((c) => c.id === id);
}

export interface CreateCatalogItemInput {
  workshopId: string;
  name: string;
  category: CatalogCategory;
  garmentType: GarmentType;
  description?: string;
  indicativePrice?: number;
  estimatedDelayDays?: number;
  imageUrl?: string;
  tags?: string[];
}

export async function createCatalogItem(input: CreateCatalogItemInput): Promise<CatalogItem> {
  await wait();
  const db = getDb();
  const item: CatalogItem = {
    id: generateId("catalog"),
    workshopId: input.workshopId,
    name: input.name,
    category: input.category,
    garmentType: input.garmentType,
    description: input.description,
    indicativePrice: input.indicativePrice,
    estimatedDelayDays: input.estimatedDelayDays,
    imageUrl: input.imageUrl,
    tags: input.tags ?? [],
    imageIds: [],
    isArchived: false,
    createdAt: new Date().toISOString(),
  };
  db.catalogItems.push(item);
  return item;
}

export type UpdateCatalogItemInput = Omit<CreateCatalogItemInput, "workshopId">;

/** Met à jour un modèle du catalogue. Les commandes déjà passées ne changent pas :
 *  elles portent leur propre titre, prix et snapshot de mesures. */
export async function updateCatalogItem(
  id: string,
  patch: UpdateCatalogItemInput
): Promise<CatalogItem> {
  await wait();
  const db = getDb();
  const item = db.catalogItems.find((c) => c.id === id);
  if (!item) throw new Error(`Modèle introuvable : ${id}`);

  item.name = patch.name;
  item.category = patch.category;
  item.garmentType = patch.garmentType;
  item.description = patch.description;
  item.indicativePrice = patch.indicativePrice;
  item.estimatedDelayDays = patch.estimatedDelayDays;
  if (patch.imageUrl !== undefined) item.imageUrl = patch.imageUrl;
  if (patch.tags) item.tags = patch.tags;
  return item;
}

export async function archiveCatalogItem(id: string): Promise<CatalogItem> {
  await wait();
  const db = getDb();
  const item = db.catalogItems.find((c) => c.id === id);
  if (!item) throw new Error(`Modèle introuvable : ${id}`);
  item.isArchived = true;
  return item;
}
