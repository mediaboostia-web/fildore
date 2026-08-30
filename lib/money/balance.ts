import { assertInteger } from "./invariants";

/**
 * Point unique de calcul du solde — jamais recopié inline ailleurs
 * (fiche commande, fiche client, dashboard, reçu). Voir PROJECT_RULES.md §6 "Paiements".
 */
export function computeBalance(
  totalAmount: number,
  discountAmount: number,
  paidAmount: number
): number {
  assertInteger(totalAmount, "totalAmount");
  assertInteger(discountAmount, "discountAmount");
  assertInteger(paidAmount, "paidAmount");
  return totalAmount - discountAmount - paidAmount;
}

export function isFullyPaid(totalAmount: number, discountAmount: number, paidAmount: number): boolean {
  return computeBalance(totalAmount, discountAmount, paidAmount) <= 0;
}
