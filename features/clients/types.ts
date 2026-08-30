export interface Client {
  id: string;
  workshopId: string;
  firstName: string;
  lastName: string;
  phone: string; // normalisé via normalizePhoneBenin()
  whatsappPhone: string;
  city: string;
  district: string;
  address?: string;
  notes?: string;
  tags: string[];
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export function clientDisplayName(client: Pick<Client, "firstName" | "lastName">): string {
  return `${client.firstName} ${client.lastName}`.trim();
}
