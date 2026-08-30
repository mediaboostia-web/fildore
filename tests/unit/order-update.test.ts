import { beforeEach, describe, expect, it } from "vitest";
import { getDb, resetDb } from "@/lib/mock-data/store";
import { updateOrder } from "@/lib/mock-data/orders";
import { updateMeasurementProfile } from "@/lib/mock-data/measurement-profiles";
import { computeBalance } from "@/lib/money/balance";
import { orderUpdateSchema, orderFormSchema } from "@/features/orders/schemas";

describe("modification d'une commande", () => {
  beforeEach(() => {
    resetDb();
  });

  it("enregistre réellement les nouvelles valeurs", async () => {
    const db = getDb();
    const order = db.orders[0];
    const user = db.users[0];

    await updateOrder(
      order.id,
      {
        title: "Robe de cérémonie revue",
        garmentType: "robe",
        description: "Ajout d'une doublure",
        priority: "urgente",
        totalAmount: 42000,
        discountAmount: 2000,
        deliveryDate: "2026-09-20",
      },
      user.id
    );

    const saved = getDb().orders.find((o) => o.id === order.id);
    expect(saved?.title).toBe("Robe de cérémonie revue");
    expect(saved?.priority).toBe("urgente");
    expect(saved?.totalAmount).toBe(42000);
    expect(saved?.discountAmount).toBe(2000);
    expect(saved?.deliveryDate).toBe("2026-09-20");
  });

  it("garde la trace de la modification dans l'historique", async () => {
    const db = getDb();
    const order = db.orders[0];
    const user = db.users[0];
    const before = order.statusHistory.length;
    const statusBefore = order.status;

    await updateOrder(
      order.id,
      {
        title: order.title,
        garmentType: order.garmentType,
        priority: order.priority,
        totalAmount: order.totalAmount,
        discountAmount: order.discountAmount,
        deliveryDate: order.deliveryDate,
      },
      user.id
    );

    const saved = getDb().orders.find((o) => o.id === order.id);
    expect(saved?.statusHistory).toHaveLength(before + 1);
    expect(saved?.statusHistory.at(-1)?.byUserId).toBe(user.id);
    expect(saved?.statusHistory.at(-1)?.note).toBe("Commande modifiée");
    // Modifier une commande ne la fait pas avancer en production.
    expect(saved?.status).toBe(statusBefore);
  });

  it("ne réécrit jamais le snapshot de mesures", async () => {
    const db = getDb();
    const order = db.orders[0];
    const user = db.users[0];
    const snapshotAvant = JSON.parse(JSON.stringify(order.measurementSnapshot));

    await updateOrder(
      order.id,
      {
        title: "Nouveau titre",
        garmentType: "costume",
        priority: "normale",
        totalAmount: 50000,
        discountAmount: 0,
        deliveryDate: "2026-10-01",
      },
      user.id
    );

    const saved = getDb().orders.find((o) => o.id === order.id);
    expect(saved?.measurementSnapshot).toEqual(snapshotAvant);
  });

  it("le solde suit le nouveau montant", async () => {
    const db = getDb();
    const order = db.orders[0];
    const user = db.users[0];

    await updateOrder(
      order.id,
      {
        title: order.title,
        garmentType: order.garmentType,
        priority: order.priority,
        totalAmount: 40000,
        discountAmount: 5000,
        deliveryDate: order.deliveryDate,
      },
      user.id
    );

    const saved = getDb().orders.find((o) => o.id === order.id)!;
    expect(computeBalance(saved.totalAmount, saved.discountAmount, 10000)).toBe(25000);
  });
});

describe("garde-fous de saisie d'une commande", () => {
  it("refuse une remise supérieure au montant total", () => {
    const result = orderUpdateSchema.safeParse({
      orderId: "order-1",
      title: "Robe",
      garmentType: "robe",
      priority: "normale",
      totalAmount: 30000,
      discountAmount: 35000,
      deliveryDate: "2026-09-10",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      // Sans ce refus, le solde deviendrait négatif.
      expect(result.error.flatten().fieldErrors.discountAmount?.[0]).toContain("remise");
    }
  });

  it("refuse aussi la remise excessive à la création", () => {
    const result = orderFormSchema.safeParse({
      clientId: "client-1",
      garmentType: "robe",
      title: "Robe",
      items: [{ label: "Robe", garmentType: "robe", quantity: 1, unitPrice: 30000 }],
      measurementProfileId: "profile-1",
      totalAmount: 30000,
      discountAmount: 31000,
      deliveryDate: "2026-09-10",
    });
    expect(result.success).toBe(false);
  });

  it("refuse un montant décimal", () => {
    const result = orderUpdateSchema.safeParse({
      orderId: "order-1",
      title: "Robe",
      garmentType: "robe",
      priority: "normale",
      totalAmount: 30000.5,
      discountAmount: 0,
      deliveryDate: "2026-09-10",
    });
    expect(result.success).toBe(false);
  });
});

describe("correction d'un profil de mesures", () => {
  beforeEach(() => {
    resetDb();
  });

  it("corrige le profil sans toucher aux commandes existantes", async () => {
    const db = getDb();
    const order = db.orders[0];
    const profileId = order.measurementSnapshot.profileId!;
    const snapshotAvant = JSON.parse(JSON.stringify(order.measurementSnapshot));

    await updateMeasurementProfile(profileId, {
      label: "Mesures corrigées",
      standardMeasurements: { "Tour de poitrine": 999 },
    });

    const profil = getDb().measurementProfiles.find((p) => p.id === profileId);
    expect(profil?.label).toBe("Mesures corrigées");
    expect(profil?.standardMeasurements["Tour de poitrine"]).toBe(999);

    // Le point le plus important du module : une commande déjà validée garde
    // les mesures prises à l'époque (PROJECT_RULES.md §6).
    const commande = getDb().orders.find((o) => o.id === order.id);
    expect(commande?.measurementSnapshot).toEqual(snapshotAvant);
  });

  it("copie les valeurs au lieu de partager la référence", async () => {
    const db = getDb();
    const profileId = db.measurementProfiles[0].id;
    const mesures = { "Tour de taille": 74 };

    await updateMeasurementProfile(profileId, { label: "Profil", standardMeasurements: mesures });
    mesures["Tour de taille"] = 200;

    const profil = getDb().measurementProfiles.find((p) => p.id === profileId);
    expect(profil?.standardMeasurements["Tour de taille"]).toBe(74);
  });

  it("met à jour la date de prise des mesures", async () => {
    const db = getDb();
    const profil = db.measurementProfiles[0];
    const avant = profil.takenAt;

    await updateMeasurementProfile(profil.id, {
      label: profil.label,
      standardMeasurements: { "Tour de taille": 80 },
    });

    const apres = getDb().measurementProfiles.find((p) => p.id === profil.id)!;
    expect(new Date(apres.takenAt).getTime()).toBeGreaterThanOrEqual(new Date(avant).getTime());
  });
});
