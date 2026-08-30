export type DocumentType = "devis" | "bon_commande" | "recu_acompte" | "facture" | "recu_paiement" | "bon_livraison";

export const DOCUMENT_TYPE_PREFIX: Record<DocumentType, string> = {
  devis: "DEV",
  bon_commande: "BC",
  recu_acompte: "REC",
  facture: "FAC",
  recu_paiement: "REC",
  bon_livraison: "BL",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  devis: "Devis",
  bon_commande: "Bon de commande",
  recu_acompte: "Reçu d'acompte",
  facture: "Facture",
  recu_paiement: "Reçu de paiement",
  bon_livraison: "Bon de livraison",
};

/**
 * Documents que le couturier crée lui-même depuis une commande.
 * Le reçu de paiement n'y figure pas : il est émis automatiquement à chaque
 * encaissement, et un reçu sans paiement correspondant n'aurait aucun sens.
 */
export const MANUAL_DOCUMENT_TYPES = [
  "devis",
  "bon_commande",
  "recu_acompte",
  "facture",
  "bon_livraison",
] as const;

export type ManualDocumentType = (typeof MANUAL_DOCUMENT_TYPES)[number];

/** Une facture engage l'atelier : une seule par commande, et elle ne se réécrit pas. */
export const SINGLE_ISSUE_DOCUMENT_TYPES: readonly DocumentType[] = ["facture"];

export interface WorkshopDocument {
  id: string;
  workshopId: string;
  orderId: string;
  clientId: string;
  type: DocumentType;
  number: string; // FAC-2026-000001
  totalAmount: number;
  discountAmount: number;
  paidAmount: number;
  balanceAmount: number;
  issuedAt: string;
  paymentId?: string; // pour un reçu de paiement

  /**
   * Lien public partagé au client. Jeton à haute entropie, limité à CE
   * document, révocable (PROJECT_RULES.md §6). Il n'existe que si l'atelier a
   * explicitement créé le lien : aucun document n'est public par défaut.
   */
  shareToken?: string;
  shareCreatedAt?: string;
  shareRevokedAt?: string;
}

/** Vrai si le lien public de ce document est utilisable en ce moment. */
export function isShareLinkActive(doc: Pick<WorkshopDocument, "shareToken" | "shareRevokedAt">): boolean {
  return Boolean(doc.shareToken) && !doc.shareRevokedAt;
}

/** Chemin public d'un document partagé — court, lisible et collable dans WhatsApp. */
export function buildShareLinkPath(token: string): string {
  return `/d/${token}`;
}

export function generateDocumentNumber(type: DocumentType, year: number, sequenceNumber: number): string {
  const padded = String(sequenceNumber).padStart(6, "0");
  return `${DOCUMENT_TYPE_PREFIX[type]}-${year}-${padded}`;
}
