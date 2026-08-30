"use server";

import { revalidatePath } from "next/cache";
import { requireCan } from "@/lib/auth/session";
import {
  orderRequestSchema,
  onlineOrderingSchema,
  acceptOrderRequestSchema,
  refuseOrderRequestSchema,
} from "./schemas";
import {
  countRecentRequestsByPhone,
  createOrderRequest,
  getOrderRequestById,
  markOrderRequestAccepted,
  markOrderRequestRefused,
} from "@/lib/mock-data/order-requests";
import { getWorkshop, getWorkshopBySlug, updateOnlineOrdering } from "@/lib/mock-data/workshop";
import { getCatalogItemById } from "@/lib/mock-data/catalog";
import { createClient, findClientByPhone } from "@/lib/mock-data/clients";
import { createMeasurementProfile, getProfilesByClient } from "@/lib/mock-data/measurement-profiles";
import { createOrder, getOrderById } from "@/lib/mock-data/orders";
import { addDaysIso, formatDateShortFr, todayIso } from "@/lib/utils/dates";
import type { GarmentType } from "@/features/measurements/types";
import type { ActionResult } from "@/features/clients/actions";

/** Plafond anti-abus : 3 demandes par numéro et par 24 h. */
const MAX_REQUESTS_PER_PHONE = 3;
const RATE_WINDOW_HOURS = 24;

/**
 * Dépôt d'une demande depuis la page publique — **aucune session**.
 *
 * Cette action est appelable directement, sans passer par notre formulaire :
 * elle revalide donc tout elle-même (atelier ouvert, modèle autorisé, délai
 * respecté), et refuse silencieusement les robots.
 *
 * Elle ne dit **jamais** si le numéro correspond déjà à un client : ce serait
 * confirmer à un inconnu qu'une personne est cliente de cet atelier
 * (PROJECT_RULES.md §7).
 */
export async function submitOrderRequestAction(
  input: unknown
): Promise<ActionResult<{ received: true }>> {
  const parsed = orderRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Champ appât rempli : un robot. On répond comme si tout allait bien plutôt
  // que de lui apprendre à le contourner — mais rien n'est enregistré.
  if (parsed.data.website) {
    return { success: true, data: { received: true } };
  }

  const workshop = await getWorkshopBySlug(parsed.data.workshopSlug);
  if (!workshop || !workshop.onlineOrdering.enabled) {
    return {
      success: false,
      error: "Cet atelier ne prend pas de commande en ligne pour le moment.",
    };
  }

  const settings = workshop.onlineOrdering;

  // Modèle : il doit appartenir à cet atelier, être en ligne et faire partie
  // des catégories que l'atelier a choisi de proposer.
  let catalogItemName: string | undefined;
  if (parsed.data.catalogItemId) {
    const item = await getCatalogItemById(parsed.data.catalogItemId);
    const isOffered =
      item &&
      item.workshopId === workshop.id &&
      !item.isArchived &&
      (settings.allowedCategories.length === 0 ||
        settings.allowedCategories.includes(item.category));

    if (!isOffered) {
      return { success: false, error: "Ce modèle n'est plus proposé. Choisissez-en un autre." };
    }
    catalogItemName = item!.name;
  }

  // Délai : la date souhaitée doit respecter le minimum fixé par l'atelier.
  const earliest = addDaysIso(todayIso(), settings.minDelayDays);
  if (parsed.data.desiredDate && parsed.data.desiredDate < earliest) {
    return {
      success: false,
      fieldErrors: {
        desiredDate: [
          `Cet atelier a besoin d'au moins ${settings.minDelayDays} jours. Choisissez une date à partir du ${formatDateShortFr(earliest)}.`,
        ],
      },
    };
  }

  const since = new Date(Date.now() - RATE_WINDOW_HOURS * 3600 * 1000).toISOString();
  const recentCount = await countRecentRequestsByPhone(parsed.data.phone, since);
  if (recentCount >= MAX_REQUESTS_PER_PHONE) {
    return {
      success: false,
      error:
        "Vous avez déjà envoyé plusieurs demandes aujourd'hui. L'atelier va vous répondre — contactez-le directement si c'est urgent.",
    };
  }

  await createOrderRequest({
    workshopId: workshop.id,
    catalogItemId: parsed.data.catalogItemId,
    catalogItemName,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    phone: parsed.data.phone,
    city: parsed.data.city,
    district: parsed.data.district || undefined,
    desiredDate: parsed.data.desiredDate || undefined,
    note: parsed.data.note || undefined,
  });

  revalidatePath("/demandes");
  revalidatePath("/tableau-de-bord");
  return { success: true, data: { received: true } };
}

/**
 * Accepte une demande : crée le client s'il est nouveau, puis la commande.
 *
 * **Idempotent.** Une demande déjà acceptée renvoie la commande existante au
 * lieu d'en créer une seconde — un double-clic sur un téléphone lent ne doit
 * pas produire deux commandes pour le même client.
 *
 * Le client n'est jamais dupliqué : si le numéro est déjà connu, la demande est
 * rattachée à la fiche existante.
 */
export async function acceptOrderRequestAction(
  input: unknown
): Promise<ActionResult<{ orderId: string; clientId: string }>> {
  const user = await requireCan("demande:traiter");
  const parsed = acceptOrderRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const request = await getOrderRequestById(parsed.data.requestId);
  if (!request || request.workshopId !== user.workshopId) {
    return { success: false, error: "Demande introuvable." };
  }

  if (request.status === "acceptee" && request.createdOrderId && request.createdClientId) {
    const existing = await getOrderById(request.createdOrderId);
    if (existing) {
      return {
        success: true,
        data: { orderId: existing.id, clientId: request.createdClientId },
      };
    }
  }

  if (request.status === "refusee") {
    return { success: false, error: "Cette demande a déjà été refusée." };
  }

  // Client existant reconnu au numéro normalisé, sinon création.
  const existingClient = await findClientByPhone(request.phone);
  const client =
    existingClient ??
    (await createClient({
      workshopId: user.workshopId,
      firstName: request.firstName,
      lastName: request.lastName,
      phone: request.phone,
      city: request.city,
      district: request.district ?? "",
      notes: "Client venu de la page publique de l'atelier.",
      tags: ["En ligne"],
    }));

  const garmentType = parsed.data.garmentType as GarmentType;

  // La commande a besoin d'un profil de mesures. Aucune mesure n'est inventée :
  // le profil créé ici est vide et porte un libellé qui dit ce qu'il reste à faire.
  const profiles = await getProfilesByClient(client.id);
  const profile =
    profiles.find((p) => p.garmentType === garmentType) ??
    profiles[0] ??
    (await createMeasurementProfile({
      clientId: client.id,
      workshopId: user.workshopId,
      label: "Mesures à prendre",
      garmentType,
      standardMeasurements: {},
      observations: "Commande reçue en ligne : mesures à prendre avec le client.",
      isPrimary: true,
    }));

  const order = await createOrder({
    workshopId: user.workshopId,
    clientId: client.id,
    garmentType,
    title: parsed.data.title,
    description: request.note,
    items: [
      {
        label: parsed.data.title,
        garmentType,
        quantity: 1,
        unitPrice: parsed.data.totalAmount,
      },
    ],
    measurementProfile: profile,
    catalogItemId: request.catalogItemId,
    totalAmount: parsed.data.totalAmount,
    discountAmount: 0,
    deliveryDate: parsed.data.deliveryDate,
    createdByUserId: user.id,
  });

  await markOrderRequestAccepted({
    requestId: request.id,
    reviewedByUserId: user.id,
    createdClientId: client.id,
    createdOrderId: order.id,
  });

  revalidatePath("/demandes");
  revalidatePath("/commandes");
  revalidatePath("/clients");
  revalidatePath("/tableau-de-bord");
  return { success: true, data: { orderId: order.id, clientId: client.id } };
}

/** Refuse une demande. Aucun client ni commande n'est créé. */
export async function refuseOrderRequestAction(
  input: unknown
): Promise<ActionResult<{ requestId: string }>> {
  const user = await requireCan("demande:traiter");
  const parsed = refuseOrderRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const request = await getOrderRequestById(parsed.data.requestId);
  if (!request || request.workshopId !== user.workshopId) {
    return { success: false, error: "Demande introuvable." };
  }
  if (request.status === "acceptee") {
    return {
      success: false,
      error: "Cette demande a déjà été acceptée : la commande existe.",
    };
  }

  await markOrderRequestRefused(request.id, parsed.data.reason, user.id);

  revalidatePath("/demandes");
  revalidatePath("/tableau-de-bord");
  return { success: true, data: { requestId: request.id } };
}

/** Règles de commande en ligne — c'est l'atelier qui décide de ce qu'il accepte. */
export async function updateOnlineOrderingAction(
  input: unknown
): Promise<ActionResult<{ enabled: boolean }>> {
  await requireCan("atelier:parametres");
  const parsed = onlineOrderingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const workshop = await updateOnlineOrdering(parsed.data);

  revalidatePath("/parametres");
  revalidatePath(`/atelier/${workshop.slug}`);
  return { success: true, data: { enabled: workshop.onlineOrdering.enabled } };
}

/** Lien public de la vitrine, affiché dans Paramètres pour être partagé. */
export async function getWorkshopPublicPathAction(): Promise<string> {
  await requireCan("atelier:parametres");
  const workshop = await getWorkshop();
  return `/atelier/${workshop.slug}`;
}
