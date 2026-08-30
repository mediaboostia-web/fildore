import { generateId } from "./ids";
import type { MockDatabase } from "./store";
import type { Workshop, User, Role } from "@/features/auth/types";
import type { Client } from "@/features/clients/types";
import type { MeasurementProfile, GarmentType } from "@/features/measurements/types";
import { toMeasurementSnapshot } from "@/features/measurements/types";
import type { CatalogItem, CatalogCategory } from "@/features/catalog/types";
import type { Order, OrderStatus, OrderStatusHistoryEntry } from "@/features/orders/types";
import { generateOrderReference } from "@/features/orders/selectors";
import type { Payment, PaymentMethod } from "@/features/payments/types";
import type { WorkshopDocument } from "@/features/invoices/types";
import { generateDocumentNumber } from "@/features/invoices/types";
import type { MessageLogEntry, MessageTemplateKey } from "@/features/messaging/types";

/**
 * Toutes les dates ci-dessous sont ancrées autour du 30 août 2026 (jour de
 * référence choisi pour cette passe) afin d'obtenir un mélange réaliste de
 * commandes en retard, dues aujourd'hui, dues bientôt et futures. Ce sont des
 * dates calendaires fixes : elles ne changent pas tout seules, mais restent
 * cohérentes tant que le projet est travaillé autour de cette période.
 */
const WORKSHOP_ID = "workshop_atelier_elegance";

function iso(date: string): string {
  return date; // format YYYY-MM-DD, déjà ISO-compatible
}

export function seedMockDatabase(): MockDatabase {
  let catalogSeq = 0;
  let orderSeq = 0;
  const WORKSHOP_CODE = "CTN";

  const workshop: Workshop = {
    id: WORKSHOP_ID,
    name: "Atelier Élégance",
    city: "Cotonou",
    country: "Bénin",
    currencyCode: "XOF",
    whatsappPhone: "+229197000001",
  };

  const users: User[] = [
    user("user_amina", "Amina Chabi", "amina@atelier-elegance.bj", "owner", "#173B36"),
    user("user_koffi", "Koffi Dossou", "koffi@atelier-elegance.bj", "manager", "#2C675C"),
    user("user_grace", "Grâce Ahouansou", "grace@atelier-elegance.bj", "couturiere", "#C45A32"),
    user("user_idriss", "Idriss Boukari", "idriss@atelier-elegance.bj", "reception", "#2F6687"),
    user("user_mariam", "Mariam Yerima", "mariam@atelier-elegance.bj", "comptable", "#A86412"),
  ];

  const clients: Client[] = [
    client("c1", "Adjoavi", "Houngbédji", 1, "Fidjrossè"),
    client("c2", "Espoir", "Zinsou", 2, "Akpakpa"),
    client("c3", "Chimène", "Agbodjan", 3, "Cadjèhoun"),
    client("c4", "Rachidatou", "Sanni", 4, "Zongo"),
    client("c5", "Fabrice", "Dossou", 5, "Gbégamey"),
    client("c6", "Bienvenue", "Kpoviessi", 6, "Sainte Rita"),
    client("c7", "Nadège", "Aïhounton", 7, "Cotonou Centre"),
    client("c8", "Serge", "Adjovi", 8, "Godomey"),
    client("c9", "Yvette", "Houénou", 9, "Ganhi"),
    client("c10", "Moussa", "Alassane", 10, "Dantokpa"),
    client("c11", "Carine", "Sossou", 11, "Vêdoko"),
    client("c12", "Innocent", "Gbaguidi", 12, "Agla"),
    client("c13", "Bertrand", "Amoussou", 13, "Missité"),
    client("c14", "Sandrine", "Codjo", 14, "Akpakpa"),
    client("c15", "Wahabou", "Séro", 15, "Zogbo"),
    client("c16", "Prisca", "Dohou", 16, "Fidjrossè"),
  ];

  const catalogItems: CatalogItem[] = [
    catalogItem("Robe wax élégante", "robe", "robe", 25000, 7, ["wax", "soirée"], "/images/modele_couture.jpg"),
    catalogItem("Boubou brodé homme", "boubou_homme", "boubou", 30000, 10, ["cérémonie"], "/images/modele_couture_afrique.jpg"),
    catalogItem("Costume trois pièces", "costume", "costume", 60000, 14, ["mariage", "homme"], "/images/tailor-workshop.jpg"),
    catalogItem("Ensemble pagne wax", "ensemble", "robe", 28000, 7, ["pagne"], "/images/modele_couture_afrique.jpg"),
    catalogItem("Chemise col mao", "chemise", "chemise", 15000, 5, ["homme"], "/images/tailor-craft.jpg"),
    catalogItem("Robe de mariée sur mesure", "mariage", "robe", undefined, 30, ["mariage"], "/images/modele_couture.jpg"),
    catalogItem("Tenue enfant fête", "enfant", "enfant", 12000, 5, ["enfant"], "/images/tailor-boutique.jpg"),
    catalogItem("Uniforme scolaire", "uniforme", "uniforme", 8000, 5, ["école"], "/images/tailor-fabrics.jpg"),
  ];

  const measurementProfiles: MeasurementProfile[] = [
    profile("c1", "robe", "Robe soirée", { "Tour de poitrine": 92, "Tour de taille": 74, "Tour de hanches": 100, Carrure: 38, "Longueur robe": 130 }),
    profile("c2", "costume", "Costume mariage", { "Tour de poitrine": 104, "Tour de taille": 92, Carrure: 46, "Longueur veste": 76, "Longueur manche": 62, "Longueur pantalon": 108 }),
    profile("c3", "boubou", "Boubou cérémonie", { "Tour de poitrine": 98, "Tour de taille": 84, "Tour de hanches": 106, Carrure: 40, "Longueur boubou": 140 }),
    profile("c4", "robe", "Robe classique", { "Tour de poitrine": 90, "Tour de taille": 72, "Tour de hanches": 98, Carrure: 37, "Longueur robe": 125 }),
    profile("c5", "chemise", "Chemise bureau", { "Tour de poitrine": 100, "Tour de cou": 40, Carrure: 44, "Longueur chemise": 74, "Longueur manche": 60 }),
    profile("c6", "boubou", "Boubou mariage", { "Tour de poitrine": 96, "Tour de taille": 82, "Tour de hanches": 104, Carrure: 39, "Longueur boubou": 138 }),
    profile("c7", "robe", "Robe wax", { "Tour de poitrine": 94, "Tour de taille": 76, "Tour de hanches": 102, Carrure: 38, "Longueur robe": 128 }),
    profile("c8", "costume", "Costume trois pièces", { "Tour de poitrine": 108, "Tour de taille": 96, Carrure: 48, "Longueur veste": 78, "Longueur manche": 63, "Longueur pantalon": 110 }),
    profile("c9", "robe", "Robe cérémonie", { "Tour de poitrine": 93, "Tour de taille": 75, "Tour de hanches": 101, Carrure: 38, "Longueur robe": 132 }),
    profile("c10", "pantalon", "Pantalon sur mesure", { "Tour de taille": 88, "Tour de hanches": 98, "Tour de cuisse": 60, "Longueur pantalon": 106 }),
    profile("c11", "robe", "Ensemble pagne", { "Tour de poitrine": 91, "Tour de taille": 73, "Tour de hanches": 99, Carrure: 37, "Longueur robe": 120 }),
    profile("c12", "chemise", "Chemise col mao", { "Tour de poitrine": 102, "Tour de cou": 41, Carrure: 45, "Longueur chemise": 75, "Longueur manche": 61 }),
    profile("c13", "boubou", "Boubou fête", { "Tour de poitrine": 100, "Tour de taille": 90, Carrure: 42, "Longueur boubou": 142 }),
    profile("c14", "robe", "Robe mariage", { "Tour de poitrine": 95, "Tour de taille": 77, "Tour de hanches": 103, Carrure: 38, "Longueur robe": 135 }),
    profile("c15", "uniforme", "Uniforme scolaire", { "Tour de poitrine": 80, "Tour de taille": 68, Longueur: 90 }),
    profile("c16", "enfant", "Tenue fête enfant", { "Tour de poitrine": 60, "Tour de taille": 54, "Tour de hanches": 62, Longueur: 55 }),
  ];

  const orders: Order[] = [
    // En retard (livraison passée, pas encore livrée)
    order({
      client: "c1", profile: measurementProfiles[0], garmentType: "robe", title: "Robe soirée wax",
      status: "couture", total: 35000, discount: 0, delivery: "2026-08-22", eventDate: "2026-08-28",
      depositDue: "2026-08-10", createdBy: "user_idriss", assignedTo: "user_grace",
    }),
    order({
      client: "c8", profile: measurementProfiles[7], garmentType: "costume", title: "Costume trois pièces mariage",
      status: "retouche", total: 65000, discount: 5000, delivery: "2026-08-25", eventDate: "2026-09-05",
      depositDue: "2026-08-05", createdBy: "user_koffi", assignedTo: "user_grace",
    }),
    // Due aujourd'hui
    order({
      client: "c3", profile: measurementProfiles[2], garmentType: "boubou", title: "Boubou cérémonie",
      status: "prete", total: 32000, discount: 0, delivery: "2026-08-30",
      depositDue: "2026-08-15", createdBy: "user_idriss", assignedTo: "user_grace",
    }),
    // Due bientôt (dans les 3 jours)
    order({
      client: "c9", profile: measurementProfiles[8], garmentType: "robe", title: "Robe cérémonie",
      status: "essayage", total: 34000, discount: 0, delivery: "2026-09-01",
      depositDue: "2026-08-18", createdBy: "user_koffi", assignedTo: "user_grace",
    }),
    order({
      client: "c14", profile: measurementProfiles[13], garmentType: "robe", title: "Robe mariage",
      status: "coupe", total: 45000, discount: 0, delivery: "2026-09-02",
      depositDue: "2026-08-20", createdBy: "user_idriss", assignedTo: "user_grace",
    }),
    // Solde en retard (échéance d'acompte dépassée, solde toujours dû)
    order({
      client: "c6", profile: measurementProfiles[5], garmentType: "boubou", title: "Boubou mariage",
      status: "confirmee", total: 38000, discount: 0, delivery: "2026-09-10",
      depositDue: "2026-08-10", createdBy: "user_koffi", assignedTo: "user_grace",
    }),
    // Acompte attendu / brouillon / à confirmer (début du cycle)
    order({
      client: "c2", profile: measurementProfiles[1], garmentType: "costume", title: "Costume bureau",
      status: "acompte_attendu", total: 55000, discount: 0, delivery: "2026-09-12",
      depositDue: "2026-09-03", createdBy: "user_idriss",
    }),
    order({
      client: "c11", profile: measurementProfiles[10], garmentType: "robe", title: "Ensemble pagne wax",
      status: "a_confirmer", total: 28000, discount: 0, delivery: "2026-09-15",
      createdBy: "user_idriss",
    }),
    order({
      client: "c16", profile: measurementProfiles[15], garmentType: "enfant", title: "Tenue fête enfant",
      status: "brouillon", total: 12000, discount: 0, delivery: "2026-09-20",
      createdBy: "user_idriss",
    }),
    // Mesures à prendre / tissu-fournitures
    order({
      client: "c4", profile: measurementProfiles[3], garmentType: "robe", title: "Robe classique",
      status: "mesures_a_prendre", total: 27000, discount: 0, delivery: "2026-09-08",
      depositDue: "2026-08-29", createdBy: "user_koffi",
    }),
    order({
      client: "c12", profile: measurementProfiles[11], garmentType: "chemise", title: "Chemise col mao",
      status: "tissu_fournitures", total: 16000, discount: 0, delivery: "2026-09-06",
      depositDue: "2026-08-27", createdBy: "user_idriss", assignedTo: "user_grace",
    }),
    // Suspendue / annulée
    order({
      client: "c10", profile: measurementProfiles[9], garmentType: "pantalon", title: "Pantalon sur mesure",
      status: "suspendue", total: 18000, discount: 0, delivery: "2026-09-18",
      createdBy: "user_koffi",
    }),
    order({
      client: "c13", profile: measurementProfiles[12], garmentType: "boubou", title: "Boubou fête",
      status: "annulee", total: 30000, discount: 0, delivery: "2026-08-27",
      createdBy: "user_idriss", cancellationReason: "Le client a changé d'avis sur le modèle.",
    }),
    // Terminées / livrées récemment (historique)
    order({
      client: "c5", profile: measurementProfiles[4], garmentType: "chemise", title: "Chemise bureau",
      status: "terminee", total: 15000, discount: 0, delivery: "2026-08-05",
      depositDue: "2026-07-28", createdBy: "user_idriss", assignedTo: "user_grace", fullyPaid: true,
    }),
    order({
      client: "c7", profile: measurementProfiles[6], garmentType: "robe", title: "Robe wax",
      status: "livree", total: 26000, discount: 0, delivery: "2026-08-18",
      depositDue: "2026-08-05", createdBy: "user_koffi", assignedTo: "user_grace", fullyPaid: true,
    }),
    order({
      client: "c15", profile: measurementProfiles[14], garmentType: "uniforme", title: "Uniforme scolaire (lot)",
      status: "terminee", total: 40000, discount: 2000, delivery: "2026-08-15",
      depositDue: "2026-08-01", createdBy: "user_koffi", assignedTo: "user_grace", fullyPaid: true,
    }),
    // Quelques commandes futures "normales", pas urgentes
    order({
      client: "c1", profile: measurementProfiles[0], garmentType: "robe", title: "Deuxième robe wax",
      status: "confirmee", total: 30000, discount: 0, delivery: "2026-09-25",
      depositDue: "2026-09-05", createdBy: "user_idriss",
    }),
    order({
      client: "c9", profile: measurementProfiles[8], garmentType: "robe", title: "Robe pour baptême",
      status: "couture", total: 33000, discount: 0, delivery: "2026-09-22",
      depositDue: "2026-08-25", createdBy: "user_koffi", assignedTo: "user_grace",
    }),
  ];

  const payments: Payment[] = [];
  let receiptSeq = 0;
  const nextReceiptNumber = () => generateDocumentNumber("recu_paiement", 2026, ++receiptSeq);

  function addPayment(order: Order, amount: number, method: PaymentMethod, type: Payment["type"], daysBeforeDelivery: number) {
    payments.push({
      id: generateId("payment"),
      workshopId: WORKSHOP_ID,
      orderId: order.id,
      clientId: order.clientId,
      type,
      method,
      amount,
      status: "confirme",
      receiptNumber: nextReceiptNumber(),
      recordedByUserId: "user_mariam",
      createdAt: shiftDate(order.deliveryDate, -daysBeforeDelivery),
    });
  }

  // Acomptes et paiements partiels cohérents avec chaque commande.
  addPayment(orders[0], 15000, "mtn_momo", "acompte", 12);
  addPayment(orders[1], 30000, "orange_money", "acompte", 20);
  addPayment(orders[2], 32000, "especes", "final", 5);
  addPayment(orders[3], 15000, "mtn_momo", "acompte", 14);
  addPayment(orders[4], 20000, "wave", "acompte", 13);
  addPayment(orders[5], 10000, "especes", "acompte", 20);
  addPayment(orders[9], 12000, "mtn_momo", "acompte", 10);
  addPayment(orders[10], 8000, "moov_money", "acompte", 9);
  addPayment(orders[13], 15000, "especes", "final", 27);
  addPayment(orders[14], 26000, "mtn_momo", "final", 13);
  addPayment(orders[15], 38000, "virement", "final", 15);
  addPayment(orders[16], 12000, "mtn_momo", "acompte", 25);
  addPayment(orders[17], 15000, "orange_money", "acompte", 28);

  const documents: WorkshopDocument[] = [];
  let facSeq = 0;
  let bcSeq = 0;
  for (const o of orders) {
    const paid = payments
      .filter((p) => p.orderId === o.id && p.status === "confirme")
      .reduce((sum, p) => sum + p.amount, 0);
    const balance = o.totalAmount - o.discountAmount - paid;
    if (o.status === "annulee" || o.status === "brouillon") continue;
    bcSeq += 1;
    documents.push({
      id: generateId("doc"),
      workshopId: WORKSHOP_ID,
      orderId: o.id,
      clientId: o.clientId,
      type: "bon_commande",
      number: generateDocumentNumber("bon_commande", 2026, bcSeq),
      totalAmount: o.totalAmount,
      discountAmount: o.discountAmount,
      paidAmount: paid,
      balanceAmount: balance,
      issuedAt: o.createdAt,
    });
    if (["livree", "terminee"].includes(o.status)) {
      facSeq += 1;
      documents.push({
        id: generateId("doc"),
        workshopId: WORKSHOP_ID,
        orderId: o.id,
        clientId: o.clientId,
        type: "facture",
        number: generateDocumentNumber("facture", 2026, facSeq),
        totalAmount: o.totalAmount,
        discountAmount: o.discountAmount,
        paidAmount: paid,
        balanceAmount: balance,
        issuedAt: o.deliveredAt ?? o.deliveryDate,
      });
    }
  }

  const messageLog: MessageLogEntry[] = [
    messageLogEntry("c1", orders[0].id, "demande_acompte", "user_idriss", shiftDate(orders[0].deliveryDate, -12)),
    messageLogEntry("c3", orders[2].id, "commande_prete", "user_idriss", shiftDate(orders[2].deliveryDate, -1)),
    messageLogEntry("c5", orders[13].id, "confirmation_livraison", "user_idriss", shiftDate(orders[13].deliveryDate, 0)),
    messageLogEntry("c7", orders[14].id, "remerciement", "user_koffi", shiftDate(orders[14].deliveryDate, 1)),
    messageLogEntry("c6", orders[5].id, "rappel_solde", "user_mariam", "2026-08-25"),
  ];

  return {
    workshop,
    users,
    clients,
    measurementProfiles,
    catalogItems,
    orders,
    payments,
    documents,
    messageLog,
    sequences: {
      orderReference: orderSeq,
      documentByType: {
        devis: 0,
        bon_commande: bcSeq,
        recu_acompte: 0,
        facture: facSeq,
        recu_paiement: receiptSeq,
        bon_livraison: 0,
      },
    },
  };

  // --- Fabriques locales ---

  function user(id: string, fullName: string, email: string, role: Role, avatarColor: string): User {
    return { id, workshopId: WORKSHOP_ID, fullName, email, role, avatarColor };
  }

  function client(idSuffix: string, firstName: string, lastName: string, index: number, district: string): Client {
    const phone = `+229197001${String(index).padStart(3, "0")}`;
    return {
      id: `client_${idSuffix}`,
      workshopId: WORKSHOP_ID,
      firstName,
      lastName,
      phone,
      whatsappPhone: phone,
      city: "Cotonou",
      district,
      tags: [],
      status: "active",
      createdAt: "2026-06-01",
      updatedAt: "2026-06-01",
    };
  }

  function catalogItem(
    name: string,
    category: CatalogCategory,
    garmentType: GarmentType,
    indicativePrice: number | undefined,
    estimatedDelayDays: number,
    tags: string[],
    imageUrl?: string
  ): CatalogItem {
    return {
      id: `catalog_${++catalogSeq}`,
      workshopId: WORKSHOP_ID,
      name,
      category,
      garmentType,
      indicativePrice,
      estimatedDelayDays,
      tags,
      imageIds: [],
      imageUrl,
      isArchived: false,
      createdAt: "2026-06-01",
    };
  }

  function profile(
    clientIdSuffix: string,
    garmentType: GarmentType,
    label: string,
    standardMeasurements: Record<string, number>
  ): MeasurementProfile {
    return {
      id: `profile_${clientIdSuffix}_${garmentType}`,
      clientId: `client_${clientIdSuffix}`,
      workshopId: WORKSHOP_ID,
      label,
      garmentType,
      isPrimary: true,
      standardMeasurements,
      customMeasurements: [],
      takenAt: "2026-06-05",
      createdAt: "2026-06-05",
      updatedAt: "2026-06-05",
    };
  }

  function order(params: {
    client: string;
    profile: MeasurementProfile;
    garmentType: GarmentType;
    title: string;
    status: OrderStatus;
    total: number;
    discount: number;
    delivery: string;
    eventDate?: string;
    depositDue?: string;
    createdBy: string;
    assignedTo?: string;
    cancellationReason?: string;
    fullyPaid?: boolean;
  }): Order {
    const currentSeq = ++orderSeq;
    const reference = generateOrderReference(WORKSHOP_CODE, currentSeq);
    const createdAt = shiftDate(params.delivery, -35);
    const history: OrderStatusHistoryEntry[] = [{ status: "brouillon", at: createdAt, byUserId: params.createdBy }];
    if (params.status !== "brouillon") {
      history.push({ status: params.status, at: shiftDate(params.delivery, -3), byUserId: params.createdBy });
    }
    const isDelivered = params.status === "livree" || params.status === "terminee";
    return {
      id: `order_${currentSeq}`,
      workshopId: WORKSHOP_ID,
      reference,
      clientId: `client_${params.client}`,
      status: params.status,
      priority: "normale",
      garmentType: params.garmentType,
      title: params.title,
      items: [
        {
          id: `item_${currentSeq}_1`,
          label: params.title,
          garmentType: params.garmentType,
          quantity: 1,
          unitPrice: params.total,
        },
      ],
      measurementSnapshot: toMeasurementSnapshot(params.profile),
      totalAmount: params.total,
      discountAmount: params.discount,
      eventDate: params.eventDate ? iso(params.eventDate) : undefined,
      deliveryDate: iso(params.delivery),
      depositDueDate: params.depositDue ? iso(params.depositDue) : undefined,
      assignedToUserId: params.assignedTo,
      statusHistory: history,
      cancellationReason: params.cancellationReason,
      createdByUserId: params.createdBy,
      createdAt,
      updatedAt: shiftDate(params.delivery, -3),
      deliveredAt: isDelivered ? params.delivery : undefined,
      completedAt: params.status === "terminee" ? params.delivery : undefined,
      cancelledAt: params.status === "annulee" ? shiftDate(params.delivery, -3) : undefined,
    };
  }

  function messageLogEntry(
    clientIdSuffix: string,
    orderId: string,
    templateKey: MessageTemplateKey,
    sentByUserId: string,
    sentAt: string
  ): MessageLogEntry {
    return {
      id: generateId("message"),
      workshopId: WORKSHOP_ID,
      clientId: `client_${clientIdSuffix}`,
      orderId,
      templateKey,
      resolvedBody: "",
      sentByUserId,
      sentAt,
    };
  }
}

/** Décale une date ISO (YYYY-MM-DD) d'un nombre de jours (positif ou négatif). */
function shiftDate(isoDate: string, deltaDays: number): string {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + deltaDays);
  return date.toISOString().slice(0, 10);
}
