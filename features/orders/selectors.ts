import { computeBalance } from "@/lib/money/balance";
import { isPast, isSameDay, isWithinNextDays } from "@/lib/utils/dates";
import type { Order, OrderComputedFlags, OrderStatus } from "./types";

const TERMINAL_STATUSES: OrderStatus[] = ["livree", "terminee", "annulee"];
const DUE_SOON_WINDOW_DAYS = 3;

/**
 * Seul point de calcul des indicateurs "en retard / à livrer aujourd'hui ou
 * bientôt / solde en retard" — jamais recopié inline dans un composant.
 * `today` est toujours injecté (jamais `new Date()` en dur) pour rester testable.
 */
export function getOrderComputedFlags(
  order: Order,
  today: string,
  paidAmount: number
): OrderComputedFlags {
  const isTerminal = TERMINAL_STATUSES.includes(order.status);
  const isOverdue = !isTerminal && isPast(order.deliveryDate, today);
  const isDueToday = !isTerminal && isSameDay(order.deliveryDate, today);
  const isDueSoon =
    !isTerminal &&
    !isDueToday &&
    !isOverdue &&
    isWithinNextDays(order.deliveryDate, today, DUE_SOON_WINDOW_DAYS);

  const balance = computeBalance(order.totalAmount, order.discountAmount, paidAmount);
  const isPaymentOverdue =
    !isTerminal &&
    balance > 0 &&
    order.depositDueDate !== undefined &&
    isPast(order.depositDueDate, today);

  return { isOverdue, isDueToday, isDueSoon, isPaymentOverdue };
}

export function generateOrderReference(workshopCode: string, sequenceNumber: number): string {
  const padded = String(sequenceNumber).padStart(6, "0");
  return `FIL-${workshopCode}-${padded}`;
}
