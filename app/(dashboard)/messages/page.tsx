import { MessageSquare, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, type DataTableColumn } from "@/components/ui/table";
import { MobileCardList } from "@/components/ui/mobile-card-list";
import { Badge } from "@/components/ui/badge";
import { getMessageLog } from "@/lib/mock-data/message-log";
import { getClients } from "@/lib/mock-data/clients";
import { getOrders } from "@/lib/mock-data/orders";
import { formatDateFr } from "@/lib/utils/dates";
import { clientDisplayName } from "@/features/clients/types";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { MESSAGE_TEMPLATES } from "@/features/messaging/templates";
import type { MessageLogEntry } from "@/features/messaging/types";
import { MessagesHubClient } from "./_components/messages-hub-client";

interface MessageLogRow {
  log: MessageLogEntry;
  clientName: string;
  clientPhone: string;
  templateLabel: string;
}

const MESSAGE_LOG_COLUMNS: DataTableColumn<MessageLogRow>[] = [
  {
    key: "date",
    label: "Date & Heure",
    emphasis: true,
    render: (row) => (
      <span className="text-xs font-semibold text-text">
        {formatDateFr(row.log.sentAt)}
      </span>
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

export default async function MessagesPage() {
  const [logs, clients, orders] = await Promise.all([
    getMessageLog(),
    getClients(),
    getOrders(),
  ]);

  const clientMap = new Map(clients.map((c) => [c.id, c]));
  const templateMap = new Map(MESSAGE_TEMPLATES.map((t) => [t.key, t.label]));

  const logRows: MessageLogRow[] = logs
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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Messagerie WhatsApp"
        description="Préparez et envoyez des messages professionnels personnalisés à vos clients via WhatsApp."
      />

      {/* Hub interactif de composition de messages */}
      <MessagesHubClient clients={clients} orders={orders} />

      {/* Historique des envois */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-primary-800" />
          <h2 className="font-bold text-base text-text">Journal des messages envoyés</h2>
        </div>

        {logRows.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="size-6" />}
            title="Aucun message enregistré pour le moment."
            description="Les messages envoyés depuis l'application apparaîtront ici pour assurer le suivi."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <Table
                columns={MESSAGE_LOG_COLUMNS}
                data={logRows}
                getRowKey={(r) => r.log.id}
              />
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
