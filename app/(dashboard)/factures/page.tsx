import { FileText, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, type DataTableColumn } from "@/components/ui/table";
import { MobileCardList } from "@/components/ui/mobile-card-list";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { getDocuments } from "@/lib/mock-data/documents";
import { getOrders } from "@/lib/mock-data/orders";
import { getClients } from "@/lib/mock-data/clients";
import { formatAmount } from "@/lib/money/format";
import { formatDateFr } from "@/lib/utils/dates";
import { matchesQuery } from "@/lib/utils/search";
import { clientDisplayName } from "@/features/clients/types";
import {
  DOCUMENT_TYPE_LABELS,
  type DocumentType,
  type WorkshopDocument,
} from "@/features/invoices/types";

interface DocumentRow {
  doc: WorkshopDocument;
  clientName: string;
  orderReference: string;
}

/** Regroupements du filtre : ce que le couturier cherche, pas la liste brute des types. */
const DOCUMENT_FILTERS: { key: string; label: string; types: DocumentType[] }[] = [
  { key: "all", label: "Tous", types: [] },
  { key: "devis", label: "Devis", types: ["devis"] },
  { key: "bon_commande", label: "Bons de commande", types: ["bon_commande"] },
  { key: "facture", label: "Factures", types: ["facture"] },
  { key: "recu", label: "Reçus", types: ["recu_acompte", "recu_paiement"] },
  { key: "bon_livraison", label: "Bons de livraison", types: ["bon_livraison"] },
];

function matchesDocumentFilter(doc: WorkshopDocument, filterKey: string): boolean {
  const definition = DOCUMENT_FILTERS.find((f) => f.key === filterKey);
  if (!definition || definition.types.length === 0) return true;
  return definition.types.includes(doc.type);
}

const DOCUMENT_COLUMNS: DataTableColumn<DocumentRow>[] = [
  {
    key: "number",
    label: "N° Document",
    emphasis: true,
    render: (row) => (
      <div className="flex flex-col">
        <span className="font-semibold text-primary-900">{row.doc.number}</span>
        <span className="text-xs text-text-muted">{formatDateFr(row.doc.issuedAt)}</span>
      </div>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: (row) => {
      const isInvoice = row.doc.type === "facture";
      const isReceipt = row.doc.type === "recu_acompte" || row.doc.type === "recu_paiement";
      return (
        <Badge tone={isInvoice ? "info" : isReceipt ? "success" : "neutral"} className="text-xs">
          {DOCUMENT_TYPE_LABELS[row.doc.type] || row.doc.type}
        </Badge>
      );
    },
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
      <span className="text-xs font-semibold text-text-muted">{row.orderReference}</span>
    ),
  },
  {
    key: "amount",
    label: "Montant total / Solde",
    render: (row) => (
      <div className="flex flex-col">
        <span className="font-semibold text-text">{formatAmount(row.doc.totalAmount)}</span>
        {row.doc.balanceAmount > 0 ? (
          <span className="text-xs font-medium text-danger">
            Reste {formatAmount(row.doc.balanceAmount)}
          </span>
        ) : (
          <span className="text-xs font-medium text-success">Soldé</span>
        )}
      </div>
    ),
  },
  {
    key: "actions",
    label: "Action",
    render: (row) => (
      <LinkButton
        href={`/factures/${row.doc.id}`}
        size="sm"
        variant="secondary"
        icon={<Eye className="size-3.5" />}
      >
        Ouvrir
      </LinkButton>
    ),
  },
];

export default async function FacturesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; orderId?: string }>;
}) {
  const { q, type, orderId } = await searchParams;
  const query = q?.trim() ?? "";
  const typeFilter = type?.trim() || "all";

  const [documents, orders, clients] = await Promise.all([
    getDocuments(),
    getOrders(),
    getClients(),
  ]);

  const clientMap = new Map(clients.map((c) => [c.id, c]));
  const orderMap = new Map(orders.map((o) => [o.id, o]));
  const scopedOrder = orderId ? orderMap.get(orderId) : undefined;

  const allRows: DocumentRow[] = documents
    .filter((doc) => !orderId || doc.orderId === orderId)
    .map((doc) => {
      const client = clientMap.get(doc.clientId);
      const order = orderMap.get(doc.orderId);
      return {
        doc,
        clientName: client ? clientDisplayName(client) : "Client",
        orderReference: order ? order.reference : "—",
      };
    })
    .sort((a, b) => new Date(b.doc.issuedAt).getTime() - new Date(a.doc.issuedAt).getTime());

  const searchedRows = allRows.filter((row) =>
    matchesQuery(
      [
        row.doc.number,
        row.clientName,
        row.orderReference,
        DOCUMENT_TYPE_LABELS[row.doc.type],
      ],
      query
    )
  );

  const filterChips = DOCUMENT_FILTERS.map((definition) => ({
    key: definition.key,
    label: definition.label,
    count: searchedRows.filter((row) => matchesDocumentFilter(row.doc, definition.key)).length,
  })).filter((chip) => chip.key === "all" || chip.count > 0);

  const rows = searchedRows.filter((row) => matchesDocumentFilter(row.doc, typeFilter));

  return (
    <div>
      <PageHeader
        title="Factures"
        description={
          scopedOrder
            ? `Documents émis pour la commande ${scopedOrder.reference}.`
            : "Devis, bons de commande, reçus et factures de l'atelier."
        }
        action={
          scopedOrder ? (
            <LinkButton href="/factures" variant="secondary">
              Voir tous les documents
            </LinkButton>
          ) : undefined
        }
      />

      <ListToolbar
        searchParam="q"
        searchValue={query}
        searchLabel="Rechercher un document"
        searchPlaceholder="N° de document, client ou commande"
        filterParam="type"
        filterValue={typeFilter}
        filters={filterChips}
        resultCount={rows.length}
        totalCount={allRows.length}
        noun={["document", "documents"]}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<FileText className="size-6" />}
          title={
            query || typeFilter !== "all"
              ? "Aucun document ne correspond à cette recherche."
              : "Aucun document émis."
          }
          description={
            query || typeFilter !== "all"
              ? "Essayez un autre numéro ou un autre nom, ou choisissez « Tous »."
              : "Les devis, reçus et factures générés depuis vos commandes apparaîtront ici."
          }
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Table
              columns={DOCUMENT_COLUMNS}
              data={rows}
              getRowKey={(r) => r.doc.id}
              getRowHref={(r) => `/factures/${r.doc.id}`}
            />
          </div>
          <div className="md:hidden">
            <MobileCardList
              columns={DOCUMENT_COLUMNS}
              data={rows}
              getRowKey={(r) => r.doc.id}
              getRowHref={(r) => `/factures/${r.doc.id}`}
            />
          </div>
        </>
      )}
    </div>
  );
}
