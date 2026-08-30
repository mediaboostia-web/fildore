import { describe, expect, it } from "vitest";
import { generateOrderReference, getOrderComputedFlags } from "@/features/orders/selectors";
import type { Order } from "@/features/orders/types";

const TODAY = "2026-08-30";

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "order-1",
    workshopId: "workshop-1",
    reference: "FIL-CTN-000001",
    clientId: "client-1",
    status: "confirmee",
    priority: "normale",
    garmentType: "robe",
    title: "Robe de soirée",
    items: [],
    measurementSnapshot: {
      profileId: "profile-1",
      label: "Profil robe",
      garmentType: "robe",
      standardMeasurements: {},
      customMeasurements: [],
      snapshotAt: TODAY,
    },
    totalAmount: 35000,
    discountAmount: 0,
    deliveryDate: TODAY,
    statusHistory: [],
    createdByUserId: "user-1",
    createdAt: TODAY,
    updatedAt: TODAY,
    ...overrides,
  };
}

describe("generateOrderReference", () => {
  it("formate FIL-<code>-<numéro sur 6 chiffres>", () => {
    expect(generateOrderReference("CTN", 124)).toBe("FIL-CTN-000124");
  });
});

describe("getOrderComputedFlags", () => {
  it("détecte une commande en retard", () => {
    const order = makeOrder({ deliveryDate: "2026-08-20" });
    const flags = getOrderComputedFlags(order, TODAY, 0);
    expect(flags.isOverdue).toBe(true);
    expect(flags.isDueToday).toBe(false);
  });

  it("détecte une commande due aujourd'hui", () => {
    const order = makeOrder({ deliveryDate: TODAY });
    const flags = getOrderComputedFlags(order, TODAY, 0);
    expect(flags.isDueToday).toBe(true);
    expect(flags.isOverdue).toBe(false);
  });

  it("détecte une commande due bientôt (dans les 3 jours)", () => {
    const order = makeOrder({ deliveryDate: "2026-09-01" });
    const flags = getOrderComputedFlags(order, TODAY, 0);
    expect(flags.isDueSoon).toBe(true);
  });

  it("ignore le retard pour une commande déjà livrée", () => {
    const order = makeOrder({ deliveryDate: "2026-08-01", status: "livree" });
    const flags = getOrderComputedFlags(order, TODAY, 0);
    expect(flags.isOverdue).toBe(false);
  });

  it("détecte un solde en retard quand l'échéance d'acompte est dépassée", () => {
    const order = makeOrder({
      deliveryDate: "2026-09-15",
      depositDueDate: "2026-08-20",
      totalAmount: 35000,
    });
    const flags = getOrderComputedFlags(order, TODAY, 10000);
    expect(flags.isPaymentOverdue).toBe(true);
  });

  it("ne signale pas de solde en retard une fois le solde soldé", () => {
    const order = makeOrder({
      deliveryDate: "2026-09-15",
      depositDueDate: "2026-08-20",
      totalAmount: 35000,
    });
    const flags = getOrderComputedFlags(order, TODAY, 35000);
    expect(flags.isPaymentOverdue).toBe(false);
  });
});
