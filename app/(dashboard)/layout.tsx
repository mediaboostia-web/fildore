import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";
import { ROLE_LABELS } from "@/features/auth/types";
import { getOrders } from "@/lib/mock-data/orders";
import { getClients } from "@/lib/mock-data/clients";
import { getPayments } from "@/lib/mock-data/payments";
import { sumConfirmedPayments } from "@/features/payments/types";
import { buildWorkshopNotifications } from "@/features/dashboard/notifications";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // `proxy.ts` protège déjà ces routes, mais on revérifie ici : c'est aussi
  // ce layout qui a besoin des données utilisateur pour le rendu de l'AppShell.
  const user = await getCurrentUser();
  if (!user) {
    redirect("/connexion");
  }

  const [orders, clients, payments] = await Promise.all([getOrders(), getClients(), getPayments()]);

  // Les alertes du panneau de notifications sont dérivées des mêmes sélecteurs
  // que le tableau de bord — jamais d'exemples codés en dur.
  const paymentsByOrder = new Map<string, number>();
  for (const order of orders) {
    paymentsByOrder.set(
      order.id,
      sumConfirmedPayments(payments.filter((payment) => payment.orderId === order.id))
    );
  }

  const notifications = buildWorkshopNotifications(
    orders.filter((order) => order.workshopId === user.workshopId),
    clients,
    paymentsByOrder,
    new Date().toISOString()
  );

  return (
    <AppShell
      user={{
        name: user.fullName,
        role: ROLE_LABELS[user.role],
        email: user.email,
      }}
      notifications={notifications}
    >
      {children}
    </AppShell>
  );
}
