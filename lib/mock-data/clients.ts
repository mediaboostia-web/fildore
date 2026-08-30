import { getDb, wait } from "./store";
import { generateId } from "./ids";
import { normalizePhoneBenin, isSamePhone } from "@/lib/utils/phone";
import type { Client } from "@/features/clients/types";

export async function getClients(): Promise<Client[]> {
  await wait();
  return getDb().clients.filter((c) => c.status === "active");
}

export async function getClientById(id: string): Promise<Client | undefined> {
  await wait();
  return getDb().clients.find((c) => c.id === id);
}

export async function searchClients(query: string): Promise<Client[]> {
  await wait();
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return getDb().clients.filter((c) => c.status === "active");
  return getDb().clients.filter((c) => {
    if (c.status !== "active") return false;
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return fullName.includes(normalizedQuery) || c.phone.includes(normalizedQuery);
  });
}

/** Détecte un doublon sur le numéro dans la même organisation (mock : un seul atelier). */
export async function findClientByPhone(phone: string): Promise<Client | undefined> {
  await wait();
  return getDb().clients.find((c) => c.status === "active" && isSamePhone(c.phone, phone));
}

export interface CreateClientInput {
  workshopId: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  district: string;
  address?: string;
  notes?: string;
  tags?: string[];
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  await wait();
  const db = getDb();
  const normalizedPhone = normalizePhoneBenin(input.phone);
  const now = new Date().toISOString();
  const client: Client = {
    id: generateId("client"),
    workshopId: input.workshopId,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: normalizedPhone,
    whatsappPhone: normalizedPhone,
    city: input.city,
    district: input.district,
    address: input.address,
    notes: input.notes,
    tags: input.tags ?? [],
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
  db.clients.push(client);
  return client;
}

export async function updateClient(id: string, patch: Partial<CreateClientInput>): Promise<Client> {
  await wait();
  const db = getDb();
  const client = db.clients.find((c) => c.id === id);
  if (!client) throw new Error(`Client introuvable : ${id}`);
  Object.assign(client, patch);
  if (patch.phone) {
    const normalized = normalizePhoneBenin(patch.phone);
    client.phone = normalized;
    client.whatsappPhone = normalized;
  }
  client.updatedAt = new Date().toISOString();
  return client;
}

export async function archiveClient(id: string): Promise<Client> {
  await wait();
  const db = getDb();
  const client = db.clients.find((c) => c.id === id);
  if (!client) throw new Error(`Client introuvable : ${id}`);
  client.status = "archived";
  client.archivedAt = new Date().toISOString();
  return client;
}
