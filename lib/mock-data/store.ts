import type { Workshop, User } from "@/features/auth/types";
import type { Client } from "@/features/clients/types";
import type { MeasurementProfile } from "@/features/measurements/types";
import type { CatalogItem } from "@/features/catalog/types";
import type { Order } from "@/features/orders/types";
import type { Payment } from "@/features/payments/types";
import type { WorkshopDocument, DocumentType } from "@/features/invoices/types";
import type { MessageLogEntry } from "@/features/messaging/types";
import type { OrderRequest } from "@/features/public-orders/types";
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
  /** Demandes reçues depuis la page publique, en attente de décision. */
  orderRequests: OrderRequest[];
  sequences: {
    orderReference: number;
    documentByType: Record<DocumentType, number>;
  };
}

declare global {
  var __FILDOR_DB__: MockDatabase | undefined;
}

/**
 * Complète une base en mémoire créée avant l'ajout d'un champ.
 *
 * Le singleton survit volontairement au Fast Refresh. Conséquence : quand on
 * ajoute une collection ou un champ pendant que le serveur de dev tourne, la
 * base vivante garde l'ancienne forme et le code neuf plante sur `undefined`.
 * On la complète à partir du seed plutôt que de tout réinitialiser — les
 * commandes et clients créés pendant la session sont conservés.
 */
function needsHydration(db: MockDatabase): boolean {
  return (
    db.orderRequests === undefined ||
    db.workshop?.slug === undefined ||
    db.workshop?.onlineOrdering === undefined
  );
}

function hydrateDatabase(db: MockDatabase): MockDatabase {
  // `seedMockDatabase()` reconstruit tout le jeu de données : on ne l'appelle
  // que dans ce cas rare, jamais à chaque lecture.
  const fresh = seedMockDatabase();

  db.orderRequests ??= [];
  db.messageLog ??= [];
  db.documents ??= [];

  // Champs d'atelier ajoutés après coup (identifiant public, commandes en ligne).
  db.workshop = {
    ...fresh.workshop,
    ...db.workshop,
    slug: db.workshop?.slug ?? fresh.workshop.slug,
    onlineOrdering: db.workshop?.onlineOrdering ?? fresh.workshop.onlineOrdering,
  };

  return db;
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
    return globalThis.__FILDOR_DB__;
  }

  const db = globalThis.__FILDOR_DB__;
  return needsHydration(db) ? hydrateDatabase(db) : db;
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
