export type PaymentType = "acompte" | "partiel" | "final" | "remboursement";

export type PaymentMethod =
  | "especes"
  | "mtn_momo"
  | "moov_money"
  | "orange_money"
  | "wave"
  | "virement"
  | "carte"
  | "paiement_livraison"
  | "autre";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  especes: "Espèces",
  mtn_momo: "MTN MoMo",
  moov_money: "Moov Money",
  orange_money: "Orange Money",
  wave: "Wave",
  virement: "Virement bancaire",
  carte: "Carte bancaire",
  paiement_livraison: "Paiement à la livraison",
  autre: "Autre",
};

export type PaymentStatus = "confirme" | "annule" | "rembourse";

export interface Payment {
  id: string;
  workshopId: string;
  orderId: string;
  clientId: string;
  type: PaymentType;
  method: PaymentMethod;
  amount: number; // entier XOF
  reference?: string;
  proofUrl?: string;
  note?: string;
  status: PaymentStatus;
  receiptNumber: string; // REC-2026-000001
  recordedByUserId: string;
  createdAt: string;
}

export function sumConfirmedPayments(payments: Payment[]): number {
  return payments
    .filter((p) => p.status === "confirme")
    .reduce((total, p) => total + (p.type === "remboursement" ? -p.amount : p.amount), 0);
}
