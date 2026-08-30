import { getDb, wait } from "./store";
import { generateId } from "./ids";
import { normalizePhoneBenin } from "@/lib/utils/phone";
import type { OrderRequest } from "@/features/public-orders/types";

export async function getOrderRequests(workshopId: string): Promise<OrderRequest[]> {
  await wait();
  return getDb()
    .orderRequests.filter((request) => request.workshopId === workshopId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function getOrderRequestById(id: string): Promise<OrderRequest | undefined> {
  await wait();
  return getDb().orderRequests.find((request) => request.id === id);
}

export interface CreateOrderRequestInput {
  workshopId: string;
  catalogItemId?: string;
  catalogItemName?: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  district?: string;
  desiredDate?: string;
  note?: string;
}

/**
 * Enregistre une demande venue de la page publique.
 *
 * Le téléphone est normalisé ici, comme à la création d'un client : c'est ce
 * qui permettra, à l'acceptation, de reconnaître un client déjà connu au lieu
 * d'en créer un second.
 */
export async function createOrderRequest(input: CreateOrderRequestInput): Promise<OrderRequest> {
  await wait();
  const db = getDb();
  const request: OrderRequest = {
    id: generateId("demande"),
    workshopId: input.workshopId,
    status: "nouvelle",
    catalogItemId: input.catalogItemId,
    catalogItemName: input.catalogItemName,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: normalizePhoneBenin(input.phone),
    city: input.city,
    district: input.district,
    desiredDate: input.desiredDate,
    note: input.note,
    submittedAt: new Date().toISOString(),
  };
  db.orderRequests.push(request);
  return request;
}

/**
 * Nombre de demandes envoyées depuis ce numéro sur une fenêtre glissante.
 *
 * L'action publique n'a pas de session : sans ce garde-fou, un script pourrait
 * remplir la boîte de l'atelier. Un plafond par numéro suffit ici et sera
 * remplacé par une limitation côté base au branchement de Supabase.
 */
export async function countRecentRequestsByPhone(
  phone: string,
  sinceIso: string
): Promise<number> {
  await wait();
  const normalized = normalizePhoneBenin(phone);
  return getDb().orderRequests.filter(
    (request) => request.phone === normalized && request.submittedAt >= sinceIso
  ).length;
}

export interface AcceptOrderRequestInput {
  requestId: string;
  reviewedByUserId: string;
  createdClientId: string;
  createdOrderId: string;
}

/**
 * Marque une demande comme acceptée en gardant la trace du client et de la
 * commande créés. C'est cette trace qui rend l'acceptation **idempotente** :
 * un second clic ne recrée ni client ni commande.
 */
export async function markOrderRequestAccepted(
  input: AcceptOrderRequestInput
): Promise<OrderRequest> {
  await wait();
  const request = getDb().orderRequests.find((r) => r.id === input.requestId);
  if (!request) throw new Error(`Demande introuvable : ${input.requestId}`);

  request.status = "acceptee";
  request.reviewedAt = new Date().toISOString();
  request.reviewedByUserId = input.reviewedByUserId;
  request.createdClientId = input.createdClientId;
  request.createdOrderId = input.createdOrderId;
  return request;
}

/** Refuse une demande. Rien n'est créé : ni client, ni commande. */
export async function markOrderRequestRefused(
  requestId: string,
  reason: string,
  reviewedByUserId: string
): Promise<OrderRequest> {
  await wait();
  const request = getDb().orderRequests.find((r) => r.id === requestId);
  if (!request) throw new Error(`Demande introuvable : ${requestId}`);

  request.status = "refusee";
  request.reviewedAt = new Date().toISOString();
  request.reviewedByUserId = reviewedByUserId;
  request.refusalReason = reason;
  return request;
}
