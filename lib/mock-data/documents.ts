import { getDb, wait } from "./store";
import { generateId } from "./ids";
import { generateDocumentNumber } from "@/features/invoices/types";
import type { DocumentType, WorkshopDocument } from "@/features/invoices/types";
import { computeBalance } from "@/lib/money/balance";

export async function getDocuments(): Promise<WorkshopDocument[]> {
  await wait();
  return getDb().documents;
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
