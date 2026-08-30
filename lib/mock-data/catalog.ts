import { getDb, wait } from "./store";
import { generateId } from "./ids";
import type { CatalogItem, CatalogCategory } from "@/features/catalog/types";
import type { GarmentType } from "@/features/measurements/types";

export async function getCatalogItems(): Promise<CatalogItem[]> {
  await wait();
  return getDb().catalogItems.filter((c) => !c.isArchived);
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
    tags: input.tags ?? [],
    imageIds: [],
    isArchived: false,
    createdAt: new Date().toISOString(),
  };
  db.catalogItems.push(item);
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
