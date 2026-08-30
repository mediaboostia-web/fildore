export type Role = "owner" | "manager" | "couturiere" | "reception" | "comptable";

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Propriétaire",
  manager: "Manager",
  couturiere: "Couturière",
  reception: "Réception",
  comptable: "Comptable",
};

import type { OnlineOrderingSettings } from "@/features/public-orders/types";

export interface Workshop {
  id: string;
  name: string;
  /** Identifiant public dans l'URL de la vitrine : `/atelier/<slug>`. */
  slug: string;
  city: string;
  country: string;
  currencyCode: string;
  whatsappPhone: string;
  logoUrl?: string;
  /** Ce que l'atelier accepte de recevoir depuis sa page publique. */
  onlineOrdering: OnlineOrderingSettings;
}

export interface User {
  id: string;
  workshopId: string;
  fullName: string;
  email: string;
  role: Role;
  avatarColor: string;
}
