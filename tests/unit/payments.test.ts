import { beforeEach, describe, expect, it } from "vitest";
import { resetDb, getDb } from "@/lib/mock-data/store";
import { recordPayment, cancelPayment, getPaidAmountForOrder } from "@/lib/mock-data/payments";
import { sumConfirmedPayments } from "@/features/payments/types";
import type { Payment } from "@/features/payments/types";

function makeConfirmedPayment(overrides: Partial<Payment> = {}): Payment {
  return {
    id: "payment-x",
    workshopId: "workshop-1",
    orderId: "order-1",
    clientId: "client-1",
    type: "acompte",
    method: "especes",
    amount: 10000,
    status: "confirme",
    receiptNumber: "REC-2026-000001",
    recordedByUserId: "user-1",
    createdAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("sumConfirmedPayments", () => {
  it("additionne uniquement les paiements confirmés", () => {
    const payments = [
      makeConfirmedPayment({ amount: 10000 }),
      makeConfirmedPayment({ id: "p2", amount: 5000, status: "annule" }),
      makeConfirmedPayment({ id: "p3", amount: 8000 }),
    ];
    expect(sumConfirmedPayments(payments)).toBe(18000);
  });

  it("soustrait les remboursements confirmés", () => {
    const payments = [
      makeConfirmedPayment({ amount: 20000 }),
      makeConfirmedPayment({ id: "p2", amount: 5000, type: "remboursement" }),
    ];
    expect(sumConfirmedPayments(payments)).toBe(15000);
  });
});

describe("recordPayment / cancelPayment (repository mock)", () => {
  beforeEach(() => {
    resetDb();
  });

  it("enregistre un paiement confirmé et émet automatiquement un reçu consultable", async () => {
    const db = getDb();
    const order = db.orders[0];
    const user = db.users[0];

    const payment = await recordPayment({
      workshopId: order.workshopId,
      orderId: order.id,
      clientId: order.clientId,
      type: "acompte",
      method: "mtn_momo",
      amount: 15000,
      recordedByUserId: user.id,
    });

    expect(payment.status).toBe("confirme");
    expect(payment.amount).toBe(15000);
    expect(db.payments).toContainEqual(payment);

    const receipt = db.documents.find((d) => d.paymentId === payment.id);
    expect(receipt).toBeDefined();
    expect(receipt?.type).toBe("recu_paiement");
    expect(receipt?.number).toBe(payment.receiptNumber);
    expect(receipt?.totalAmount).toBe(15000);
    expect(receipt?.balanceAmount).toBe(0);
  });

  it("le solde d'une commande reflète le paiement dès l'enregistrement", async () => {
    const db = getDb();
    const order = db.orders[0];
    const user = db.users[0];

    const before = await getPaidAmountForOrder(order.id);
    await recordPayment({
      workshopId: order.workshopId,
      orderId: order.id,
      clientId: order.clientId,
      type: "partiel",
      method: "especes",
      amount: 7000,
      recordedByUserId: user.id,
    });
    const after = await getPaidAmountForOrder(order.id);

    expect(after).toBe(before + 7000);
  });

  it("un paiement annulé n'est plus compté dans le solde encaissé", async () => {
    const db = getDb();
    const order = db.orders[0];
    const user = db.users[0];

    const before = await getPaidAmountForOrder(order.id);
    const payment = await recordPayment({
      workshopId: order.workshopId,
      orderId: order.id,
      clientId: order.clientId,
      type: "partiel",
      method: "especes",
      amount: 9000,
      recordedByUserId: user.id,
    });

    const cancelled = await cancelPayment(payment.id);
    expect(cancelled.status).toBe("annule");

    const after = await getPaidAmountForOrder(order.id);
    expect(after).toBe(before);
  });

  it("ne compte que les paiements de la commande demandée, pas ceux des autres commandes", async () => {
    const db = getDb();
    const [orderA, orderB] = db.orders;
    const user = db.users[0];
    if (!orderB) return; // le seed doit fournir au moins deux commandes

    await recordPayment({
      workshopId: orderA.workshopId,
      orderId: orderA.id,
      clientId: orderA.clientId,
      type: "partiel",
      method: "especes",
      amount: 12000,
      recordedByUserId: user.id,
    });

    const paidForOrderB = await getPaidAmountForOrder(orderB.id);
    const expectedForOrderB = sumConfirmedPayments(
      db.payments.filter((p) => p.orderId === orderB.id)
    );
    expect(paidForOrderB).toBe(expectedForOrderB);
  });
});
