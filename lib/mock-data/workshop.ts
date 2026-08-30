import { getDb, wait } from "./store";
import type { Workshop } from "@/features/auth/types";

export async function getWorkshop(): Promise<Workshop> {
  await wait();
  return getDb().workshop;
}

export interface UpdateWorkshopInput {
  name: string;
  whatsappPhone: string;
  city: string;
  country: string;
}

/**
 * Met à jour les coordonnées de l'atelier. Elles apparaissent sur les reçus,
 * factures et messages WhatsApp : c'est une donnée métier, pas un réglage
 * d'affichage.
 */
export async function updateWorkshop(patch: UpdateWorkshopInput): Promise<Workshop> {
  await wait();
  const db = getDb();
  db.workshop = {
    ...db.workshop,
    name: patch.name,
    whatsappPhone: patch.whatsappPhone,
    city: patch.city,
    country: patch.country,
  };
  return db.workshop;
}
