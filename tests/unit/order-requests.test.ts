import { beforeEach, describe, expect, it } from "vitest";
import { getDb, resetDb } from "@/lib/mock-data/store";
import {
  countRecentRequestsByPhone,
  createOrderRequest,
  getOrderRequestById,
  getOrderRequests,
  markOrderRequestAccepted,
  markOrderRequestRefused,
} from "@/lib/mock-data/order-requests";
import { buildWorkshopNotifications } from "@/features/dashboard/notifications";
import {
  DEFAULT_ONLINE_ORDERING,
  computeAnnouncedDeposit,
  requestDisplayName,
} from "@/features/public-orders/types";

const WORKSHOP_ID = "workshop_atelier_elegance";

function baseInput(overrides: Record<string, unknown> = {}) {
  return {
    workshopId: WORKSHOP_ID,
    firstName: "Christiane",
    lastName: "Dossou",
    phone: "97 00 00 05",
    city: "Cotonou",
    ...overrides,
  };
}

describe("demandes reçues en ligne", () => {
  beforeEach(() => {
    resetDb();
  });

  it("part vide : aucune demande d'exemple dans le seed", async () => {
    expect(await getOrderRequests(WORKSHOP_ID)).toEqual([]);
  });

  it("arrive au statut « à traiter » et ne crée ni client ni commande", async () => {
    const clientsBefore = getDb().clients.length;
    const ordersBefore = getDb().orders.length;

    const request = await createOrderRequest(baseInput());

    expect(request.status).toBe("nouvelle");
    // Le point capital : une demande n'est PAS une commande.
    expect(getDb().clients.length).toBe(clientsBefore);
    expect(getDb().orders.length).toBe(ordersBefore);
  });

  it("normalise le téléphone comme à la création d'un client", async () => {
    // C'est ce qui permettra de reconnaître un client déjà connu.
    const request = await createOrderRequest(baseInput({ phone: "97 00 00 05" }));
    expect(request.phone).toBe("+22997000005");
  });

  it("n'expose pas les demandes d'un autre atelier", async () => {
    await createOrderRequest(baseInput());
    await createOrderRequest(baseInput({ workshopId: "workshop_autre" }));

    const mine = await getOrderRequests(WORKSHOP_ID);
    expect(mine).toHaveLength(1);
    expect(mine[0].workshopId).toBe(WORKSHOP_ID);
  });

  it("compte les demandes récentes d'un même numéro, quel que soit son format", async () => {
    // Le plafond anti-abus doit tenir même si le robot varie l'écriture du numéro.
    await createOrderRequest(baseInput({ phone: "+229 97 00 00 05" }));
    await createOrderRequest(baseInput({ phone: "97000005" }));

    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    expect(await countRecentRequestsByPhone("00229 97 00 00 05", since)).toBe(2);
    expect(await countRecentRequestsByPhone("97 00 00 09", since)).toBe(0);
  });

  it("ne compte pas les demandes plus anciennes que la fenêtre", async () => {
    await createOrderRequest(baseInput());

    const future = new Date(Date.now() + 60_000).toISOString();
    expect(await countRecentRequestsByPhone("97000005", future)).toBe(0);
  });

  it("garde la trace du client et de la commande à l'acceptation", async () => {
    const request = await createOrderRequest(baseInput());

    const accepted = await markOrderRequestAccepted({
      requestId: request.id,
      reviewedByUserId: "user_amina",
      createdClientId: "client-nouveau",
      createdOrderId: "order-nouveau",
    });

    // Cette trace est ce qui rend l'acceptation idempotente.
    expect(accepted.status).toBe("acceptee");
    expect(accepted.createdClientId).toBe("client-nouveau");
    expect(accepted.createdOrderId).toBe("order-nouveau");
    expect(accepted.reviewedByUserId).toBe("user_amina");
    expect(accepted.reviewedAt).toBeTruthy();
  });

  it("garde le motif au refus, et ne crée rien", async () => {
    const clientsBefore = getDb().clients.length;
    const request = await createOrderRequest(baseInput());

    const refused = await markOrderRequestRefused(
      request.id,
      "Délai trop court pour cette période.",
      "user_amina"
    );

    expect(refused.status).toBe("refusee");
    expect(refused.refusalReason).toBe("Délai trop court pour cette période.");
    expect(refused.createdClientId).toBeUndefined();
    expect(refused.createdOrderId).toBeUndefined();
    expect(getDb().clients.length).toBe(clientsBefore);
  });

  it("retrouve une demande par son identifiant", async () => {
    const request = await createOrderRequest(baseInput());
    expect((await getOrderRequestById(request.id))?.id).toBe(request.id);
    expect(await getOrderRequestById("demande_inexistante")).toBeUndefined();
  });
});

describe("notifications de demandes", () => {
  it("annonce les demandes à traiter, et elles seules", () => {
    const notifications = buildWorkshopNotifications([], [], new Map(), "2026-08-30", [
      {
        id: "req-1",
        workshopId: WORKSHOP_ID,
        status: "nouvelle",
        firstName: "Christiane",
        lastName: "Dossou",
        phone: "+22997000005",
        city: "Cotonou",
        catalogItemName: "Robe Kaba",
        submittedAt: "2026-08-30T08:00:00.000Z",
      },
      {
        id: "req-2",
        workshopId: WORKSHOP_ID,
        status: "acceptee",
        firstName: "Fabrice",
        lastName: "Dossou",
        phone: "+22997000006",
        city: "Cotonou",
        submittedAt: "2026-08-28T08:00:00.000Z",
      },
    ]);

    expect(notifications).toHaveLength(1);
    expect(notifications[0].kind).toBe("demande");
    expect(notifications[0].href).toBe("/demandes/req-1");
    expect(notifications[0].description).toContain("Christiane Dossou");
    // Une demande n'est jamais « en retard » : elle a été reçue.
    expect(notifications[0].timing).toBe("Reçue aujourd'hui");
  });

  it("reste vide quand aucune demande n'est passée", () => {
    expect(buildWorkshopNotifications([], [], new Map(), "2026-08-30")).toEqual([]);
  });
});

describe("réglages de commande en ligne", () => {
  it("sont fermés par défaut : un atelier ouvre sa page volontairement", () => {
    expect(DEFAULT_ONLINE_ORDERING.enabled).toBe(false);
  });

  it("n'annonce un acompte que si l'atelier en demande un et connaît le prix", () => {
    const withDeposit = { ...DEFAULT_ONLINE_ORDERING, requireDeposit: true, depositPercent: 50 };

    expect(computeAnnouncedDeposit(60000, withDeposit)).toBe(30000);
    expect(computeAnnouncedDeposit(undefined, withDeposit)).toBeUndefined();
    expect(computeAnnouncedDeposit(0, withDeposit)).toBeUndefined();
    expect(
      computeAnnouncedDeposit(60000, { ...withDeposit, requireDeposit: false })
    ).toBeUndefined();
  });

  it("affiche le nom du demandeur sans espace parasite", () => {
    expect(requestDisplayName({ firstName: "Christiane", lastName: "Dossou" })).toBe(
      "Christiane Dossou"
    );
    expect(requestDisplayName({ firstName: "Christiane", lastName: "" })).toBe("Christiane");
  });
});
