import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/ui/link-button";
import { DocumentPreview } from "@/components/ui/document-preview";
import { getDocumentById } from "@/lib/mock-data/documents";
import { getClientById } from "@/lib/mock-data/clients";
import { getOrderById } from "@/lib/mock-data/orders";
import { clientDisplayName } from "@/features/clients/types";
import { formatDateFr } from "@/lib/utils/dates";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { DocumentPrintButton } from "./_components/document-print-button";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const doc = await getDocumentById(documentId);
  if (!doc) notFound();

  const [client, order] = await Promise.all([
    getClientById(doc.clientId),
    getOrderById(doc.orderId),
  ]);

  if (!client) notFound();

  const docTypeMap: Record<string, "devis" | "bon_commande" | "recu" | "facture" | "bon_livraison"> = {
    devis: "devis",
    bon_commande: "bon_commande",
    recu_acompte: "recu",
    recu_paiement: "recu",
    facture: "facture",
    bon_livraison: "bon_livraison",
  };

  const previewType = docTypeMap[doc.type] || "facture";

  const lines = order
    ? order.items.map((it) => ({
        id: it.id,
        label: it.label,
        quantity: it.quantity,
        unitAmount: it.unitPrice,
      }))
    : [
        {
          id: "item-1",
          label: "Prestation de couture",
          quantity: 1,
          unitAmount: doc.totalAmount,
        },
      ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <LinkButton
          href="/factures"
          variant="secondary"
          size="sm"
          icon={<ArrowLeft className="size-4" />}
          className="border border-border font-bold bg-surface shadow-xs hover:bg-surface-muted"
        >
          Tous les documents
        </LinkButton>

        <DocumentPrintButton docNumber={doc.number} clientPhone={client.phone} />
      </div>

      <div className="no-print">
        <PageHeader
          title={`Document ${doc.number}`}
          description={`Émis le ${formatDateFr(doc.issuedAt)} pour ${clientDisplayName(client)}`}
        />
      </div>

      <div className="rounded-lg border border-border bg-canvas/40 p-4 sm:p-8 print:p-0 print:border-none print:bg-white">
        <DocumentPreview
          documentType={previewType}
          number={doc.number}
          date={formatDateFr(doc.issuedAt)}
          organizationName="Atelier Élégance"
          clientName={clientDisplayName(client)}
          clientPhone={client.phone ? formatPhoneDisplay(client.phone) : undefined}
          lines={lines}
          totalAmount={doc.totalAmount}
          discountAmount={doc.discountAmount}
          paidAmount={doc.paidAmount}
          notes="Merci de votre confiance. Pour toute question relative à cette commande, contactez l'atelier au +229 97 00 00 00."
          className="printable-document shadow-sm print:shadow-none"
        />
      </div>
    </div>
  );
}
