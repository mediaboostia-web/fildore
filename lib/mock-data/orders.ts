import { getDb, wait } from "./store";
import { generateId } from "./ids";
import { generateOrderReference } from "@/features/orders/selectors";
import { toMeasurementSnapshot } from "@/features/measurements/types";
import type { MeasurementProfile, GarmentType } from "@/features/measurements/types";
import type { Order, OrderItem, OrderStatus } from "@/features/orders/types";

/** Code atelier utilisé dans la référence de commande (FIL-CTN-000124). Un seul atelier en mock. */
const WORKSHOP_CODE = "CTN";

export async function getOrders(): Promise<Order[]> {
  await wait();
  return getDb().orders;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  await wait();
  return getDb().orders.find((o) => o.id === id);
}

export async function getOrdersByClient(clientId: string): Promise<Order[]> {
  await wait();
  return getDb().orders.filter((o) => o.clientId === clientId);
}

export interface CreateOrderInput {
  workshopId: string;
  clientId: string;
  garmentType: GarmentType;
  title: string;
  description?: string;
  items: Omit<OrderItem, "id">[];
  measurementProfile: MeasurementProfile;
  totalAmount: number;
  discountAmount: number;
  eventDate?: string;
  deliveryDate: string;
  depositDueDate?: string;
  createdByUserId: string;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  await wait();
  const db = getDb();
  const now = new Date().toISOString();
  db.sequences.orderReference += 1;
  const order: Order = {
    id: generateId("order"),
    workshopId: input.workshopId,
    reference: generateOrderReference(WORKSHOP_CODE, db.sequences.orderReference),
    clientId: input.clientId,
    status: "brouillon",
    priority: "normale",
    garmentType: input.garmentType,
    title: input.title,
    description: input.description,
    items: input.items.map((item) => ({ ...item, id: generateId("item") })),
    measurementSnapshot: toMeasurementSnapshot(input.measurementProfile),
    totalAmount: input.totalAmount,
    discountAmount: input.discountAmount,
    eventDate: input.eventDate,
    deliveryDate: input.deliveryDate,
    depositDueDate: input.depositDueDate,
    statusHistory: [{ status: "brouillon", at: now, byUserId: input.createdByUserId }],
    createdByUserId: input.createdByUserId,
    createdAt: now,
    updatedAt: now,
  };
  db.orders.push(order);
  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  byUserId: string,
  note?: string
): Promise<Order> {
  await wait();
  const db = getDb();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) throw new Error(`Commande introuvable : ${orderId}`);
  const now = new Date().toISOString();
  order.status = status;
  order.statusHistory.push({ status, at: now, byUserId, note });
  order.updatedAt = now;
  if (status === "livree") order.deliveredAt = now;
  if (status === "terminee") order.completedAt = now;
  return order;
}

export async function cancelOrder(orderId: string, reason: string, byUserId: string): Promise<Order> {
  await wait();
  const db = getDb();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) throw new Error(`Commande introuvable : ${orderId}`);
  const now = new Date().toISOString();
  order.status = "annulee";
  order.cancellationReason = reason;
  order.cancelledAt = now;
  order.statusHistory.push({ status: "annulee", at: now, byUserId, note: reason });
  order.updatedAt = now;
  return order;
}
