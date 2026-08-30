"use server";

import { requireCurrentUser } from "@/lib/auth/session";
import { getClientById } from "@/lib/mock-data/clients";
import { getProfileById, getProfilesByClient } from "@/lib/mock-data/measurement-profiles";
import { getCatalogItemById } from "@/lib/mock-data/catalog";
import type { GarmentType, MeasurementProfile } from "@/features/measurements/types";
import type { Client } from "@/features/clients/types";
import type { CatalogItem } from "@/features/catalog/types";

/**
 * Lectures du wizard de commande exposées en Server Actions.
 *
 * Le wizard est un Client Component (brouillon en sessionStorage), mais il ne
 * doit JAMAIS importer `lib/mock-data/*` directement : ces modules lisent le
 * singleton `globalThis.__FILDOR_DB__`, qui n'existe que côté serveur. Un
 * import navigateur en crée une copie fraîche issue du seed — donc
 * (1) un client ou un profil créé pendant la session reste invisible dans le
 * wizard, et (2) tout le jeu de données (téléphones, adresses, mesures
 * corporelles de tous les clients) part dans le bundle JS. Voir PROJECT_RULES.md
 * §7 « Données sensibles ».
 *
 * Chaque lecture revalide la session et l'appartenance à l'atelier : les Server
 * Actions ne passent pas par les matchers de `proxy.ts`.
 */

/** Profil de mesures allégé — le wizard n'affiche que le libellé, le type et un aperçu. */
export interface WizardMeasurementProfile {
  id: string;
  label: string;
  garmentType: GarmentType;
  isPrimary: boolean;
  standardMeasurements: Record<string, number>;
}

function toWizardProfile(profile: MeasurementProfile): WizardMeasurementProfile {
  return {
    id: profile.id,
    label: profile.label,
    garmentType: profile.garmentType,
    isPrimary: profile.isPrimary,
    standardMeasurements: { ...profile.standardMeasurements },
  };
}

/** Client allégé — uniquement ce que le récapitulatif du wizard affiche. */
export interface WizardClient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  district: string;
}

function toWizardClient(client: Client): WizardClient {
  return {
    id: client.id,
    firstName: client.firstName,
    lastName: client.lastName,
    phone: client.phone,
    city: client.city,
    district: client.district,
  };
}

/** Modèle du catalogue allégé, pour préremplir une commande depuis une fiche modèle. */
export interface WizardCatalogItem {
  id: string;
  name: string;
  garmentType: GarmentType;
  description?: string;
  indicativePrice?: number;
  estimatedDelayDays?: number;
}

function toWizardCatalogItem(item: CatalogItem): WizardCatalogItem {
  return {
    id: item.id,
    name: item.name,
    garmentType: item.garmentType,
    description: item.description,
    indicativePrice: item.indicativePrice,
    estimatedDelayDays: item.estimatedDelayDays,
  };
}

/** Étape 3 : profils de mesures du client sélectionné, limités à l'atelier courant. */
export async function getWizardProfilesAction(
  clientId: string
): Promise<WizardMeasurementProfile[]> {
  const user = await requireCurrentUser();
  const client = await getClientById(clientId);
  if (!client || client.workshopId !== user.workshopId) return [];

  const profiles = await getProfilesByClient(clientId);
  return profiles
    .filter((profile) => profile.workshopId === user.workshopId)
    .map(toWizardProfile);
}

/** Étape 5 : récapitulatif client + profil retenu, limités à l'atelier courant. */
export async function getWizardSummaryAction(input: {
  clientId: string;
  measurementProfileId?: string;
}): Promise<{ client: WizardClient | null; profile: WizardMeasurementProfile | null }> {
  const user = await requireCurrentUser();

  const client = await getClientById(input.clientId);
  if (!client || client.workshopId !== user.workshopId) {
    return { client: null, profile: null };
  }

  if (!input.measurementProfileId) {
    return { client: toWizardClient(client), profile: null };
  }

  const profile = await getProfileById(input.measurementProfileId);
  const belongsToClient =
    profile && profile.workshopId === user.workshopId && profile.clientId === client.id;

  return {
    client: toWizardClient(client),
    profile: belongsToClient ? toWizardProfile(profile) : null,
  };
}

/** Étape 2 : modèle du catalogue préselectionné via `?modele=<id>` depuis une fiche modèle. */
export async function getWizardCatalogItemAction(
  catalogItemId: string
): Promise<WizardCatalogItem | null> {
  const user = await requireCurrentUser();
  const item = await getCatalogItemById(catalogItemId);
  if (!item || item.workshopId !== user.workshopId || item.isArchived) return null;
  return toWizardCatalogItem(item);
}
