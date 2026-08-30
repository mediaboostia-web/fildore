import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/ui/link-button";
import { DocumentPreview } from "@/components/ui/document-preview";
import { getDocumentById } from "@/lib/mock-data/documents";
import { getClientById } from "@/lib/mock-data/clients";
import { getOrderById } from "@/lib/mock-data/orders";
import { getWorkshop } from "@/lib/mock-data/workshop";
import { getCurrentUser } from "@/lib/auth/session";
import { clientDisplayName } from "@/features/clients/types";
import { isShareLinkActive } from "@/features/invoices/types";
import { formatDateFr } from "@/lib/utils/dates";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { toPreviewType, buildDocumentLines } from "./_lib/document-view";
import { DocumentActions } from "./_components/document-actions";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const doc = await getDocumentById(documentId);
  if (!doc) notFound();

  const [client, order, workshop, currentUser] = await Promise.all([
    getClientById(doc.clientId),
    getOrderById(doc.orderId),
    getWorkshop(),
    getCurrentUser(),
  ]);

  if (!client) notFound();
  // Un document d'un autre atelier ne s'affiche pas, même en devinant son ID.
  if (currentUser && doc.workshopId !== currentUser.workshopId) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 no-print sm:flex-row sm:items-center sm:justify-between">
        <LinkButton
          href="/factures"
          variant="secondary"
          size="sm"
          fullWidth="mobile"
          icon={<ArrowLeft className="size-4" />}
        >
          Toutes les factures
        </LinkButton>

        <DocumentActions
          documentId={doc.id}
          docNumber={doc.number}
          workshopName={workshop.name}
          clientPhone={client.whatsappPhone}
          shareToken={isShareLinkActive(doc) ? doc.shareToken! : null}
          currentUserRole={currentUser?.role}
        />
      </div>

      <div className="no-print">
        <PageHeader
          title={`Document ${doc.number}`}
          description={`Émis le ${formatDateFr(doc.issuedAt)} pour ${clientDisplayName(client)}`}
        />
      </div>

      <div className="rounded-lg border border-border bg-canvas/40 p-4 print:border-none print:bg-white print:p-0 sm:p-8">
        <DocumentPreview
          documentType={toPreviewType(doc.type)}
          number={doc.number}
          date={formatDateFr(doc.issuedAt)}
          organizationName={workshop.name}
          organizationPhone={formatPhoneDisplay(workshop.whatsappPhone)}
          organizationAddress={`${workshop.city}, ${workshop.country}`}
          clientName={clientDisplayName(client)}
          clientPhone={client.phone ? formatPhoneDisplay(client.phone) : undefined}
          lines={buildDocumentLines(doc, order)}
          totalAmount={doc.totalAmount}
          discountAmount={doc.discountAmount}
          paidAmount={doc.paidAmount}
          notes={`Merci de votre confiance. Pour toute question sur cette commande, contactez ${workshop.name} au ${formatPhoneDisplay(workshop.whatsappPhone)}.`}
          className="printable-document shadow-sm print:shadow-none"
        />
      </div>
    </div>
  );
}
