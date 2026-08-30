import { computeBalance } from "@/lib/money/balance";
import { sumConfirmedPayments } from "@/features/payments/types";
import { isShareLinkActive, buildShareLinkPath } from "@/features/invoices/types";
import type { Client } from "@/features/clients/types";
import type { Order } from "@/features/orders/types";
import type { Payment } from "@/features/payments/types";
import type { WorkshopDocument } from "@/features/invoices/types";
import type { MessagingClient, MessagingOrder } from "./types";

/**
 * Construction des données de la messagerie, **côté serveur uniquement**.
 *
 * Deux raisons de passer par ici plutôt que d'envoyer les entités brutes :
 * 1. Ne sortir que les champs affichés (pas d'adresse, pas de note interne, pas
 *    de mesures corporelles dans le bundle du navigateur).
 * 2. Calculer les montants au bon endroit. L'écran annonçait `totalAmount` dans
 *    la variable `{solde}` : un client ayant déjà versé un acompte recevait une
 *    relance pour la somme entière.
 */

export function toMessagingClient(client: Client): MessagingClient {
  return {
    id: client.id,
    firstName: client.firstName,
    lastName: client.lastName,
    phone: client.phone,
  };
}

export function toMessagingOrder(
  order: Order,
  payments: Payment[],
  documents: WorkshopDocument[]
): MessagingOrder {
  const orderPayments = payments.filter((payment) => payment.orderId === order.id);
  const paidAmount = sumConfirmedPayments(orderPayments);

  // Le premier versement confirmé de type « acompte » — le montant réellement
  // encaissé, jamais une moitié de total calculée au passage.
  const deposit = orderPayments
    .filter((payment) => payment.status === "confirme" && payment.type === "acompte")
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];

  // Dernier document de cette commande dont le lien public est actif.
  const sharedDocument = documents
    .filter((doc) => doc.orderId === order.id && isShareLinkActive(doc))
    .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())[0];

  return {
    id: order.id,
    clientId: order.clientId,
    reference: order.reference,
    title: order.title,
    deliveryDate: order.deliveryDate,
    eventDate: order.eventDate,
    totalAmount: order.totalAmount,
    paidAmount,
    balance: computeBalance(order.totalAmount, order.discountAmount, paidAmount),
    recordedDepositAmount: deposit?.amount,
    documentSharePath: sharedDocument ? buildShareLinkPath(sharedDocument.shareToken!) : undefined,
  };
}
