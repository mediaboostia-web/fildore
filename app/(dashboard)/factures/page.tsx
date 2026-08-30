import Link from "next/link";
import { FileText, Printer } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, type DataTableColumn } from "@/components/ui/table";
import { MobileCardList } from "@/components/ui/mobile-card-list";
import { Badge } from "@/components/ui/badge";
import { getDocuments } from "@/lib/mock-data/documents";
import { getOrders } from "@/lib/mock-data/orders";
import { getClients } from "@/lib/mock-data/clients";
import { formatAmount } from "@/lib/money/format";
import { formatDateFr } from "@/lib/utils/dates";
import { clientDisplayName } from "@/features/clients/types";
import { DOCUMENT_TYPE_LABELS, type WorkshopDocument } from "@/features/invoices/types";

interface DocumentRow {
  doc: WorkshopDocument;
  clientName: string;
  orderReference: string;
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
          <span className="text-xs text-danger font-medium">Reste {formatAmount(row.doc.balanceAmount)}</span>
        ) : (
          <span className="text-xs text-success font-medium">Soldé</span>
        )}
      </div>
    ),
  },
  {
    key: "actions",
    label: "Action",
    render: (row) => (
      <Link
        href={`/factures/${row.doc.id}`}
        className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-900 hover:bg-primary-100 transition-colors"
      >
        <Printer className="size-3.5" />
        Voir & Imprimer
      </Link>
    ),
  },
];

export default async function FacturesPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  const [documents, orders, clients] = await Promise.all([
    getDocuments(),
    getOrders(),
    getClients(),
  ]);

  const clientMap = new Map(clients.map((c) => [c.id, c]));
  const orderMap = new Map(orders.map((o) => [o.id, o]));

  const rows: DocumentRow[] = documents
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Factures & Documents"
        description="Consultez, téléchargez et imprimez les devis, bons de commande et factures de l'atelier."
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<FileText className="size-6" />}
          title="Aucun document émis."
          description="Les factures, devis et reçus générés pour vos commandes apparaîtront ici."
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
