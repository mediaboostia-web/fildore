import { computeBalance } from "@/lib/money/balance";
import { formatAmount } from "@/lib/money/format";
import { getOrderComputedFlags } from "@/features/orders/selectors";
import { clientDisplayName } from "@/features/clients/types";
import { daysBetween } from "@/lib/utils/dates";
import type { Order } from "@/features/orders/types";
import type { Client } from "@/features/clients/types";
import type { OrderRequest } from "@/features/public-orders/types";
import { requestDisplayName } from "@/features/public-orders/types";

export type WorkshopNotificationTone = "danger" | "warning" | "info";

export interface WorkshopNotification {
  id: string;
  tone: WorkshopNotificationTone;
  /** Nature de l'alerte, utilisée pour choisir l'icône. */
  kind: "livraison" | "paiement" | "demande";
  title: string;
  description: string;
  timing: string;
  href: string;
}

/** Nombre maximum d'alertes affichées dans le panneau — au-delà, on renvoie vers la liste. */
export const MAX_NOTIFICATIONS = 8;

function timingLabel(deliveryDate: string, today: string): string {
  const delta = daysBetween(today, deliveryDate);
  if (delta < -1) return `En retard de ${Math.abs(delta)} jours`;
  if (delta === -1) return "En retard d'un jour";
  if (delta === 0) return "Aujourd'hui";
  if (delta === 1) return "Demain";
  return `Dans ${delta} jours`;
}

/** Une demande ne peut pas être « en retard » : elle a été reçue, on dit quand. */
function receivedLabel(submittedDate: string, today: string): string {
  const delta = daysBetween(submittedDate, today);
  if (delta <= 0) return "Reçue aujourd'hui";
  if (delta === 1) return "Reçue hier";
  return `Reçue il y a ${delta} jours`;
}

/**
 * Construit les alertes réelles de l'atelier à partir des commandes.
 *
 * Fonction pure : `today` et les montants encaissés sont injectés, jamais lus
 * d'une horloge ou d'une base ici — c'est ce qui la rend testable et ce qui
 * garantit que le panneau de notifications affiche les mêmes chiffres que le
 * tableau de bord et la liste des commandes (mêmes sélecteurs).
 */
export function buildWorkshopNotifications(
  orders: Order[],
  clients: Client[],
  paidAmountByOrderId: Map<string, number>,
  today: string,
  /** Demandes reçues en ligne. Optionnel : les tests d'origine n'en passent pas. */
  orderRequests: OrderRequest[] = []
): WorkshopNotification[] {
  const clientById = new Map(clients.map((client) => [client.id, client]));
  const notifications: WorkshopNotification[] = [];

  // Une demande en ligne attend une réponse : c'est un client qui a écrit et
  // qui patiente, elle passe donc devant les livraisons proches.
  for (const request of orderRequests) {
    if (request.status !== "nouvelle") continue;
    notifications.push({
      id: `demande-${request.id}`,
      tone: "warning",
      kind: "demande",
      title: "Nouvelle demande en ligne",
      description: `${requestDisplayName(request)} — ${
        request.catalogItemName ?? "tenue décrite dans le message"
      }`,
      timing: receivedLabel(request.submittedAt.slice(0, 10), today),
      href: `/demandes/${request.id}`,
    });
  }

  for (const order of orders) {
    const paidAmount = paidAmountByOrderId.get(order.id) ?? 0;
    const flags = getOrderComputedFlags(order, today, paidAmount);
    const client = clientById.get(order.clientId);
    const clientName = client ? clientDisplayName(client) : "Client";
    const href = `/commandes/${order.id}`;

    if (flags.isOverdue || flags.isDueToday || flags.isDueSoon) {
      notifications.push({
        id: `livraison-${order.id}`,
        tone: flags.isOverdue ? "danger" : flags.isDueToday ? "warning" : "info",
        kind: "livraison",
        title: flags.isOverdue
          ? "Livraison en retard"
          : flags.isDueToday
            ? "À livrer aujourd'hui"
            : "Livraison proche",
        description: `${order.title} — ${clientName} (${order.reference})`,
        timing: timingLabel(order.deliveryDate, today),
        href,
      });
    }

    if (flags.isPaymentOverdue) {
      const balance = computeBalance(order.totalAmount, order.discountAmount, paidAmount);
      notifications.push({
        id: `paiement-${order.id}`,
        tone: "danger",
        kind: "paiement",
        title: "Acompte en retard",
        // `formatAmount` et pas `toLocaleString` : le formateur du projet remplace
        // l'espace insécable d'Intl par une espace normale, sans quoi le montant
        // se copie mal vers WhatsApp (voir lib/money/format.ts).
        description: `${clientName} — solde de ${formatAmount(balance)} sur ${order.reference}`,
        timing: order.depositDueDate ? timingLabel(order.depositDueDate, today) : "Échu",
        href,
      });
    }
  }

  // Le plus urgent d'abord : retards de paiement et de livraison, puis le reste.
  // À gravité égale, une demande en ligne passe devant : quelqu'un attend une
  // réponse, alors qu'une livraison proche est déjà planifiée.
  const toneRank: Record<WorkshopNotificationTone, number> = { danger: 0, warning: 1, info: 2 };
  const kindRank: Record<WorkshopNotification["kind"], number> = {
    demande: 0,
    paiement: 1,
    livraison: 2,
  };
  return notifications
    .sort((a, b) => toneRank[a.tone] - toneRank[b.tone] || kindRank[a.kind] - kindRank[b.kind])
    .slice(0, MAX_NOTIFICATIONS);
}
