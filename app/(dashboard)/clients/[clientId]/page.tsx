import { notFound } from "next/navigation";
import { MessageCircle, Phone, Plus } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table } from "@/components/ui/table";
import type { DataTableColumn } from "@/components/ui/table";
import { MobileCardList } from "@/components/ui/mobile-card-list";
import { getClientById } from "@/lib/mock-data/clients";
import { getOrdersByClient } from "@/lib/mock-data/orders";
import { getPaymentsByClient } from "@/lib/mock-data/payments";
import { getProfilesByClient } from "@/lib/mock-data/measurement-profiles";
import { clientDisplayName } from "@/features/clients/types";
import type { Order } from "@/features/orders/types";
import type { Payment } from "@/features/payments/types";
import { PAYMENT_METHOD_LABELS } from "@/features/payments/types";
import type { MeasurementProfile } from "@/features/measurements/types";
import { GARMENT_TYPE_LABELS } from "@/features/measurements/constants";
import { formatAmount } from "@/lib/money/format";
import { formatDateFr } from "@/lib/utils/dates";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientInfoTab } from "./_components/client-info-tab";
import { LinkButton } from "../_components/link-button";

const ORDER_COLUMNS: DataTableColumn<Order>[] = [
  { key: "reference", label: "Référence", emphasis: true, render: (order) => order.reference },
  { key: "status", label: "Statut", render: (order) => <StatusBadge status={order.status} /> },
  { key: "delivery", label: "Livraison", render: (order) => formatDateFr(order.deliveryDate) },
  { key: "total", label: "Montant", render: (order) => formatAmount(order.totalAmount) },
];

const PAYMENT_COLUMNS: DataTableColumn<Payment>[] = [
  { key: "amount", label: "Montant", emphasis: true, render: (payment) => formatAmount(payment.amount) },
  { key: "method", label: "Méthode", render: (payment) => PAYMENT_METHOD_LABELS[payment.method] },
  { key: "date", label: "Date", render: (payment) => formatDateFr(payment.createdAt) },
];

const MEASUREMENT_PROFILE_COLUMNS: DataTableColumn<MeasurementProfile>[] = [
  { key: "label", label: "Profil", emphasis: true, render: (profile) => profile.label },
  {
    key: "garmentType",
    label: "Type de vêtement",
    render: (profile) => GARMENT_TYPE_LABELS[profile.garmentType],
  },
  {
    key: "primary",
    label: "Principal",
    render: (profile) =>
      profile.isPrimary ? <Badge tone="primary">Principal</Badge> : <span className="text-text-subtle">—</span>,
  },
  { key: "takenAt", label: "Date de prise", render: (profile) => formatDateFr(profile.takenAt) },
];

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = await getClientById(clientId);
  if (!client) notFound();

  const [orders, payments, profiles] = await Promise.all([
    getOrdersByClient(clientId),
    getPaymentsByClient(clientId),
    getProfilesByClient(clientId),
  ]);

  const whatsappDigits = client.whatsappPhone.replace(/\D/g, "");

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Clients", href: "/clients" }, { label: clientDisplayName(client) }]}
        className="mb-3"
      />
      <PageHeader
        title={clientDisplayName(client)}
        description={client.district ? `${client.city} · ${client.district}` : client.city}
        action={
          <LinkButton href="/commandes/nouveau/client" icon={<Plus className="size-4" />}>
            Nouvelle commande
          </LinkButton>
        }
      />

      <Card className="mb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-text-muted">{formatPhoneDisplay(client.phone)}</span>
            {client.tags.map((tag) => (
              <Badge key={tag} tone="neutral">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton
              href={`tel:${client.phone}`}
              variant="secondary"
              size="sm"
              icon={<Phone className="size-4" aria-hidden="true" />}
            >
              Appeler
            </LinkButton>
            <LinkButton
              href={`https://wa.me/${whatsappDigits}`}
              variant="whatsapp"
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
              icon={<MessageCircle className="size-4" aria-hidden="true" />}
            >
              WhatsApp
            </LinkButton>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="infos">
        <TabsList>
          <TabsTrigger value="infos">Infos</TabsTrigger>
          <TabsTrigger value="commandes">Commandes</TabsTrigger>
          <TabsTrigger value="paiements">Paiements</TabsTrigger>
          <TabsTrigger value="mesures">Mesures</TabsTrigger>
        </TabsList>

        <TabsContent value="infos">
          <ClientInfoTab client={client} />
        </TabsContent>

        <TabsContent value="commandes">
          {orders.length === 0 ? (
            <EmptyState
              title="Aucune commande pour ce client."
              description="Les commandes de ce client apparaîtront ici une fois créées."
            />
          ) : (
            <>
              <div className="hidden md:block">
                <Table
                  columns={ORDER_COLUMNS}
                  data={orders}
                  getRowKey={(order) => order.id}
                  getRowHref={(order) => `/commandes/${order.id}`}
                />
              </div>
              <div className="md:hidden">
                <MobileCardList
                  columns={ORDER_COLUMNS}
                  data={orders}
                  getRowKey={(order) => order.id}
                  getRowHref={(order) => `/commandes/${order.id}`}
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="paiements">
          {payments.length === 0 ? (
            <EmptyState
              title="Aucun paiement enregistré."
              description="Les encaissements liés à ce client apparaîtront ici."
            />
          ) : (
            <>
              <div className="hidden md:block">
                <Table columns={PAYMENT_COLUMNS} data={payments} getRowKey={(payment) => payment.id} />
              </div>
              <div className="md:hidden">
                <MobileCardList columns={PAYMENT_COLUMNS} data={payments} getRowKey={(payment) => payment.id} />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="mesures">
          <div className="mb-3 flex justify-end">
            <LinkButton
              href={`/clients/${clientId}/mesures/nouveau`}
              size="sm"
              icon={<Plus className="size-4" aria-hidden="true" />}
            >
              Nouveau profil
            </LinkButton>
          </div>
          {profiles.length === 0 ? (
            <EmptyState
              title="Aucun profil de mesures."
              description="Créez un premier profil pour ce client avant sa prochaine commande."
            />
          ) : (
            <>
              <div className="hidden md:block">
                <Table
                  columns={MEASUREMENT_PROFILE_COLUMNS}
                  data={profiles}
                  getRowKey={(profile) => profile.id}
                  getRowHref={(profile) => `/clients/${clientId}/mesures/${profile.id}`}
                />
              </div>
              <div className="md:hidden">
                <MobileCardList
                  columns={MEASUREMENT_PROFILE_COLUMNS}
                  data={profiles}
                  getRowKey={(profile) => profile.id}
                  getRowHref={(profile) => `/clients/${clientId}/mesures/${profile.id}`}
                />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
