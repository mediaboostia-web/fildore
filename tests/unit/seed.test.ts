import { describe, expect, it } from "vitest";
import { seedMockDatabase } from "@/lib/mock-data/seed";

describe("seedMockDatabase", () => {
  const db = seedMockDatabase();

  it("génère un atelier, des utilisateurs et des clients", () => {
    expect(db.workshop.name).toBe("Atelier Élégance");
    expect(db.users.length).toBeGreaterThan(0);
    expect(db.clients.length).toBeGreaterThan(0);
  });

  it("toutes les commandes référencent un client existant", () => {
    const clientIds = new Set(db.clients.map((c) => c.id));
    for (const order of db.orders) {
      expect(clientIds.has(order.clientId)).toBe(true);
    }
  });

  it("toutes les commandes ont une référence unique", () => {
    const references = db.orders.map((o) => o.reference);
    expect(new Set(references).size).toBe(references.length);
  });

  it("tous les paiements référencent une commande existante", () => {
    const orderIds = new Set(db.orders.map((o) => o.id));
    for (const payment of db.payments) {
      expect(orderIds.has(payment.orderId)).toBe(true);
    }
  });

  it("tous les documents référencent une commande existante", () => {
    const orderIds = new Set(db.orders.map((o) => o.id));
    for (const doc of db.documents) {
      expect(orderIds.has(doc.orderId)).toBe(true);
    }
  });

  it("aucune commande n'a un solde payé supérieur au total (hors remboursement)", () => {
    for (const order of db.orders) {
      const paid = db.payments
        .filter((p) => p.orderId === order.id && p.status === "confirme" && p.type !== "remboursement")
        .reduce((sum, p) => sum + p.amount, 0);
      expect(paid).toBeLessThanOrEqual(order.totalAmount);
    }
  });

  it("couvre au moins un statut de chaque grande famille (production, terminal, alternatif)", () => {
    const statuses = new Set(db.orders.map((o) => o.status));
    expect(statuses.has("livree") || statuses.has("terminee")).toBe(true);
    expect(statuses.has("annulee") || statuses.has("suspendue")).toBe(true);
    expect(statuses.size).toBeGreaterThan(5);
  });
});
