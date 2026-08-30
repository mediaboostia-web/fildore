import type { OrderComputedFlags, OrderStatus } from "./types";

/**
 * Filtres rapides de la liste des commandes. Définis une seule fois pour que
 * les puces affichées, les compteurs et le filtrage serveur ne puissent pas
 * diverger — une puce « En retard (3) » qui renvoie 5 lignes détruit la
 * confiance dans toute la liste.
 */
export const ORDER_LIST_FILTERS = [
  { key: "all", label: "Toutes" },
  { key: "in_progress", label: "En cours" },
  { key: "awaiting_deposit", label: "Acompte attendu" },
  { key: "due_soon", label: "À livrer bientôt" },
  { key: "overdue", label: "En retard" },
  { key: "completed", label: "Livrées / Terminées" },
] as const;

export type OrderListFilterKey = (typeof ORDER_LIST_FILTERS)[number]["key"];

export const ORDER_LIST_FILTER_KEYS: readonly string[] = ORDER_LIST_FILTERS.map((f) => f.key);

/** Statuts entre la confirmation et la livraison : la commande est à l'atelier. */
const IN_PROGRESS_STATUSES: readonly OrderStatus[] = [
  "confirmee",
  "mesures_a_prendre",
  "tissu_fournitures",
  "coupe",
  "couture",
  "essayage",
  "retouche",
  "prete",
];

const COMPLETED_STATUSES: readonly OrderStatus[] = ["livree", "terminee"];

export interface OrderFilterSubject {
  status: OrderStatus;
  balance: number;
  flags: OrderComputedFlags;
}

export function matchesOrderFilter(subject: OrderFilterSubject, filterKey: string): boolean {
  switch (filterKey) {
    case "in_progress":
      return IN_PROGRESS_STATUSES.includes(subject.status);
    case "awaiting_deposit":
      return (
        subject.status === "acompte_attendu" ||
        (subject.balance > 0 && subject.status === "brouillon")
      );
    case "due_soon":
      return subject.flags.isDueSoon || subject.flags.isDueToday;
    case "overdue":
      return subject.flags.isOverdue || subject.flags.isPaymentOverdue;
    case "completed":
      return COMPLETED_STATUSES.includes(subject.status);
    default:
      return true;
  }
}

/** Ramène une valeur d'URL inconnue à « all » plutôt que d'afficher une liste vide inexplicable. */
export function normalizeOrderFilter(raw: string | undefined): OrderListFilterKey {
  const value = raw?.trim() ?? "";
  return (ORDER_LIST_FILTER_KEYS.includes(value) ? value : "all") as OrderListFilterKey;
}
