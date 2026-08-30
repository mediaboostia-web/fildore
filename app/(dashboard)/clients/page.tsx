import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Table } from "@/components/ui/table";
import type { DataTableColumn } from "@/components/ui/table";
import { MobileCardList } from "@/components/ui/mobile-card-list";
import { Badge } from "@/components/ui/badge";
import { searchClients } from "@/lib/mock-data/clients";
import { clientDisplayName } from "@/features/clients/types";
import type { Client } from "@/features/clients/types";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { ClientSearchBar } from "./_components/client-search-bar";
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
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let clients: Client[] = [];
  let loadFailed = false;
  try {
    clients = await searchClients(query);
  } catch {
    loadFailed = true;
  }

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

      <div className="mb-4 max-w-md">
        <ClientSearchBar defaultValue={query} />
      </div>

      {loadFailed ? (
        <ErrorState
          description="Impossible de charger les clients. Vérifiez votre connexion puis réessayez."
          action={
            <LinkButton href="/clients" variant="secondary">
              Réessayer
            </LinkButton>
          }
        />
      ) : clients.length === 0 ? (
        <EmptyState
          icon={<Users className="size-6" aria-hidden="true" />}
          title={query ? "Aucun client ne correspond à cette recherche." : "Aucun client pour l'instant."}
          description={
            query
              ? "Essayez un autre nom ou numéro de téléphone."
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
