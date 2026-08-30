import { beforeEach, describe, expect, it } from "vitest";
import { getDb, resetDb } from "@/lib/mock-data/store";
import { createDocument, getDocumentsByOrder } from "@/lib/mock-data/documents";
import { recordPayment, getPaidAmountForOrder } from "@/lib/mock-data/payments";
import {
  MANUAL_DOCUMENT_TYPES,
  SINGLE_ISSUE_DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  generateDocumentNumber,
} from "@/features/invoices/types";
import { computeBalance } from "@/lib/money/balance";

describe("types de documents proposés", () => {
  it("les cinq documents créables à la main sont couverts", () => {
    expect([...MANUAL_DOCUMENT_TYPES]).toEqual([
      "devis",
      "bon_commande",
      "recu_acompte",
      "facture",
      "bon_livraison",
    ]);
  });

  it("le reçu de paiement n'est jamais créé à la main", () => {
    // Il est émis automatiquement avec chaque encaissement : un reçu sans
    // paiement correspondant n'aurait aucun sens comptable.
    expect(MANUAL_DOCUMENT_TYPES).not.toContain("recu_paiement");
  });

  it("la facture est le seul document à émission unique", () => {
    expect([...SINGLE_ISSUE_DOCUMENT_TYPES]).toEqual(["facture"]);
  });

  it("chaque type proposé a un libellé lisible", () => {
    for (const type of MANUAL_DOCUMENT_TYPES) {
      expect(DOCUMENT_TYPE_LABELS[type]).toBeTruthy();
    }
  });
});

describe("émission des documents", () => {
  beforeEach(() => {
    resetDb();
  });

  it("numérote chaque type dans sa propre série", () => {
    expect(generateDocumentNumber("devis", 2026, 1)).toBe("DEV-2026-000001");
    expect(generateDocumentNumber("facture", 2026, 42)).toBe("FAC-2026-000042");
    expect(generateDocumentNumber("bon_livraison", 2026, 7)).toBe("BL-2026-000007");
  });

  it("inscrit le solde recalculé, remise comprise", async () => {
    const db = getDb();
    const order = db.orders[0];

    const document = await createDocument({
      workshopId: order.workshopId,
      orderId: order.id,
      clientId: order.clientId,
      type: "devis",
      totalAmount: 40000,
      discountAmount: 5000,
      paidAmount: 10000,
    });

    // 40 000 − 5 000 − 10 000 : la remise doit compter, c'est le bug qu'avait
    // l'aperçu imprimable avant correction.
    expect(document.balanceAmount).toBe(25000);
    expect(document.balanceAmount).toBe(computeBalance(40000, 5000, 10000));
  });

  it("un encaissement émet automatiquement son reçu", async () => {
    const db = getDb();
    const order = db.orders[0];
    const user = db.users[0];
    const avant = (await getDocumentsByOrder(order.id)).length;

    const payment = await recordPayment({
      workshopId: order.workshopId,
      orderId: order.id,
      clientId: order.clientId,
      type: "acompte",
      method: "mtn_momo",
      amount: 12000,
      recordedByUserId: user.id,
    });

    const apres = await getDocumentsByOrder(order.id);
    expect(apres).toHaveLength(avant + 1);

    const recu = apres.find((d) => d.paymentId === payment.id);
    expect(recu?.type).toBe("recu_paiement");
    expect(recu?.number).toBe(payment.receiptNumber);
  });

  it("le reçu d'un paiement annulé reste consultable", async () => {
    const db = getDb();
    const order = db.orders[0];
    const user = db.users[0];

    const payment = await recordPayment({
      workshopId: order.workshopId,
      orderId: order.id,
      clientId: order.clientId,
      type: "partiel",
      method: "especes",
      amount: 8000,
      recordedByUserId: user.id,
    });

    const soldeAvant = await getPaidAmountForOrder(order.id);
    const { cancelPayment } = await import("@/lib/mock-data/payments");
    await cancelPayment(payment.id, "Erreur de saisie", user.id);

    // Le montant ne compte plus…
    expect(await getPaidAmountForOrder(order.id)).toBe(soldeAvant - 8000);
    // …mais le document remis au client n'a pas disparu de l'historique.
    const documents = await getDocumentsByOrder(order.id);
    expect(documents.some((d) => d.paymentId === payment.id)).toBe(true);
  });
});
