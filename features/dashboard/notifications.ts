import { computeBalance } from "@/lib/money/balance";
import { getOrderComputedFlags } from "@/features/orders/selectors";
import { clientDisplayName } from "@/features/clients/types";
import { daysBetween } from "@/lib/utils/dates";
import type { Order } from "@/features/orders/types";
import type { Client } from "@/features/clients/types";

export type WorkshopNotificationTone = "danger" | "warning" | "info";

export interface WorkshopNotification {
  id: string;
  tone: WorkshopNotificationTone;
  /** Nature de l'alerte, utilisée pour choisir l'icône. */
  kind: "livraison" | "paiement";
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
  today: string
): WorkshopNotification[] {
  const clientById = new Map(clients.map((client) => [client.id, client]));
  const notifications: WorkshopNotification[] = [];

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
        description: `${clientName} — solde de ${balance.toLocaleString("fr-FR")} FCFA sur ${order.reference}`,
        timing: order.depositDueDate ? timingLabel(order.depositDueDate, today) : "Échu",
        href,
      });
    }
  }

  // Le plus urgent d'abord : retards de paiement et de livraison, puis le reste.
  const toneRank: Record<WorkshopNotificationTone, number> = { danger: 0, warning: 1, info: 2 };
  return notifications
    .sort((a, b) => toneRank[a.tone] - toneRank[b.tone])
    .slice(0, MAX_NOTIFICATIONS);
}
