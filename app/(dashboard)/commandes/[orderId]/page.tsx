import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Edit,
  FileText,
  Phone,
  Ruler,
  Scissors,
  User,
  AlertTriangle,
  Receipt,
  ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import { PaymentSummary } from "@/components/ui/payment-summary";
import { Timeline, type TimelineEvent } from "@/components/ui/timeline";
import { getCurrentUser } from "@/lib/auth/session";
import { getOrderById } from "@/lib/mock-data/orders";
import { getClientById } from "@/lib/mock-data/clients";
import { getPaymentsByOrder } from "@/lib/mock-data/payments";
import { getDocumentsByOrder } from "@/lib/mock-data/documents";
import { DOCUMENT_TYPE_LABELS } from "@/features/invoices/types";
import { computeBalance } from "@/lib/money/balance";
import { formatAmount } from "@/lib/money/format";
import { formatDateFr } from "@/lib/utils/dates";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { clientDisplayName } from "@/features/clients/types";
import { sumConfirmedPayments, PAYMENT_METHOD_LABELS } from "@/features/payments/types";
import { getOrderComputedFlags } from "@/features/orders/selectors";
import { ORDER_STATUS_LABELS } from "@/features/orders/types";
import { GARMENT_TYPE_LABELS } from "@/features/measurements/constants";
import { OrderActionsBar } from "./_components/order-actions-bar";
import { Printer } from "lucide-react";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);
  if (!order) notFound();

  const [client, payments, documents, currentUser] = await Promise.all([
    getClientById(order.clientId),
    getPaymentsByOrder(order.id),
    getDocumentsByOrder(order.id),
    getCurrentUser(),
  ]);
  if (!client) notFound();

  const paidAmount = sumConfirmedPayments(payments);
  const balance = computeBalance(order.totalAmount, order.discountAmount, paidAmount);
  const today = new Date().toISOString().slice(0, 10);
  const flags = getOrderComputedFlags(order, today, paidAmount);

  // Timeline events
  const timelineEvents: TimelineEvent[] = (order.statusHistory || []).map((entry, idx) => ({
    id: `history-${idx}`,
    title: ORDER_STATUS_LABELS[entry.status] || entry.status,
    description: entry.note,
    timestamp: formatDateFr(entry.at),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LinkButton href="/commandes" variant="tertiary" size="sm" icon={<ArrowLeft className="size-4" />}>
          Toutes les commandes
        </LinkButton>
      </div>

      <PageHeader
        title={`${order.reference} — ${order.title}`}
        description={`Commandé le ${formatDateFr(order.createdAt)} par ${clientDisplayName(client)}`}
        action={
          <LinkButton
            href={`/commandes/${order.id}/modifier`}
            variant="secondary"
            size="sm"
            icon={<Edit className="size-4" />}
          >
            Modifier détails
          </LinkButton>
        }
      />

      {/* Alertes éventuelles */}
      {flags.isOverdue && (
        <div className="flex items-center gap-2 rounded-lg bg-danger-bg p-3.5 text-sm text-danger font-medium border border-danger/20">
          <AlertTriangle className="size-5 shrink-0" />
          <span>Cette commande est en retard de livraison (prévue le {formatDateFr(order.deliveryDate)}).</span>
        </div>
      )}

      {/* Barre d'actions rapides et sélecteur de statut */}
      <OrderActionsBar
        order={order}
        client={client}
        balance={balance}
        paidAmount={paidAmount}
        currentUserRole={currentUser?.role}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne gauche (2/3) : Prestations, Mesures, Timeline */}
        <div className="space-y-6 lg:col-span-2">
          {/* Détails de la tenue & Articles */}
          <div className="rounded-lg border border-border bg-surface p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Scissors className="size-4 text-primary-800" />
                <h2 className="font-bold text-text">Détails de la confection</h2>
              </div>
              <Badge tone="info">{GARMENT_TYPE_LABELS[order.garmentType]}</Badge>
            </div>

            {order.description && (
              <div className="rounded-md bg-canvas p-3 text-sm text-text-muted">
                <p className="font-medium text-text text-xs uppercase tracking-wider mb-1">
                  Instructions atelier :
                </p>
                <p>{order.description}</p>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Articles & Prestations
              </h3>
              <div className="divide-y divide-border rounded border border-border">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 text-sm">
                    <div>
                      <p className="font-medium text-text">{item.label}</p>
                      <p className="text-xs text-text-muted">
                        {item.quantity} x {formatAmount(item.unitPrice)}
                      </p>
                    </div>
                    <span className="font-semibold text-text">
                      {formatAmount(item.quantity * item.unitPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Snapshot des mesures */}
          <div className="rounded-lg border border-border bg-surface p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="size-4 text-primary-800" />
                <h2 className="font-bold text-text">Mesures figées à la commande</h2>
              </div>
              <span className="text-xs text-text-muted">
                Profil : {order.measurementSnapshot.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Object.entries(order.measurementSnapshot.standardMeasurements || {}).map(([k, v]) => (
                <div key={k} className="rounded-md border border-border bg-canvas/60 p-2.5">
                  <span className="block text-xs text-text-muted truncate" title={k}>{k}</span>
                  <span className="text-sm font-bold text-text">{v} cm</span>
                </div>
              ))}
            </div>

            {order.measurementSnapshot.customMeasurements &&
              order.measurementSnapshot.customMeasurements.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">
                    Mesures personnalisées
                  </span>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {order.measurementSnapshot.customMeasurements.map((m, idx) => (
                      <div key={idx} className="rounded-md border border-border bg-canvas/60 p-2.5">
                        <span className="block text-xs text-text-muted truncate">{m.label}</span>
                        <span className="text-sm font-bold text-text">{m.valueCm} cm</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Timeline de production */}
          <div className="rounded-lg border border-border bg-surface p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Clock className="size-4 text-primary-800" />
              <h2 className="font-bold text-text">Historique de production</h2>
            </div>
            <Timeline events={timelineEvents} />
          </div>
        </div>

        {/* Colonne droite (1/3) : Client, Délais, Règlements */}
        <div className="space-y-6">
          {/* Fiche Client */}
          <div className="rounded-lg border border-border bg-surface p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="size-4 text-primary-800" />
                <h2 className="font-bold text-text">Client</h2>
              </div>
              <LinkButton href={`/clients/${client.id}`} variant="tertiary" size="sm">
                Voir fiche
              </LinkButton>
            </div>
            <div>
              <p className="font-semibold text-base text-text">{clientDisplayName(client)}</p>
              <p className="text-sm text-text-muted flex items-center gap-1.5 mt-1">
                <Phone className="size-3.5" />
                {formatPhoneDisplay(client.phone)}
              </p>
              {client.district && (
                <p className="text-xs text-text-muted mt-1">
                  {client.city} · {client.district}
                </p>
              )}
            </div>
          </div>

          {/* Délais & Dates */}
          <div className="rounded-lg border border-border bg-surface p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Calendar className="size-4 text-primary-800" />
              <h2 className="font-bold text-text">Délais de livraison</h2>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Livraison prévue :</span>
                <span className="font-semibold text-text">{formatDateFr(order.deliveryDate)}</span>
              </div>
              {order.eventDate && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Événement :</span>
                  <span className="font-medium text-text">{formatDateFr(order.eventDate)}</span>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex justify-between text-success">
                  <span>Livrée le :</span>
                  <span className="font-semibold">{formatDateFr(order.deliveredAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Synthèse financière & Solde */}
          <div className="space-y-3">
            <PaymentSummary
              totalAmount={order.totalAmount}
              discountAmount={order.discountAmount}
              paidAmount={paidAmount}
            />

            {/* Historique des paiements de cette commande */}
            <div className="rounded-lg border border-border bg-surface p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Règlements reçus ({payments.length})
                </span>
                <Receipt className="size-4 text-text-subtle" />
              </div>

              {payments.length === 0 ? (
                <p className="text-xs text-text-muted italic">Aucun paiement encaissé pour l&apos;instant.</p>
              ) : (
                <div className="space-y-2">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded border border-border bg-canvas/50 p-2.5 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-text">{formatAmount(p.amount)}</span>
                        <p className="text-text-muted">
                          {PAYMENT_METHOD_LABELS[p.method]} · {formatDateFr(p.createdAt)}
                        </p>
                      </div>
                      <Badge tone="success" className="text-xs">
                        {p.receiptNumber}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Factures & Documents émis */}
            <div className="rounded-lg border border-border bg-surface p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Factures & Documents ({documents.length})
                </span>
                <FileText className="size-4 text-text-subtle" />
              </div>

              {documents.length === 0 ? (
                <div className="space-y-2 text-xs">
                  <p className="text-text-muted italic">Aucun document spécifique émis pour cette commande.</p>
                  <LinkButton href="/factures" variant="secondary" size="sm" className="w-full">
                    Consulter tous les documents
                  </LinkButton>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded border border-border bg-canvas/50 p-2.5 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-primary-900">{doc.number}</span>
                        <p className="text-text-muted">
                          {DOCUMENT_TYPE_LABELS[doc.type] || doc.type} · {formatDateFr(doc.issuedAt)}
                        </p>
                      </div>
                      <Link
                        href={`/factures/${doc.id}`}
                        className="inline-flex items-center gap-1 rounded bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-900 hover:bg-primary-100 transition-colors"
                      >
                        <Printer className="size-3.5" />
                        Imprimer
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
