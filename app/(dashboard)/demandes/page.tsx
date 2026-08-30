import { Inbox } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, type DataTableColumn } from "@/components/ui/table";
import { MobileCardList } from "@/components/ui/mobile-card-list";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { requireCurrentUser } from "@/lib/auth/session";
import { can } from "@/features/auth/permissions";
import { getOrderRequests } from "@/lib/mock-data/order-requests";
import { getWorkshop } from "@/lib/mock-data/workshop";
import { formatDateFr } from "@/lib/utils/dates";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { matchesQuery } from "@/lib/utils/search";
import {
  ORDER_REQUEST_STATUS_LABELS,
  requestDisplayName,
  type OrderRequest,
  type OrderRequestStatus,
} from "@/features/public-orders/types";
import { OnlineOrderingClosedNotice } from "./_components/closed-notice";

const STATUS_TONE: Record<OrderRequestStatus, "warning" | "success" | "neutral"> = {
  nouvelle: "warning",
  acceptee: "success",
  refusee: "neutral",
};

const REQUEST_COLUMNS: DataTableColumn<OrderRequest>[] = [
  {
    key: "client",
    label: "Demandeur",
    emphasis: true,
    render: (request) => (
      <div className="flex flex-col">
        <span className="font-semibold text-text">{requestDisplayName(request)}</span>
        <span className="text-xs text-text-muted">{formatPhoneDisplay(request.phone)}</span>
      </div>
    ),
  },
  {
    key: "model",
    label: "Modèle demandé",
    render: (request) => (
      <span className="text-sm text-text">
        {request.catalogItemName ?? "Tenue décrite dans le message"}
      </span>
    ),
  },
  {
    key: "desired",
    label: "Date souhaitée",
    render: (request) => (
      <span className="text-sm text-text">
        {request.desiredDate ? formatDateFr(request.desiredDate) : "Non précisée"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Statut",
    render: (request) => (
      <Badge tone={STATUS_TONE[request.status]} className="text-xs">
        {ORDER_REQUEST_STATUS_LABELS[request.status]}
      </Badge>
    ),
  },
  {
    key: "submitted",
    label: "Reçue le",
    render: (request) => (
      <span className="text-xs text-text-muted">{formatDateFr(request.submittedAt)}</span>
    ),
  },
];

const STATUS_FILTERS: { key: string; label: string; status?: OrderRequestStatus }[] = [
  { key: "all", label: "Toutes" },
  { key: "nouvelle", label: "À traiter", status: "nouvelle" },
  { key: "acceptee", label: "Acceptées", status: "acceptee" },
  { key: "refusee", label: "Refusées", status: "refusee" },
];

export default async function DemandesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; statut?: string }>;
}) {
  const { q, statut } = await searchParams;
  const query = q?.trim() ?? "";
  const statusFilter = statut?.trim() || "all";

  const user = await requireCurrentUser();
  const [requests, workshop] = await Promise.all([
    getOrderRequests(user.workshopId),
    getWorkshop(),
  ]);

  const searchedRequests = requests.filter((request) =>
    matchesQuery(
      [
        request.firstName,
        request.lastName,
        request.phone,
        request.city,
        request.district,
        request.catalogItemName,
        request.note,
      ],
      query
    )
  );

  const filterChips = STATUS_FILTERS.map((definition) => ({
    key: definition.key,
    label: definition.label,
    count: definition.status
      ? searchedRequests.filter((r) => r.status === definition.status).length
      : searchedRequests.length,
  }));

  const rows =
    statusFilter === "all"
      ? searchedRequests
      : searchedRequests.filter((request) => request.status === statusFilter);

  const canReview = can(user.role, "demande:traiter");

  return (
    <div>
      <PageHeader
        title="Demandes en ligne"
        description="Les demandes envoyées depuis votre page publique. Aucune n'est une commande tant que vous ne l'avez pas acceptée."
        action={
          <LinkButton href="/parametres#commandes-en-ligne" variant="secondary">
            Régler ma page publique
          </LinkButton>
        }
      />

      {!workshop.onlineOrdering.enabled ? (
        <OnlineOrderingClosedNotice />
      ) : null}

      <ListToolbar
        searchParam="q"
        searchValue={query}
        searchLabel="Rechercher une demande"
        searchPlaceholder="Nom, numéro ou modèle"
        filterParam="statut"
        filterValue={statusFilter}
        filters={filterChips}
        resultCount={rows.length}
        totalCount={requests.length}
        noun={["demande", "demandes"]}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-6" />}
          title={
            query || statusFilter !== "all"
              ? "Aucune demande ne correspond à cette recherche."
              : "Aucune demande reçue pour l'instant."
          }
          description={
            query || statusFilter !== "all"
              ? "Essayez un autre nom, ou choisissez « Toutes »."
              : "Partagez le lien de votre page publique : les demandes de vos clients arriveront ici."
          }
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Table
              columns={REQUEST_COLUMNS}
              data={rows}
              getRowKey={(request) => request.id}
              getRowHref={canReview ? (request) => `/demandes/${request.id}` : undefined}
            />
          </div>
          <div className="md:hidden">
            <MobileCardList
              columns={REQUEST_COLUMNS}
              data={rows}
              getRowKey={(request) => request.id}
              getRowHref={canReview ? (request) => `/demandes/${request.id}` : undefined}
            />
          </div>
        </>
      )}
    </div>
  );
}
