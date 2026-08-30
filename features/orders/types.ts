import type { GarmentType, MeasurementSnapshot } from "@/features/measurements/types";

export type OrderStatus =
  | "brouillon"
  | "a_confirmer"
  | "acompte_attendu"
  | "confirmee"
  | "mesures_a_prendre"
  | "tissu_fournitures"
  | "coupe"
  | "couture"
  | "essayage"
  | "retouche"
  | "prete"
  | "livree"
  | "terminee"
  | "suspendue"
  | "annulee";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  brouillon: "Brouillon",
  a_confirmer: "À confirmer",
  acompte_attendu: "Acompte attendu",
  confirmee: "Confirmée",
  mesures_a_prendre: "Mesures à prendre",
  tissu_fournitures: "Tissu / fournitures",
  coupe: "Coupe",
  couture: "Couture",
  essayage: "Essayage",
  retouche: "Retouche",
  prete: "Prête",
  livree: "Livrée",
  terminee: "Terminée",
  suspendue: "Suspendue",
  annulee: "Annulée",
};

/** Ordre du flux normal de production, utilisé par le Stepper/Timeline de commande. */
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "brouillon",
  "a_confirmer",
  "acompte_attendu",
  "confirmee",
  "mesures_a_prendre",
  "tissu_fournitures",
  "coupe",
  "couture",
  "essayage",
  "retouche",
  "prete",
  "livree",
  "terminee",
];

export const ORDER_STATUS_ALTERNATE: OrderStatus[] = ["suspendue", "annulee"];

export interface OrderStatusHistoryEntry {
  status: OrderStatus;
  at: string;
  byUserId?: string;
  note?: string;
}

export interface OrderItem {
  id: string;
  label: string;
  garmentType: GarmentType;
  quantity: number;
  unitPrice: number; // entier XOF
}

export interface Order {
  id: string;
  workshopId: string;
  reference: string; // FIL-CTN-000124
  clientId: string;
  projectId?: string;
  status: OrderStatus;
  priority: "normale" | "urgente";
  garmentType: GarmentType;
  title: string;
  description?: string;
  items: OrderItem[];
  measurementSnapshot: MeasurementSnapshot;
  catalogItemId?: string;
  totalAmount: number; // entier XOF
  discountAmount: number; // entier XOF
  eventDate?: string;
  deliveryDate: string;
  depositDueDate?: string;
  assignedToUserId?: string;
  notes?: string;
  statusHistory: OrderStatusHistoryEntry[];
  cancellationReason?: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface OrderComputedFlags {
  isOverdue: boolean;
  isDueToday: boolean;
  isDueSoon: boolean; // dans les 3 jours
  isPaymentOverdue: boolean;
}
