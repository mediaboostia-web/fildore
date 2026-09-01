import { nanoid } from "nanoid";
import { getDb, wait } from "./store";
import { generateId } from "./ids";
import { generateDocumentNumber } from "@/features/invoices/types";
import type { DocumentType, WorkshopDocument } from "@/features/invoices/types";
import { computeBalance } from "@/lib/money/balance";

/**
 * Longueur du jeton de partage. 32 caractères de l'alphabet nanoid (~190 bits)
 * : un lien de document ne doit pas pouvoir être deviné en le tapant au hasard,
 * puisqu'il s'ouvre sans connexion (PROJECT_RULES.md §6).
 */
const SHARE_TOKEN_LENGTH = 32;

export async function getDocuments(workshopId: string): Promise<WorkshopDocument[]> {
  await wait();
  return getDb().documents.filter((d) => d.workshopId === workshopId);
}

export async function getDocumentsByOrder(orderId: string): Promise<WorkshopDocument[]> {
  await wait();
  return getDb().documents.filter((d) => d.orderId === orderId);
}

export async function getDocumentById(id: string): Promise<WorkshopDocument | undefined> {
  await wait();
  return getDb().documents.find((d) => d.id === id);
}

export interface CreateDocumentInput {
  workshopId: string;
  orderId: string;
  clientId: string;
  type: DocumentType;
  totalAmount: number;
  discountAmount: number;
  paidAmount: number;
  paymentId?: string;
}

export async function createDocument(input: CreateDocumentInput): Promise<WorkshopDocument> {
  await wait();
  const db = getDb();
  db.sequences.documentByType[input.type] += 1;
  const document: WorkshopDocument = {
    id: generateId("doc"),
    workshopId: input.workshopId,
    orderId: input.orderId,
    clientId: input.clientId,
    type: input.type,
    number: generateDocumentNumber(input.type, new Date().getFullYear(), db.sequences.documentByType[input.type]),
    totalAmount: input.totalAmount,
    discountAmount: input.discountAmount,
    paidAmount: input.paidAmount,
    balanceAmount: computeBalance(input.totalAmount, input.discountAmount, input.paidAmount),
    issuedAt: new Date().toISOString(),
    paymentId: input.paymentId,
  };
  db.documents.push(document);
  return document;
}

/**
 * Crée (ou renouvelle) le lien public d'un document.
 *
 * Renouveler change le jeton : l'ancien lien cesse aussitôt de fonctionner.
 * C'est voulu — c'est le geste « j'ai envoyé le lien à la mauvaise personne ».
 */
export async function createShareToken(documentId: string): Promise<WorkshopDocument> {
  await wait();
  const document = getDb().documents.find((d) => d.id === documentId);
  if (!document) throw new Error(`Document introuvable : ${documentId}`);

  document.shareToken = nanoid(SHARE_TOKEN_LENGTH);
  document.shareCreatedAt = new Date().toISOString();
  document.shareRevokedAt = undefined;
  return document;
}

/** Désactive le lien public. Le document, lui, n'est jamais supprimé. */
export async function revokeShareToken(documentId: string): Promise<WorkshopDocument> {
  await wait();
  const document = getDb().documents.find((d) => d.id === documentId);
  if (!document) throw new Error(`Document introuvable : ${documentId}`);

  document.shareRevokedAt = new Date().toISOString();
  return document;
}

/**
 * Lecture publique par jeton. Renvoie `undefined` pour un jeton inconnu **comme**
 * pour un jeton révoqué : la page publique ne doit pas laisser deviner qu'un
 * document a existé à cette adresse.
 */
export async function getDocumentByShareToken(
  token: string
): Promise<WorkshopDocument | undefined> {
  await wait();
  if (!token) return undefined;
  return getDb().documents.find((d) => d.shareToken === token && !d.shareRevokedAt);
}
