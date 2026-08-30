import Link from "next/link";
import { CreditCard, Wallet, Smartphone, Banknote } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, type DataTableColumn } from "@/components/ui/table";
import { MobileCardList } from "@/components/ui/mobile-card-list";
import { Badge } from "@/components/ui/badge";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { getPayments } from "@/lib/mock-data/payments";
import { getOrders } from "@/lib/mock-data/orders";
import { getClients } from "@/lib/mock-data/clients";
import { formatAmount } from "@/lib/money/format";
import { formatDateFr } from "@/lib/utils/dates";
import { matchesQuery } from "@/lib/utils/search";
import { clientDisplayName } from "@/features/clients/types";
import { PAYMENT_METHOD_LABELS, type Payment, type PaymentMethod } from "@/features/payments/types";

interface PaymentRow {
  payment: Payment;
  clientName: string;
  orderReference: string;
}

/** Moyens de paiement regroupés comme l'atelier les compte : caisse d'un côté, mobile de l'autre. */
const MOBILE_MONEY_METHODS: readonly PaymentMethod[] = [
  "mtn_momo",
  "moov_money",
  "orange_money",
  "wave",
];

const PAYMENT_FILTERS: { key: string; label: string; methods: readonly PaymentMethod[] }[] = [
  { key: "all", label: "Tous", methods: [] },
  { key: "especes", label: "Espèces", methods: ["especes"] },
  { key: "mobile_money", label: "Mobile Money", methods: MOBILE_MONEY_METHODS },
  { key: "virement", label: "Virement", methods: ["virement"] },
  { key: "carte", label: "Carte", methods: ["carte"] },
  {
    key: "autre",
    label: "Autres",
    methods: ["paiement_livraison", "autre"],
  },
];

function matchesPaymentFilter(payment: Payment, filterKey: string): boolean {
  const definition = PAYMENT_FILTERS.find((f) => f.key === filterKey);
  if (!definition || definition.methods.length === 0) return true;
  return definition.methods.includes(payment.method);
}

const PAYMENT_COLUMNS: DataTableColumn<PaymentRow>[] = [
  {
    key: "receipt",
    label: "N° Reçu",
    emphasis: true,
    render: (row) => (
      <div className="flex flex-col">
        <span className="font-semibold text-primary-900">{row.payment.receiptNumber}</span>
        <span className="text-xs text-text-muted">{formatDateFr(row.payment.createdAt)}</span>
      </div>
    ),
  },
  {
    key: "client",
    label: "Client",
    render: (row) => <span className="font-medium text-text">{row.clientName}</span>,
  },
  {
    key: "order",
    label: "Commande",
    render: (row) => (
      <Link
        href={`/commandes/${row.payment.orderId}`}
        className="text-xs font-semibold text-primary-800 hover:underline"
      >
        {row.orderReference}
      </Link>
    ),
  },
  {
    key: "method",
    label: "Moyen",
    render: (row) => (
      <Badge tone="info" className="text-xs">
        {PAYMENT_METHOD_LABELS[row.payment.method] || row.payment.method}
      </Badge>
    ),
  },
  {
    key: "amount",
    label: "Montant",
    render: (row) => (
      <span className="font-bold text-success text-sm">
        + {formatAmount(row.payment.amount)}
      </span>
    ),
  },
];

export default async function PaiementsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; method?: string }>;
}) {
  const { q, method } = await searchParams;
  const query = q?.trim() ?? "";
  const methodFilter = method?.trim() || "all";

  const [payments, orders, clients] = await Promise.all([
    getPayments(),
    getOrders(),
    getClients(),
  ]);

  const clientMap = new Map(clients.map((c) => [c.id, c]));
  const orderMap = new Map(orders.map((o) => [o.id, o]));

  const rows: PaymentRow[] = payments
    .filter((p) => p.status === "confirme")
    .map((p) => {
      const client = clientMap.get(p.clientId);
      const order = orderMap.get(p.orderId);
      return {
        payment: p,
        clientName: client ? clientDisplayName(client) : "Client inconnu",
        orderReference: order ? order.reference : "—",
      };
    })
    .sort((a, b) => new Date(b.payment.createdAt).getTime() - new Date(a.payment.createdAt).getTime());

  const searchedRows = rows.filter((row) =>
    matchesQuery(
      [
        row.payment.receiptNumber,
        row.clientName,
        row.orderReference,
        row.payment.reference,
        PAYMENT_METHOD_LABELS[row.payment.method],
      ],
      query
    )
  );

  const filterChips = PAYMENT_FILTERS.map((definition) => ({
    key: definition.key,
    label: definition.label,
    count: searchedRows.filter((row) => matchesPaymentFilter(row.payment, definition.key)).length,
  })).filter((chip) => chip.key === "all" || chip.count > 0);

  const filteredRows = searchedRows.filter((row) =>
    matchesPaymentFilter(row.payment, methodFilter)
  );

  // Statistiques
  const totalEncaissé = rows.reduce((sum, r) => sum + r.payment.amount, 0);
  const totalMomo = rows
    .filter((r) => MOBILE_MONEY_METHODS.includes(r.payment.method))
    .reduce((sum, r) => sum + r.payment.amount, 0);
  const totalEspeces = rows
    .filter((r) => r.payment.method === "especes")
    .reduce((sum, r) => sum + r.payment.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paiements & Caisse"
        description="Historique des encaissements d'acomptes et de soldes dans votre atelier."
      />

      {/* Cartes KPI Caisse */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-text-muted text-xs font-semibold uppercase tracking-wider">
            <Wallet className="size-4 text-primary-800" /> Total Encaissé
          </div>
          <p className="mt-2 text-2xl font-bold text-text">{formatAmount(totalEncaissé)}</p>
          <span className="text-xs text-text-muted">{rows.length} versements confirmés</span>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-text-muted text-xs font-semibold uppercase tracking-wider">
            <Banknote className="size-4 text-success" /> Espèces
          </div>
          <p className="mt-2 text-2xl font-bold text-success">{formatAmount(totalEspeces)}</p>
          <span className="text-xs text-text-muted">Caisse physique</span>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-text-muted text-xs font-semibold uppercase tracking-wider">
            <Smartphone className="size-4 text-info" /> Mobile Money & Autres
          </div>
          <p className="mt-2 text-2xl font-bold text-primary-900">{formatAmount(totalMomo)}</p>
          <span className="text-xs text-text-muted">MTN MoMo, Moov, Wave...</span>
        </div>
      </div>

      <ListToolbar
        searchParam="q"
        searchValue={query}
        searchLabel="Rechercher un paiement"
        searchPlaceholder="N° de reçu, client ou commande"
        filterParam="method"
        filterValue={methodFilter}
        filters={filterChips}
        resultCount={filteredRows.length}
        totalCount={rows.length}
        noun={["paiement", "paiements"]}
      />

      {filteredRows.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="size-6" />}
          title={
            query || methodFilter !== "all"
              ? "Aucun paiement ne correspond à cette recherche."
              : "Aucun paiement enregistré."
          }
          description={
            query || methodFilter !== "all"
              ? "Essayez un autre numéro de reçu ou un autre nom, ou choisissez « Tous »."
              : "Les règlements encaissés depuis une fiche de commande apparaîtront ici."
          }
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Table
              columns={PAYMENT_COLUMNS}
              data={filteredRows}
              getRowKey={(r) => r.payment.id}
            />
          </div>
          <div className="md:hidden">
            <MobileCardList
              columns={PAYMENT_COLUMNS}
              data={filteredRows}
              getRowKey={(r) => r.payment.id}
            />
          </div>
        </>
      )}
    </div>
  );
}
