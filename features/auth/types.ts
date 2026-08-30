export type Role = "owner" | "manager" | "couturiere" | "reception" | "comptable";

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Propriétaire",
  manager: "Manager",
  couturiere: "Couturière",
  reception: "Réception",
  comptable: "Comptable",
};

export interface Workshop {
  id: string;
  name: string;
  city: string;
  country: string;
  currencyCode: string;
  whatsappPhone: string;
  logoUrl?: string;
}

export interface User {
  id: string;
  workshopId: string;
  fullName: string;
  email: string;
  role: Role;
  avatarColor: string;
}
