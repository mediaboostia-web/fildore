import { beforeEach, describe, expect, it } from "vitest";
import { resetDb, getDb } from "@/lib/mock-data/store";
import { createDocument } from "@/lib/mock-data/documents";
import { computeBalance } from "@/lib/money/balance";

describe("createDocument (repository mock)", () => {
  beforeEach(() => {
    resetDb();
  });

  it("calcule le solde via computeBalance() — jamais un calcul recopié inline", async () => {
    const db = getDb();
    const order = db.orders[0];

    const document = await createDocument({
      workshopId: order.workshopId,
      orderId: order.id,
      clientId: order.clientId,
      type: "facture",
      totalAmount: 65000,
      discountAmount: 5000,
      paidAmount: 45000,
    });

    // Régression : une version antérieure ignorait discountAmount (totalAmount - paidAmount = 20000).
    expect(document.balanceAmount).toBe(computeBalance(65000, 5000, 45000));
    expect(document.balanceAmount).toBe(15000);
  });

  it("génère un numéro unique et croissant par type de document", async () => {
    const db = getDb();
    const order = db.orders[0];

    const first = await createDocument({
      workshopId: order.workshopId,
      orderId: order.id,
      clientId: order.clientId,
      type: "devis",
      totalAmount: 10000,
      discountAmount: 0,
      paidAmount: 0,
    });
    const second = await createDocument({
      workshopId: order.workshopId,
      orderId: order.id,
      clientId: order.clientId,
      type: "devis",
      totalAmount: 20000,
      discountAmount: 0,
      paidAmount: 0,
    });

    expect(first.number).not.toBe(second.number);
    expect(first.number).toMatch(/^DEV-\d{4}-\d{6}$/);
  });

  it("persiste le document dans le store mock", async () => {
    const db = getDb();
    const order = db.orders[0];
    const countBefore = db.documents.length;

    const document = await createDocument({
      workshopId: order.workshopId,
      orderId: order.id,
      clientId: order.clientId,
      type: "bon_livraison",
      totalAmount: 30000,
      discountAmount: 0,
      paidAmount: 30000,
    });

    expect(db.documents).toHaveLength(countBefore + 1);
    expect(db.documents.at(-1)).toEqual(document);
  });
});
