import type { DocumentType, WorkshopDocument } from "@/features/invoices/types";
import type { FildorDocumentType, DocumentPreviewLine } from "@/components/ui/document-preview";
import type { Order } from "@/features/orders/types";

/**
 * Correspondance entre le type métier d'un document et sa mise en page.
 * Partagée par la page atelier et la page publique `/d/[token]` : les deux
 * doivent produire exactement le même document, sinon le client reçoit un
 * papier différent de celui que l'atelier a vu à l'écran.
 */
const PREVIEW_TYPE_BY_DOCUMENT: Record<DocumentType, FildorDocumentType> = {
  devis: "devis",
  bon_commande: "bon_commande",
  recu_acompte: "recu",
  recu_paiement: "recu",
  facture: "facture",
  bon_livraison: "bon_livraison",
};

export function toPreviewType(type: DocumentType): FildorDocumentType {
  return PREVIEW_TYPE_BY_DOCUMENT[type] ?? "facture";
}

/**
 * Lignes imprimées sur le document. Elles viennent de la commande quand elle
 * existe ; sinon une ligne unique reprend le montant du document — jamais un
 * libellé ou un tarif inventé.
 */
export function buildDocumentLines(
  doc: WorkshopDocument,
  order: Order | undefined
): DocumentPreviewLine[] {
  if (order && order.items.length > 0) {
    return order.items.map((item) => ({
      id: item.id,
      label: item.label,
      quantity: item.quantity,
      unitAmount: item.unitPrice,
    }));
  }

  return [
    {
      id: `${doc.id}-ligne`,
      label: "Prestation de couture",
      quantity: 1,
      unitAmount: doc.totalAmount,
    },
  ];
}
