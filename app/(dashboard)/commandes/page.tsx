import { Plus, ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Table, type DataTableColumn } from "@/components/ui/table";
import { MobileCardList } from "@/components/ui/mobile-card-list";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { getOrders } from "@/lib/mock-data/orders";
import { getClients } from "@/lib/mock-data/clients";
import { getPayments } from "@/lib/mock-data/payments";
import { clientDisplayName } from "@/features/clients/types";
import type { Order } from "@/features/orders/types";
import { computeBalance } from "@/lib/money/balance";
import { formatAmount } from "@/lib/money/format";
import { formatDateFr } from "@/lib/utils/dates";
import { getOrderComputedFlags } from "@/features/orders/selectors";
import { sumConfirmedPayments } from "@/features/payments/types";
import { OrderSearchBar } from "./_components/order-search-bar";
import { OrderFilterTabs } from "./_components/order-filter-tabs";

interface OrderRowView {
  order: Order;
  clientName: string;
  clientPhone: string;
  paidAmount: number;
  balance: number;
  flags: {
    isOverdue: boolean;
    isDueToday: boolean;
    isDueSoon: boolean;
    isPaymentOverdue: boolean;
  };
}

const ORDER_COLUMNS: DataTableColumn<OrderRowView>[] = [
  {
    key: "reference",
    label: "Référence",
    emphasis: true,
    render: (row) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-primary-900">{row.order.reference}</span>
        <span className="text-xs text-text-muted">{row.order.title}</span>
      </div>
    ),
  },
  {
    key: "client",
    label: "Client",
    render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-text">{row.clientName}</span>
        <span className="text-xs text-text-muted">{row.clientPhone}</span>
      </div>
    ),
  },
  {
    key: "status",
    label: "Statut",
    render: (row) => (
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge status={row.order.status} />
        {row.flags.isOverdue && (
          <Badge tone="danger" className="text-xs">
            En retard
          </Badge>
        )}
        {row.flags.isDueToday && (
          <Badge tone="warning" className="text-xs">
            Aujourd&apos;hui
          </Badge>
        )}
      </div>
    ),
  },
  {
    key: "delivery",
    label: "Livraison",
    render: (row) => (
      <span className="text-sm text-text">
        {formatDateFr(row.order.deliveryDate)}
      </span>
    ),
  },
  {
    key: "finance",
    label: "Total / Solde",
    render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-text">{formatAmount(row.order.totalAmount)}</span>
        {row.balance > 0 ? (
          <span className="text-xs font-medium text-danger">
            Reste {formatAmount(row.balance)}
          </span>
        ) : (
          <span className="text-xs font-medium text-success">
            Payé intégralement
          </span>
        )}
      </div>
    ),
  },
];

export default async function CommandesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const query = q?.trim().toLowerCase() ?? "";
  const filter = status?.trim() ?? "all";

  let orders: Order[] = [];
  let loadFailed = false;
  let rows: OrderRowView[] = [];

  try {
    const today = new Date().toISOString().slice(0, 10);
    const [rawOrders, clients, payments] = await Promise.all([
      getOrders(),
      getClients(),
      getPayments(),
    ]);
    orders = rawOrders;

    const clientMap = new Map(clients.map((c) => [c.id, c]));

    rows = orders.map((order) => {
      const client = clientMap.get(order.clientId);
      const orderPayments = payments.filter((p) => p.orderId === order.id);
      const paidAmount = sumConfirmedPayments(orderPayments);
      const balance = computeBalance(order.totalAmount, order.discountAmount, paidAmount);
      const flags = getOrderComputedFlags(order, today, paidAmount);

      return {
        order,
        clientName: client ? clientDisplayName(client) : "Client inconnu",
        clientPhone: client?.phone ?? "",
        paidAmount,
        balance,
        flags,
      };
    });
  } catch {
    loadFailed = true;
  }

  // Filtrage
  const filteredRows = rows.filter((row) => {
    if (query) {
      const matchRef = row.order.reference.toLowerCase().includes(query);
      const matchTitle = row.order.title.toLowerCase().includes(query);
      const matchClient = row.clientName.toLowerCase().includes(query);
      const matchPhone = row.clientPhone.toLowerCase().includes(query);
      if (!matchRef && !matchTitle && !matchClient && !matchPhone) {
        return false;
      }
    }

    if (filter === "in_progress") {
      return ["confirmee", "mesures_a_prendre", "tissu_fournitures", "coupe", "couture", "essayage", "retouche", "prete"].includes(row.order.status);
    }
    if (filter === "awaiting_deposit") {
      return row.order.status === "acompte_attendu" || (row.balance > 0 && row.order.status === "brouillon");
    }
    if (filter === "due_soon") {
      return row.flags.isDueSoon || row.flags.isDueToday;
    }
    if (filter === "overdue") {
      return row.flags.isOverdue || row.flags.isPaymentOverdue;
    }
    if (filter === "completed") {
      return ["livree", "terminee"].includes(row.order.status);
    }

    return true;
  });

  return (
    <>
      <PageHeader
        title="Commandes"
        description="Suivez la production, les délais de livraison et les règlements de vos commandes."
        action={
          <LinkButton href="/commandes/nouveau/client" icon={<Plus className="size-4" aria-hidden="true" />}>
            Nouvelle commande
          </LinkButton>
        }
      />

      <div className="mb-4 flex flex-col gap-3">
        <div className="max-w-md">
          <OrderSearchBar defaultValue={query} />
        </div>
        <OrderFilterTabs currentFilter={filter} />
      </div>

      {loadFailed ? (
        <ErrorState
          description="Impossible de charger les commandes. Vérifiez votre connexion puis réessayez."
          action={
            <LinkButton href="/commandes" variant="secondary">
              Réessayer
            </LinkButton>
          }
        />
      ) : filteredRows.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="size-6" aria-hidden="true" />}
          title={query || filter !== "all" ? "Aucune commande ne correspond à ces critères." : "Aucune commande pour l'instant."}
          description={
            query || filter !== "all"
              ? "Modifiez votre recherche ou réinitialisez les filtres pour voir les autres commandes."
              : "Créez votre première commande pour planifier la confection et générer un bon de commande."
          }
          action={
            <LinkButton href="/commandes/nouveau/client" icon={<Plus className="size-4" aria-hidden="true" />}>
              Créer une commande
            </LinkButton>
          }
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Table
              columns={ORDER_COLUMNS}
              data={filteredRows}
              getRowKey={(row) => row.order.id}
              getRowHref={(row) => `/commandes/${row.order.id}`}
            />
          </div>
          <div className="md:hidden">
            <MobileCardList
              columns={ORDER_COLUMNS}
              data={filteredRows}
              getRowKey={(row) => row.order.id}
              getRowHref={(row) => `/commandes/${row.order.id}`}
            />
          </div>
        </>
      )}
    </>
  );
}
