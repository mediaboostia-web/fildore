import { describe, expect, it } from "vitest";
import { toMessagingClient, toMessagingOrder } from "@/features/messaging/hub-data";
import { getMessageTemplate, resolveMessageTemplate } from "@/features/messaging/templates";
import type { Client } from "@/features/clients/types";
import type { Order } from "@/features/orders/types";
import type { Payment } from "@/features/payments/types";
import type { WorkshopDocument } from "@/features/invoices/types";

const WORKSHOP_ID = "workshop_atelier_elegance";

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "order-1",
    workshopId: WORKSHOP_ID,
    reference: "FIL-CTN-000124",
    clientId: "client-1",
    status: "confirmee",
    priority: "normale",
    garmentType: "robe",
    title: "Robe soirée wax",
    items: [],
    measurementSnapshot: {
      profileId: "profile-1",
      label: "Mesures robe",
      garmentType: "robe",
      standardMeasurements: { Poitrine: 92 },
      customMeasurements: [],
      snapshotAt: "2026-08-01T00:00:00.000Z",
    },
    totalAmount: 60000,
    discountAmount: 0,
    deliveryDate: "2026-09-10",
    statusHistory: [],
    createdByUserId: "user-1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

function makePayment(overrides: Partial<Payment> = {}): Payment {
  return {
    id: "payment-1",
    workshopId: WORKSHOP_ID,
    orderId: "order-1",
    clientId: "client-1",
    type: "acompte",
    method: "mtn_momo",
    amount: 25000,
    status: "confirme",
    receiptNumber: "REC-2026-000001",
    recordedByUserId: "user-1",
    createdAt: "2026-08-05T00:00:00.000Z",
    ...overrides,
  };
}

const CLIENT: Client = {
  id: "client-1",
  workshopId: WORKSHOP_ID,
  firstName: "Adjoavi",
  lastName: "Houngbédji",
  phone: "+22997000001",
  whatsappPhone: "+22997000001",
  city: "Cotonou",
  district: "Fidjrossè",
  address: "Rue 12, maison bleue",
  notes: "Note interne : cliente fidèle",
  tags: ["VIP"],
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("toMessagingOrder", () => {
  it("expose le SOLDE, pas le total", () => {
    // C'est le bug corrigé : la variable `{solde}` valait `totalAmount`, donc un
    // client ayant déjà versé un acompte était relancé pour la somme entière.
    const order = toMessagingOrder(makeOrder(), [makePayment()], []);

    expect(order.totalAmount).toBe(60000);
    expect(order.paidAmount).toBe(25000);
    expect(order.balance).toBe(35000);
  });

  it("tient compte de la remise dans le solde", () => {
    const order = toMessagingOrder(makeOrder({ discountAmount: 5000 }), [makePayment()], []);
    expect(order.balance).toBe(30000);
  });

  it("ignore un paiement annulé", () => {
    const order = toMessagingOrder(
      makeOrder(),
      [makePayment(), makePayment({ id: "payment-2", amount: 10000, status: "annule" })],
      []
    );
    expect(order.balance).toBe(35000);
  });

  it("ne compte que les paiements de CETTE commande", () => {
    const order = toMessagingOrder(
      makeOrder(),
      [makePayment(), makePayment({ id: "payment-x", orderId: "order-autre", amount: 50000 })],
      []
    );
    expect(order.balance).toBe(35000);
  });

  it("reporte l'acompte réellement encaissé, jamais la moitié du total", () => {
    const withDeposit = toMessagingOrder(makeOrder(), [makePayment()], []);
    expect(withDeposit.recordedDepositAmount).toBe(25000);

    const withoutDeposit = toMessagingOrder(makeOrder(), [], []);
    expect(withoutDeposit.recordedDepositAmount).toBeUndefined();
  });

  it("ne retient qu'un document dont le lien public est actif", () => {
    const revoked: WorkshopDocument = {
      id: "doc-1",
      workshopId: WORKSHOP_ID,
      orderId: "order-1",
      clientId: "client-1",
      type: "devis",
      number: "DEV-2026-000001",
      totalAmount: 60000,
      discountAmount: 0,
      paidAmount: 0,
      balanceAmount: 60000,
      issuedAt: "2026-08-02T00:00:00.000Z",
      shareToken: "token-revoque",
      shareRevokedAt: "2026-08-03T00:00:00.000Z",
    };
    const active: WorkshopDocument = { ...revoked, id: "doc-2", shareToken: "token-actif" };
    delete active.shareRevokedAt;

    expect(toMessagingOrder(makeOrder(), [], [revoked]).documentSharePath).toBeUndefined();
    expect(toMessagingOrder(makeOrder(), [], [active]).documentSharePath).toBe("/d/token-actif");
  });
});

describe("toMessagingClient", () => {
  it("ne sort que les champs affichés — ni adresse ni note interne", () => {
    // Ces objets partent dans le bundle du navigateur (PROJECT_RULES.md §7).
    const client = toMessagingClient(CLIENT);

    expect(client).toEqual({
      id: "client-1",
      firstName: "Adjoavi",
      lastName: "Houngbédji",
      phone: "+22997000001",
    });
    expect(client).not.toHaveProperty("address");
    expect(client).not.toHaveProperty("notes");
  });
});

describe("resolveMessageTemplate — variable vide", () => {
  it("retire la phrase entière plutôt que de laisser un trou", () => {
    const template = getMessageTemplate("confirmation_commande");
    const message = resolveMessageTemplate(template, {
      prenom_client: "Adjoavi",
      nom_client: "Adjoavi Houngbédji",
      reference_commande: "FIL-CTN-000124",
      nom_commande: "Robe soirée wax",
      date_livraison: "10 septembre 2026",
      montant_total: "60 000 FCFA",
      acompte: "25 000 FCFA",
      solde: "35 000 FCFA",
      nom_atelier: "Atelier Élégance",
      numero_atelier: "+229 97 00 00 01",
      lien_document: "", // aucun document partagé
    });

    // Ni URL morte, ni « Récapitulatif : . »
    expect(message).not.toContain("{lien_document}");
    expect(message).not.toContain("Récapitulatif");
    expect(message).toContain("Adjoavi");
    expect(message).toContain("FIL-CTN-000124");
  });

  it("garde la phrase quand la variable est renseignée", () => {
    const template = getMessageTemplate("confirmation_commande");
    const message = resolveMessageTemplate(template, {
      prenom_client: "Adjoavi",
      nom_client: "Adjoavi Houngbédji",
      reference_commande: "FIL-CTN-000124",
      nom_commande: "Robe soirée wax",
      date_livraison: "10 septembre 2026",
      montant_total: "60 000 FCFA",
      acompte: "25 000 FCFA",
      solde: "35 000 FCFA",
      nom_atelier: "Atelier Élégance",
      numero_atelier: "+229 97 00 00 01",
      lien_document: "https://fildor.app/d/abc123",
    });

    expect(message).toContain("https://fildor.app/d/abc123");
  });
});
