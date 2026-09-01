import { MessageSquare, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, type DataTableColumn } from "@/components/ui/table";
import { MobileCardList } from "@/components/ui/mobile-card-list";
import { Badge } from "@/components/ui/badge";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { getMessageLog } from "@/lib/mock-data/message-log";
import { getClients } from "@/lib/mock-data/clients";
import { getOrders } from "@/lib/mock-data/orders";
import { getPayments } from "@/lib/mock-data/payments";
import { getDocuments } from "@/lib/mock-data/documents";
import { getWorkshop } from "@/lib/mock-data/workshop";
import { formatDateFr } from "@/lib/utils/dates";
import { clientDisplayName } from "@/features/clients/types";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { matchesQuery } from "@/lib/utils/search";
import { MESSAGE_TEMPLATES } from "@/features/messaging/templates";
import { toMessagingClient, toMessagingOrder } from "@/features/messaging/hub-data";
import type { MessageLogEntry, MessageTemplateKey } from "@/features/messaging/types";
import { MessagesHubClient } from "./_components/messages-hub-client";
import { requireCurrentUser } from "@/lib/auth/session";

interface MessageLogRow {
  log: MessageLogEntry;
  clientName: string;
  clientPhone: string;
  templateLabel: string;
}

const MESSAGE_LOG_COLUMNS: DataTableColumn<MessageLogRow>[] = [
  {
    key: "date",
    label: "Date & heure",
    emphasis: true,
    render: (row) => (
      <span className="text-xs font-semibold text-text">{formatDateFr(row.log.sentAt)}</span>
    ),
  },
  {
    key: "client",
    label: "Destinataire",
    render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-text">{row.clientName}</span>
        <span className="text-xs text-text-muted">{formatPhoneDisplay(row.clientPhone)}</span>
      </div>
    ),
  },
  {
    key: "template",
    label: "Modèle",
    render: (row) => (
      <Badge tone="info" className="text-xs">
        {row.templateLabel}
      </Badge>
    ),
  },
  {
    key: "body",
    label: "Contenu envoyé",
    render: (row) => (
      <p className="max-w-xs truncate text-xs text-text-muted" title={row.log.resolvedBody}>
        {row.log.resolvedBody}
      </p>
    ),
  },
];

const TEMPLATE_KEYS = new Set(MESSAGE_TEMPLATES.map((t) => t.key));

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; client?: string; commande?: string; modele?: string }>;
}) {
  const { q, client: clientParam, commande, modele } = await searchParams;
  const query = q?.trim() ?? "";

  // Toute lecture métier est portée par l'atelier du demandeur : la sécurité ne
  // repose pas seulement sur RLS côté base, elle est déjà exprimée ici.
  const user = await requireCurrentUser();
  const [logs, clients, orders, payments, documents, workshop] = await Promise.all([
    getMessageLog(user.workshopId),
    getClients(user.workshopId),
    getOrders(user.workshopId),
    getPayments(user.workshopId),
    getDocuments(user.workshopId),
    getWorkshop(),
  ]);

  const clientMap = new Map(clients.map((c) => [c.id, c]));
  const templateMap = new Map(MESSAGE_TEMPLATES.map((t) => [t.key, t.label]));

  // Montants calculés ici, jamais dans le navigateur, et champs réduits à ce que
  // l'écran affiche (PROJECT_RULES.md §6 et §7).
  const messagingClients = clients.map(toMessagingClient);
  const messagingOrders = orders.map((order) => toMessagingOrder(order, payments, documents));

  const allRows: MessageLogRow[] = logs
    .map((log) => {
      const client = clientMap.get(log.clientId);
      return {
        log,
        clientName: client ? clientDisplayName(client) : "Client",
        clientPhone: client?.phone ?? "",
        templateLabel: templateMap.get(log.templateKey) || log.templateKey,
      };
    })
    .sort((a, b) => new Date(b.log.sentAt).getTime() - new Date(a.log.sentAt).getTime());

  const logRows = allRows.filter((row) =>
    matchesQuery([row.clientName, row.clientPhone, row.templateLabel, row.log.resolvedBody], query)
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Relances WhatsApp"
        description="Préparez un message à partir des données réelles de la commande, puis envoyez-le sur WhatsApp."
      />

      <MessagesHubClient
        clients={messagingClients}
        orders={messagingOrders}
        workshop={{ name: workshop.name, whatsappPhone: workshop.whatsappPhone }}
        initialClientId={clientParam}
        initialOrderId={commande}
        initialTemplateKey={
          modele && TEMPLATE_KEYS.has(modele as MessageTemplateKey)
            ? (modele as MessageTemplateKey)
            : undefined
        }
      />

      <div className="space-y-4 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-primary-800" />
          <h2 className="text-base font-bold text-text">Messages envoyés</h2>
        </div>

        <ListToolbar
          searchParam="q"
          searchValue={query}
          searchLabel="Rechercher un message envoyé"
          searchPlaceholder="Client, numéro ou contenu"
          resultCount={logRows.length}
          totalCount={allRows.length}
          noun={["message", "messages"]}
        />

        {logRows.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="size-6" />}
            title={query ? "Aucun message ne correspond." : "Aucun message envoyé pour l'instant."}
            description={
              query
                ? "Essayez un autre nom ou un autre mot du message."
                : "Les messages envoyés depuis Fildor apparaîtront ici, avec leur contenu exact."
            }
          />
        ) : (
          <>
            <div className="hidden md:block">
              <Table columns={MESSAGE_LOG_COLUMNS} data={logRows} getRowKey={(r) => r.log.id} />
            </div>
            <div className="md:hidden">
              <MobileCardList
                columns={MESSAGE_LOG_COLUMNS}
                data={logRows}
                getRowKey={(r) => r.log.id}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
