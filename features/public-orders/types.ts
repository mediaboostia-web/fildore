import type { CatalogCategory } from "@/features/catalog/types";

/**
 * Ce que l'atelier accepte de recevoir depuis sa page publique.
 *
 * Le principe : **c'est l'atelier qui fixe les règles**. Sans ces réglages, la
 * page publique produirait des demandes que le couturier ne peut pas honorer
 * (délai impossible, catégorie qu'il ne fait pas, tarif qu'il ne veut pas
 * afficher), et il finirait par la désactiver.
 */
export interface OnlineOrderingSettings {
  /** Interrupteur principal. Fermé, la vitrine affiche `closedMessage`. */
  enabled: boolean;
  /** Afficher les prix indicatifs du catalogue aux visiteurs. */
  showPrices: boolean;
  /** Catégories proposées. Vide = tout le catalogue non archivé. */
  allowedCategories: CatalogCategory[];
  /** Délai minimum entre aujourd'hui et la date souhaitée, en jours. */
  minDelayDays: number;
  /** Annoncer qu'un acompte est demandé avant lancement de la production. */
  requireDeposit: boolean;
  /** Part de l'acompte annoncée au visiteur, en pourcentage (0–100). */
  depositPercent: number;
  /** Le visiteur peut-il indiquer ses mesures, ou l'atelier le rappelle-t-il ? */
  acceptMeasurementsOnline: boolean;
  welcomeMessage: string;
  closedMessage: string;
}

export const DEFAULT_ONLINE_ORDERING: OnlineOrderingSettings = {
  enabled: false,
  showPrices: true,
  allowedCategories: [],
  minDelayDays: 7,
  requireDeposit: true,
  depositPercent: 50,
  acceptMeasurementsOnline: false,
  welcomeMessage:
    "Choisissez un modèle et envoyez-nous votre demande. Nous vous rappelons pour confirmer les mesures, le tissu et le délai.",
  closedMessage:
    "Nous ne prenons pas de commande en ligne pour le moment. Contactez-nous directement, nous serons ravis de vous répondre.",
};

export type OrderRequestStatus = "nouvelle" | "acceptee" | "refusee";

export const ORDER_REQUEST_STATUS_LABELS: Record<OrderRequestStatus, string> = {
  nouvelle: "À traiter",
  acceptee: "Acceptée",
  refusee: "Refusée",
};

/**
 * Demande envoyée depuis la page publique par un visiteur non connecté.
 *
 * Ce n'est **pas** une commande : tant que l'atelier ne l'a pas acceptée, elle
 * ne crée ni client, ni commande, ni chiffre d'affaires. Une demande de test ou
 * un doublon ne pollue donc jamais le fichier client.
 */
export interface OrderRequest {
  id: string;
  workshopId: string;
  status: OrderRequestStatus;

  /** Modèle choisi dans la vitrine, s'il y en a un. */
  catalogItemId?: string;
  catalogItemName?: string;

  firstName: string;
  lastName: string;
  /** Donnée sensible (PROJECT_RULES.md §7) : jamais dans une URL ni un log. */
  phone: string;
  city: string;
  district?: string;
  desiredDate?: string;
  note?: string;

  submittedAt: string;
  reviewedAt?: string;
  reviewedByUserId?: string;
  refusalReason?: string;
  /** Renseignés à l'acceptation — garantissent qu'on ne recrée rien deux fois. */
  createdClientId?: string;
  createdOrderId?: string;
}

/** Nom affiché d'un demandeur. */
export function requestDisplayName(request: Pick<OrderRequest, "firstName" | "lastName">): string {
  return `${request.firstName} ${request.lastName}`.trim();
}

/** Acompte annoncé au visiteur pour un prix indicatif donné. */
export function computeAnnouncedDeposit(
  indicativePrice: number | undefined,
  settings: OnlineOrderingSettings
): number | undefined {
  if (!settings.requireDeposit || !indicativePrice || indicativePrice <= 0) return undefined;
  return Math.round((indicativePrice * settings.depositPercent) / 100);
}
