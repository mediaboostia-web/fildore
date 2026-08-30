import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Clock,
  MessageSquare,
  Plus,
  Receipt,
  Scissors,
  UserPlus,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getOrders } from "@/lib/mock-data/orders";
import { getClients } from "@/lib/mock-data/clients";
import { getPayments } from "@/lib/mock-data/payments";
import { computeBalance } from "@/lib/money/balance";
import { formatAmount } from "@/lib/money/format";
import { formatDateFr } from "@/lib/utils/dates";
import { clientDisplayName } from "@/features/clients/types";
import { getOrderComputedFlags } from "@/features/orders/selectors";
import { sumConfirmedPayments } from "@/features/payments/types";

export default async function TableauDeBordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const today = new Date().toISOString().slice(0, 10);
  const [orders, clients, payments] = await Promise.all([
    getOrders(),
    getClients(),
    getPayments(),
  ]);

  const clientMap = new Map(clients.map((c) => [c.id, c]));

  // Calculs financiers et flags pour chaque commande
  const orderDetails = orders.map((order) => {
    const client = clientMap.get(order.clientId);
    const orderPayments = payments.filter((p) => p.orderId === order.id);
    const paidAmount = sumConfirmedPayments(orderPayments);
    const balance = computeBalance(order.totalAmount, order.discountAmount, paidAmount);
    const flags = getOrderComputedFlags(order, today, paidAmount);

    return {
      order,
      client,
      paidAmount,
      balance,
      flags,
    };
  });

  // KPIs
  const activeOrders = orderDetails.filter(
    (o) => !["livree", "terminee", "annulee"].includes(o.order.status)
  );
  const overdueOrders = orderDetails.filter((o) => o.flags.isOverdue);
  const dueSoonOrders = orderDetails.filter((o) => o.flags.isDueToday || o.flags.isDueSoon);
  const totalBalanceDue = orderDetails.reduce((sum, o) => sum + Math.max(0, o.balance), 0);

  // Alertes prioritaires
  const urgentOrders = [...overdueOrders, ...dueSoonOrders].slice(0, 5);

  // Dernières commandes
  const recentOrders = [...orderDetails]
    .sort((a, b) => new Date(b.order.createdAt).getTime() - new Date(a.order.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description={`Bienvenue, ${user.fullName.split(" ")[0]}. Voici l'activité de l'atelier aujourd'hui.`}
      />

      {/* Cartes KPI Principales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Commandes en cours */}
        <Link
          href="/commandes?status=in_progress"
          className="group rounded-lg border border-border bg-surface p-4 shadow-sm transition-all hover:border-primary-800 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              En production
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-primary-50 text-primary-800">
              <Scissors className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-text">{activeOrders.length}</p>
          <span className="text-xs text-text-muted mt-1 block group-hover:text-primary-800">
            Voir les commandes en cours &rarr;
          </span>
        </Link>

        {/* À livrer sous 3 jours */}
        <Link
          href="/commandes?status=due_soon"
          className="group rounded-lg border border-border bg-surface p-4 shadow-sm transition-all hover:border-warning hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              À livrer bientôt
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-warning-bg text-warning">
              <Clock className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-text">{dueSoonOrders.length}</p>
          <span className="text-xs text-text-muted mt-1 block group-hover:text-warning">
            Échéances sous 3 jours &rarr;
          </span>
        </Link>

        {/* Commandes en retard */}
        <Link
          href="/commandes?status=overdue"
          className="group rounded-lg border border-border bg-surface p-4 shadow-sm transition-all hover:border-danger hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              En retard
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-danger-bg text-danger">
              <AlertTriangle className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-danger">{overdueOrders.length}</p>
          <span className="text-xs text-text-muted mt-1 block group-hover:text-danger">
            {overdueOrders.length > 0 ? "Action urgente requise !" : "Aucun retard en atelier"}
          </span>
        </Link>

        {/* Solde restant à encaisser */}
        <Link
          href="/commandes?status=awaiting_deposit"
          className="group rounded-lg border border-border bg-surface p-4 shadow-sm transition-all hover:border-primary-800 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Solde à encaisser
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-primary-100 text-primary-900">
              <Wallet className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-primary-900 truncate">
            {formatAmount(totalBalanceDue)}
          </p>
          <span className="text-xs text-text-muted mt-1 block group-hover:text-primary-800">
            Acomptes & soldes restants &rarr;
          </span>
        </Link>
      </div>

      {/* Alertes d'urgence : Commandes à traiter en priorité */}
      {urgentOrders.length > 0 && (
        <div className="rounded-lg border border-warning/40 bg-warning-bg/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-warning" />
              <h2 className="font-bold text-sm text-text">Commandes urgentes & Délais proches</h2>
            </div>
            <span className="text-xs text-text-muted">{urgentOrders.length} commandes prioritaires</span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {urgentOrders.map(({ order, client, balance, flags }) => (
              <Link
                key={order.id}
                href={`/commandes/${order.id}`}
                className="flex flex-col justify-between rounded-md border border-border bg-surface p-3 transition-all hover:shadow-sm hover:border-primary-800"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-primary-900">{order.reference}</span>
                    {flags.isOverdue ? (
                      <Badge tone="danger" className="text-[10px]">
                        En retard
                      </Badge>
                    ) : (
                      <Badge tone="warning" className="text-[10px]">
                        Livraison imminente
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium text-text mt-1 truncate">{order.title}</p>
                  <p className="text-xs text-text-muted">
                    Client : {client ? clientDisplayName(client) : "—"}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-xs">
                  <span className="text-text-muted">Pour le {formatDateFr(order.deliveryDate)}</span>
                  {balance > 0 ? (
                    <span className="font-semibold text-danger">Reste {formatAmount(balance)}</span>
                  ) : (
                    <span className="font-semibold text-success">Payé</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Raccourcis d'actions & Dernières commandes */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne 1 & 2 : Dernières commandes passées */}
        <div className="rounded-lg border border-border bg-surface p-5 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-bold text-base text-text">Dernières commandes</h2>
            <LinkButton href="/commandes" variant="tertiary" size="sm">
              Voir tout
            </LinkButton>
          </div>

          {recentOrders.length === 0 ? (
            <EmptyState
              title="Aucune commande récente."
              description="Créez votre première commande pour lancer l'activité de l'atelier."
            />
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map(({ order, client, balance }) => (
                <Link
                  key={order.id}
                  href={`/commandes/${order.id}`}
                  className="flex items-center justify-between py-3 px-2 rounded transition-colors hover:bg-canvas/60"
                >
                  <div className="flex flex-col gap-0.5 max-w-[65%]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-primary-900">{order.reference}</span>
                      <StatusBadge status={order.status} className="text-[10px]" />
                    </div>
                    <p className="font-medium text-sm text-text truncate">{order.title}</p>
                    <p className="text-xs text-text-muted">
                      {client ? clientDisplayName(client) : "—"} · Livraison {formatDateFr(order.deliveryDate)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-semibold text-sm text-text block">
                      {formatAmount(order.totalAmount)}
                    </span>
                    {balance > 0 ? (
                      <span className="text-xs text-danger">Reste {formatAmount(balance)}</span>
                    ) : (
                      <span className="text-xs text-success">Soldé</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Colonne 3 : Actions rapides & Accès métier */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h2 className="font-bold text-xs uppercase tracking-wider text-text">
                Actions rapides
              </h2>
              <span className="text-[11px] font-semibold text-text-subtle">Atelier</span>
            </div>

            <div className="space-y-2.5">
              {/* Action 1 : Nouvelle commande */}
              <Link
                href="/commandes/nouveau/client"
                className="group flex items-center justify-between rounded-xl bg-primary-900 px-3.5 py-3 text-white shadow-xs hover:bg-primary-800 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                    <Plus className="size-4.5" />
                  </div>
                  <span className="text-sm font-semibold">Nouvelle commande</span>
                </div>
                <ArrowRight className="size-4 text-white/70 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Action 2 : Nouveau client */}
              <Link
                href="/clients/nouveau"
                className="group flex items-center justify-between rounded-xl border border-border bg-surface-muted/50 px-3.5 py-2.5 text-text hover:bg-surface hover:border-primary-800/60 hover:shadow-xs active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-900 border border-primary-100">
                    <UserPlus className="size-4" />
                  </div>
                  <span className="text-sm font-medium text-text group-hover:text-primary-950">Nouveau client</span>
                </div>
                <ChevronRight className="size-4 text-text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-primary-900" />
              </Link>

              {/* Action 3 : Envoyer un WhatsApp */}
              <Link
                href="/messages"
                className="group flex items-center justify-between rounded-xl border border-border bg-surface-muted/50 px-3.5 py-2.5 text-text hover:bg-surface hover:border-[#25D366]/60 hover:shadow-xs active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E7F7EE] text-[#128C7E] border border-[#25D366]/20">
                    <MessageSquare className="size-4" />
                  </div>
                  <span className="text-sm font-medium text-text group-hover:text-primary-950">Envoyer un WhatsApp</span>
                </div>
                <ChevronRight className="size-4 text-text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-primary-900" />
              </Link>

              {/* Action 4 : Factures & Documents */}
              <Link
                href="/factures"
                className="group flex items-center justify-between rounded-xl border border-border bg-surface-muted/50 px-3.5 py-2.5 text-text hover:bg-surface hover:border-primary-800/60 hover:shadow-xs active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-900 border border-primary-100">
                    <Receipt className="size-4" />
                  </div>
                  <span className="text-sm font-medium text-text group-hover:text-primary-950">Factures & Documents</span>
                </div>
                <ChevronRight className="size-4 text-text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-primary-900" />
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-primary-200 bg-primary-50/40 p-4 space-y-2">
            <h3 className="font-semibold text-xs text-primary-950 uppercase tracking-wider">
              Conseil opérationnel Fildor
            </h3>
            <p className="text-xs text-primary-900">
              Enregistrez systématiquement vos acomptes dès la prise de commande pour sécuriser l&apos;achat
              des tissus et fournitures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
