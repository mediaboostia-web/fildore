import type { Workshop, User } from "@/features/auth/types";
import type { Client } from "@/features/clients/types";
import type { MeasurementProfile } from "@/features/measurements/types";
import type { CatalogItem } from "@/features/catalog/types";
import type { Order } from "@/features/orders/types";
import type { Payment } from "@/features/payments/types";
import type { WorkshopDocument, DocumentType } from "@/features/invoices/types";
import type { MessageLogEntry } from "@/features/messaging/types";
import { seedMockDatabase } from "./seed";

export interface MockDatabase {
  workshop: Workshop;
  users: User[];
  clients: Client[];
  measurementProfiles: MeasurementProfile[];
  catalogItems: CatalogItem[];
  orders: Order[];
  payments: Payment[];
  documents: WorkshopDocument[];
  messageLog: MessageLogEntry[];
  sequences: {
    orderReference: number;
    documentByType: Record<DocumentType, number>;
  };
}

declare global {
  var __FILDOR_DB__: MockDatabase | undefined;
}

/**
 * Singleton en mémoire protégé du Fast Refresh via `globalThis` (même pattern
 * que celui recommandé pour un client Prisma en dev) — sans ça, chaque
 * rechargement de module en développement réinitialiserait silencieusement
 * les données mockées en pleine démo. NE PAS "corriger" ce pattern.
 */
export function getDb(): MockDatabase {
  if (!globalThis.__FILDOR_DB__) {
    globalThis.__FILDOR_DB__ = seedMockDatabase();
  }
  return globalThis.__FILDOR_DB__;
}

export function resetDb(): MockDatabase {
  globalThis.__FILDOR_DB__ = seedMockDatabase();
  return globalThis.__FILDOR_DB__;
}

const ARTIFICIAL_DELAY_MS = process.env.NEXT_PUBLIC_MOCK_DELAY ? Number(process.env.NEXT_PUBLIC_MOCK_DELAY) : 0;

/** Délai artificiel désactivable, pour rendre les états `loading` observables. */
export function wait(ms: number = ARTIFICIAL_DELAY_MS): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}
