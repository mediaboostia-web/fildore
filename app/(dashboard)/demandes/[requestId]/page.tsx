import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, MessageCircle, Phone, Scissors } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { requireCurrentUser } from "@/lib/auth/session";
import { can } from "@/features/auth/permissions";
import { getOrderRequestById } from "@/lib/mock-data/order-requests";
import { getCatalogItemById } from "@/lib/mock-data/catalog";
import { getWorkshop } from "@/lib/mock-data/workshop";
import { findClientByPhone } from "@/lib/mock-data/clients";
import { formatDateFr, addDaysIso, todayIso } from "@/lib/utils/dates";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { formatAmount } from "@/lib/money/format";
import {
  ORDER_REQUEST_STATUS_LABELS,
  requestDisplayName,
} from "@/features/public-orders/types";
import { ReviewRequestPanel } from "./_components/review-request-panel";

export default async function DemandeDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const user = await requireCurrentUser();
  const request = await getOrderRequestById(requestId);

  // Une demande d'un autre atelier ne s'affiche pas, même en devinant son ID.
  if (!request || request.workshopId !== user.workshopId) notFound();

  const [catalogItem, workshop, knownClient] = await Promise.all([
    request.catalogItemId ? getCatalogItemById(request.catalogItemId) : Promise.resolve(undefined),
    getWorkshop(),
    findClientByPhone(request.phone),
  ]);

  const whatsappDigits = request.phone.replace(/\D/g, "");
  const suggestedDeliveryDate =
    request.desiredDate ?? addDaysIso(todayIso(), workshop.onlineOrdering.minDelayDays);

  return (
    <div className="space-y-5">
      <Breadcrumbs
        items={[
          { label: "Demandes en ligne", href: "/demandes" },
          { label: requestDisplayName(request) },
        ]}
      />

      <PageHeader
        title={requestDisplayName(request)}
        description={`Demande reçue le ${formatDateFr(request.submittedAt)} depuis votre page publique`}
        action={
          <LinkButton href="/demandes" variant="secondary" size="sm" icon={<ArrowLeft className="size-4" />}>
            Toutes les demandes
          </LinkButton>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge
          tone={
            request.status === "nouvelle"
              ? "warning"
              : request.status === "acceptee"
                ? "success"
                : "neutral"
          }
        >
          {ORDER_REQUEST_STATUS_LABELS[request.status]}
        </Badge>
        {knownClient ? (
          <Badge tone="info">Client déjà connu — la demande lui sera rattachée</Badge>
        ) : (
          <Badge tone="neutral">Nouveau contact</Badge>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <h2 className="mb-3 text-sm font-bold text-text">Ce que le client demande</h2>

            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Scissors className="mt-0.5 size-4 shrink-0 text-primary-800" aria-hidden="true" />
                <div>
                  <dt className="text-text-muted">Modèle</dt>
                  <dd className="font-medium text-text">
                    {request.catalogItemName ?? "Tenue décrite dans le message"}
                    {catalogItem?.indicativePrice ? (
                      <span className="ml-2 text-xs font-normal text-text-muted">
                        prix indicatif {formatAmount(catalogItem.indicativePrice)}
                      </span>
                    ) : null}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 size-4 shrink-0 text-primary-800" aria-hidden="true" />
                <div>
                  <dt className="text-text-muted">Date souhaitée</dt>
                  <dd className="font-medium text-text">
                    {request.desiredDate ? formatDateFr(request.desiredDate) : "Non précisée"}
                  </dd>
                </div>
              </div>
            </dl>

            {request.note ? (
              <div className="mt-4 rounded-[var(--radius-md)] bg-canvas p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Son message
                </p>
                <p className="whitespace-pre-line text-sm text-text">{request.note}</p>
              </div>
            ) : null}
          </Card>

          {request.status === "nouvelle" ? (
            <ReviewRequestPanel
              requestId={request.id}
              defaultTitle={request.catalogItemName ?? "Confection sur mesure"}
              defaultGarmentType={catalogItem?.garmentType ?? "robe"}
              defaultDeliveryDate={suggestedDeliveryDate}
              defaultTotalAmount={catalogItem?.indicativePrice ?? 0}
              canReview={can(user.role, "demande:traiter")}
            />
          ) : (
            <Card>
              <h2 className="mb-2 text-sm font-bold text-text">Décision</h2>
              {request.status === "acceptee" ? (
                <div className="space-y-3 text-sm text-text-muted">
                  <p>
                    Acceptée le {request.reviewedAt ? formatDateFr(request.reviewedAt) : "—"}. La
                    commande et la fiche client existent.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {request.createdOrderId ? (
                      <LinkButton
                        href={`/commandes/${request.createdOrderId}`}
                        size="sm"
                        fullWidth="mobile"
                      >
                        Ouvrir la commande
                      </LinkButton>
                    ) : null}
                    {request.createdClientId ? (
                      <LinkButton
                        href={`/clients/${request.createdClientId}`}
                        size="sm"
                        variant="secondary"
                        fullWidth="mobile"
                      >
                        Voir la fiche client
                      </LinkButton>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-text-muted">
                  Refusée le {request.reviewedAt ? formatDateFr(request.reviewedAt) : "—"}
                  {request.refusalReason ? ` — ${request.refusalReason}` : ""}. Aucun client ni
                  commande n&apos;a été créé.
                </p>
              )}
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card>
            <h2 className="mb-3 text-sm font-bold text-text">Contact</h2>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-text">
                <Phone className="size-3.5 text-text-muted" aria-hidden="true" />
                {formatPhoneDisplay(request.phone)}
              </p>
              <p className="flex items-center gap-2 text-text-muted">
                <MapPin className="size-3.5" aria-hidden="true" />
                {request.district ? `${request.city} · ${request.district}` : request.city}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <LinkButton
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                size="sm"
                fullWidth
                icon={<MessageCircle className="size-4" />}
              >
                Écrire sur WhatsApp
              </LinkButton>
              <LinkButton
                href={`tel:${request.phone}`}
                variant="secondary"
                size="sm"
                fullWidth
                icon={<Phone className="size-4" />}
              >
                Appeler
              </LinkButton>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
