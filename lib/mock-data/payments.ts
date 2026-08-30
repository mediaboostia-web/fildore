import { getDb, wait } from "./store";
import { generateId } from "./ids";
import { generateDocumentNumber } from "@/features/invoices/types";
import { sumConfirmedPayments } from "@/features/payments/types";
import type { Payment, PaymentMethod, PaymentType } from "@/features/payments/types";

export async function getPayments(): Promise<Payment[]> {
  await wait();
  return getDb().payments;
}

export async function getPaymentsByOrder(orderId: string): Promise<Payment[]> {
  await wait();
  return getDb().payments.filter((p) => p.orderId === orderId);
}

export async function getPaidAmountForOrder(orderId: string): Promise<number> {
  const payments = await getPaymentsByOrder(orderId);
  return sumConfirmedPayments(payments);
}

export async function getPaymentsByClient(clientId: string): Promise<Payment[]> {
  await wait();
  return getDb().payments.filter((p) => p.clientId === clientId);
}

export interface RecordPaymentInput {
  workshopId: string;
  orderId: string;
  clientId: string;
  type: PaymentType;
  method: PaymentMethod;
  amount: number;
  reference?: string;
  proofUrl?: string;
  note?: string;
  recordedByUserId: string;
}

export async function recordPayment(input: RecordPaymentInput): Promise<Payment> {
  await wait();
  const db = getDb();
  db.sequences.documentByType.recu_paiement += 1;
  const payment: Payment = {
    id: generateId("payment"),
    workshopId: input.workshopId,
    orderId: input.orderId,
    clientId: input.clientId,
    type: input.type,
    method: input.method,
    amount: input.amount,
    reference: input.reference,
    proofUrl: input.proofUrl,
    note: input.note,
    status: "confirme",
    receiptNumber: generateDocumentNumber("recu_paiement", new Date().getFullYear(), db.sequences.documentByType.recu_paiement),
    recordedByUserId: input.recordedByUserId,
    createdAt: new Date().toISOString(),
  };
  db.payments.push(payment);

  // Émission automatique du reçu dans les documents consultables et imprimables
  db.documents.push({
    id: generateId("doc"),
    workshopId: input.workshopId,
    orderId: input.orderId,
    clientId: input.clientId,
    type: "recu_paiement",
    number: payment.receiptNumber,
    totalAmount: input.amount,
    discountAmount: 0,
    paidAmount: input.amount,
    balanceAmount: 0,
    issuedAt: payment.createdAt,
    paymentId: payment.id,
  });

  return payment;
}

export async function getPaymentById(paymentId: string): Promise<Payment | undefined> {
  await wait();
  return getDb().payments.find((p) => p.id === paymentId);
}

/**
 * Annule un paiement sans jamais le supprimer : la ligne reste au journal avec
 * son motif et son auteur, et le reçu déjà émis reste consultable — un document
 * remis au client ne disparaît pas de l'historique (PROJECT_RULES.md §6).
 * Le montant cesse simplement de compter dans le solde via `sumConfirmedPayments`.
 */
export async function cancelPayment(
  paymentId: string,
  reason: string,
  byUserId: string
): Promise<Payment> {
  await wait();
  const db = getDb();
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) throw new Error(`Paiement introuvable : ${paymentId}`);
  payment.status = "annule";
  payment.cancelledAt = new Date().toISOString();
  payment.cancelledByUserId = byUserId;
  payment.cancellationReason = reason;
  return payment;
}
