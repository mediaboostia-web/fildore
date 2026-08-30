import { getDb, wait } from "./store";
import type { Workshop } from "@/features/auth/types";
import type { OnlineOrderingSettings } from "@/features/public-orders/types";

export async function getWorkshop(): Promise<Workshop> {
  await wait();
  return getDb().workshop;
}

/**
 * Lecture publique par identifiant d'URL. Renvoie `undefined` pour un slug
 * inconnu : la vitrine répond alors 404, sans révéler quels ateliers existent.
 */
export async function getWorkshopBySlug(slug: string): Promise<Workshop | undefined> {
  await wait();
  const workshop = getDb().workshop;
  return workshop.slug === slug ? workshop : undefined;
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

/**
 * Met à jour les règles de commande en ligne. Elles décident de ce que la page
 * publique accepte : c'est l'atelier qui les fixe, jamais Fildor à sa place.
 */
export async function updateOnlineOrdering(
  patch: OnlineOrderingSettings
): Promise<Workshop> {
  await wait();
  const db = getDb();
  db.workshop = { ...db.workshop, onlineOrdering: { ...patch } };
  return db.workshop;
}
