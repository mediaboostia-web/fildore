import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Table } from "@/components/ui/table";
import type { DataTableColumn } from "@/components/ui/table";
import { MobileCardList } from "@/components/ui/mobile-card-list";
import { Badge } from "@/components/ui/badge";
import { getClients } from "@/lib/mock-data/clients";
import { clientDisplayName } from "@/features/clients/types";
import type { Client } from "@/features/clients/types";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { matchesQuery } from "@/lib/utils/search";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { LinkButton } from "@/components/ui/link-button";

/**
 * Config de colonnes unique, partagée entre `Table` (desktop) et
 * `MobileCardList` (mobile) — voir components/ui/table.tsx `DataTableColumn`.
 */
const CLIENT_COLUMNS: DataTableColumn<Client>[] = [
  {
    key: "name",
    label: "Client",
    emphasis: true,
    render: (client) => clientDisplayName(client),
  },
  {
    key: "phone",
    label: "Téléphone",
    render: (client) => formatPhoneDisplay(client.phone),
  },
  {
    key: "location",
    label: "Ville / Quartier",
    render: (client) => (client.district ? `${client.city} · ${client.district}` : client.city),
  },
  {
    key: "tags",
    label: "Tags",
    render: (client) =>
      client.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {client.tags.map((tag) => (
            <Badge key={tag} tone="neutral">
              {tag}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-text-subtle">—</span>
      ),
  },
];

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ville?: string }>;
}) {
  const { q, ville } = await searchParams;
  const query = q?.trim() ?? "";
  const cityFilter = ville?.trim() ?? "all";

  let allClients: Client[] = [];
  let loadFailed = false;
  try {
    allClients = await getClients();
  } catch {
    loadFailed = true;
  }

  const searchedClients = allClients.filter((client) =>
    matchesQuery(
      [client.firstName, client.lastName, client.phone, client.city, client.district, ...client.tags],
      query
    )
  );

  // Les villes proposées viennent des clients réellement enregistrés : pas de
  // liste figée qui proposerait des filtres sans résultat.
  const cityCounts = new Map<string, number>();
  for (const client of searchedClients) {
    cityCounts.set(client.city, (cityCounts.get(client.city) ?? 0) + 1);
  }

  const filterChips = [
    { key: "all", label: "Toutes les villes", count: searchedClients.length },
    ...[...cityCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"))
      .map(([city, count]) => ({ key: city, label: city, count })),
  ];

  const clients =
    cityFilter === "all"
      ? searchedClients
      : searchedClients.filter((client) => client.city === cityFilter);

  return (
    <>
      <PageHeader
        title="Clients"
        description="Retrouvez et gérez les clients de votre atelier."
        action={
          <LinkButton href="/clients/nouveau" icon={<Plus className="size-4" aria-hidden="true" />}>
            Nouveau client
          </LinkButton>
        }
      />

      <ListToolbar
        searchParam="q"
        searchValue={query}
        searchLabel="Rechercher un client"
        searchPlaceholder="Nom, numéro, ville ou quartier"
        filterParam="ville"
        filterValue={cityFilter}
        filters={filterChips}
        resultCount={clients.length}
        totalCount={allClients.length}
        noun={["client", "clients"]}
      />

      {loadFailed ? (
        <ErrorState
          description="La liste des clients ne s'est pas chargée. Vérifiez votre connexion, puis réessayez."
          action={
            <LinkButton href="/clients" variant="secondary">
              Réessayer
            </LinkButton>
          }
        />
      ) : clients.length === 0 ? (
        <EmptyState
          icon={<Users className="size-6" aria-hidden="true" />}
          title={
            query || cityFilter !== "all"
              ? "Aucun client ne correspond à cette recherche."
              : "Aucun client pour l'instant."
          }
          description={
            query || cityFilter !== "all"
              ? "Essayez un autre nom, un autre numéro, ou choisissez « Toutes les villes »."
              : "Ajoutez votre premier client pour commencer à suivre ses commandes et ses mesures."
          }
          action={
            <LinkButton href="/clients/nouveau" icon={<Plus className="size-4" aria-hidden="true" />}>
              Créer un client
            </LinkButton>
          }
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Table
              columns={CLIENT_COLUMNS}
              data={clients}
              getRowKey={(client) => client.id}
              getRowHref={(client) => `/clients/${client.id}`}
            />
          </div>
          <div className="md:hidden">
            <MobileCardList
              columns={CLIENT_COLUMNS}
              data={clients}
              getRowKey={(client) => client.id}
              getRowHref={(client) => `/clients/${client.id}`}
            />
          </div>
        </>
      )}
    </>
  );
}
