import { describe, expect, it } from "vitest";
import { buildWorkshopNotifications } from "@/features/dashboard/notifications";
import { formatAmount } from "@/lib/money/format";
import type { Order } from "@/features/orders/types";
import type { Client } from "@/features/clients/types";
import type { MeasurementSnapshot } from "@/features/measurements/types";

const TODAY = "2026-08-30";

const SNAPSHOT: MeasurementSnapshot = {
  profileId: "profile-1",
  label: "Robe",
  garmentType: "robe",
  standardMeasurements: { "Tour de taille": 74 },
  customMeasurements: [],
  snapshotAt: "2026-08-01T00:00:00.000Z",
};

function makeClient(overrides: Partial<Client> = {}): Client {
  return {
    id: "client-1",
    workshopId: "workshop-1",
    firstName: "Adjoavi",
    lastName: "Houngbédji",
    phone: "+22997000001",
    whatsappPhone: "+22997000001",
    city: "Cotonou",
    district: "Fidjrossè",
    tags: [],
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "order-1",
    workshopId: "workshop-1",
    reference: "FIL-CTN-000124",
    clientId: "client-1",
    status: "couture",
    priority: "normale",
    garmentType: "robe",
    title: "Robe soirée wax",
    items: [],
    measurementSnapshot: SNAPSHOT,
    totalAmount: 35000,
    discountAmount: 0,
    deliveryDate: "2026-09-15",
    statusHistory: [],
    createdByUserId: "user-1",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("alertes de l'atelier", () => {
  it("un atelier sans échéance ne produit aucune alerte", () => {
    // Le panneau doit alors afficher « Rien à signaler », jamais un exemple.
    const orders = [makeOrder({ deliveryDate: "2026-12-01" })];
    expect(buildWorkshopNotifications(orders, [makeClient()], new Map(), TODAY)).toEqual([]);
  });

  it("signale une livraison en retard avec la référence et le client", () => {
    const orders = [makeOrder({ deliveryDate: "2026-08-22" })];
    const alerts = buildWorkshopNotifications(orders, [makeClient()], new Map(), TODAY);

    expect(alerts).toHaveLength(1);
    expect(alerts[0].tone).toBe("danger");
    expect(alerts[0].title).toBe("Livraison en retard");
    expect(alerts[0].description).toContain("FIL-CTN-000124");
    expect(alerts[0].description).toContain("Adjoavi Houngbédji");
    expect(alerts[0].href).toBe("/commandes/order-1");
  });

  it("distingue une livraison du jour d'une livraison proche", () => {
    const aujourdHui = buildWorkshopNotifications(
      [makeOrder({ deliveryDate: TODAY })],
      [makeClient()],
      new Map(),
      TODAY
    );
    expect(aujourdHui[0].title).toBe("À livrer aujourd'hui");
    expect(aujourdHui[0].timing).toBe("Aujourd'hui");

    const demain = buildWorkshopNotifications(
      [makeOrder({ deliveryDate: "2026-08-31" })],
      [makeClient()],
      new Map(),
      TODAY
    );
    expect(demain[0].title).toBe("Livraison proche");
    expect(demain[0].timing).toBe("Demain");

    const dansDeuxJours = buildWorkshopNotifications(
      [makeOrder({ deliveryDate: "2026-09-01" })],
      [makeClient()],
      new Map(),
      TODAY
    );
    expect(dansDeuxJours[0].timing).toBe("Dans 2 jours");
  });

  it("ne signale rien pour une commande déjà livrée ou annulée", () => {
    const livree = makeOrder({ id: "o-livree", status: "livree", deliveryDate: "2026-08-20" });
    const annulee = makeOrder({ id: "o-annulee", status: "annulee", deliveryDate: "2026-08-20" });
    expect(
      buildWorkshopNotifications([livree, annulee], [makeClient()], new Map(), TODAY)
    ).toEqual([]);
  });

  it("signale un acompte en retard avec le solde réellement dû", () => {
    const orders = [
      makeOrder({ deliveryDate: "2026-12-01", depositDueDate: "2026-08-10", totalAmount: 35000 }),
    ];
    // 10 000 déjà encaissés : le solde annoncé doit être 25 000, pas le total.
    const paid = new Map([["order-1", 10000]]);
    const alerts = buildWorkshopNotifications(orders, [makeClient()], paid, TODAY);

    expect(alerts).toHaveLength(1);
    expect(alerts[0].kind).toBe("paiement");
    // Passe par `formatAmount` : espace ASCII normale, copiable vers WhatsApp.
    expect(alerts[0].description).toContain(formatAmount(25000));
    expect(alerts[0].description).toContain("25 000 FCFA");
  });

  it("ne réclame pas un acompte sur une commande entièrement payée", () => {
    const orders = [
      makeOrder({ deliveryDate: "2026-12-01", depositDueDate: "2026-08-10", totalAmount: 35000 }),
    ];
    const paid = new Map([["order-1", 35000]]);
    expect(buildWorkshopNotifications(orders, [makeClient()], paid, TODAY)).toEqual([]);
  });

  it("place les urgences en premier", () => {
    const enRetard = makeOrder({ id: "o-retard", deliveryDate: "2026-08-20" });
    const proche = makeOrder({ id: "o-proche", deliveryDate: "2026-09-01" });
    const aujourdHui = makeOrder({ id: "o-jour", deliveryDate: TODAY });

    const alerts = buildWorkshopNotifications(
      [proche, aujourdHui, enRetard],
      [makeClient()],
      new Map(),
      TODAY
    );

    expect(alerts.map((a) => a.tone)).toEqual(["danger", "warning", "info"]);
  });

  it("reste lisible même sans client retrouvé", () => {
    const alerts = buildWorkshopNotifications(
      [makeOrder({ deliveryDate: "2026-08-20" })],
      [],
      new Map(),
      TODAY
    );
    expect(alerts[0].description).toContain("Client");
  });
});
