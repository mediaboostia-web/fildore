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
}

export function generateDocumentNumber(type: DocumentType, year: number, sequenceNumber: number): string {
  const padded = String(sequenceNumber).padStart(6, "0");
  return `${DOCUMENT_TYPE_PREFIX[type]}-${year}-${padded}`;
}
