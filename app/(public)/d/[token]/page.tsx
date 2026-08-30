import type { Metadata } from "next";
import { LinkOff } from "./_components/link-off";
import { PublicDocumentDownload } from "./_components/public-document-download";
import { DocumentPreview } from "@/components/ui/document-preview";
import { getDocumentByShareToken } from "@/lib/mock-data/documents";
import { getClientById } from "@/lib/mock-data/clients";
import { getOrderById } from "@/lib/mock-data/orders";
import { getWorkshop } from "@/lib/mock-data/workshop";
import { formatDateFr } from "@/lib/utils/dates";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import {
  toPreviewType,
  buildDocumentLines,
} from "@/app/(dashboard)/factures/[documentId]/_lib/document-view";

export const metadata: Metadata = {
  // Le document est nominatif : il ne doit apparaître dans aucun moteur de
  // recherche, même si le lien circule (PROJECT_RULES.md §7).
  robots: { index: false, follow: false },
};

/**
 * Document partagé par l'atelier, ouvert sans compte.
 *
 * Ce que le visiteur voit : ce document et un bouton pour le télécharger.
 * Ce qu'il ne voit jamais : les autres commandes du client, son adresse, ses
 * mesures, le reste du catalogue, ni le moindre lien vers le tableau de bord.
 */
export default async function PublicDocumentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const doc = await getDocumentByShareToken(token);

  // Jeton inconnu et jeton révoqué donnent exactement la même page : rien ne
  // doit laisser deviner qu'un document a existé à cette adresse.
  if (!doc) return <LinkOff />;

  const [client, order, workshop] = await Promise.all([
    getClientById(doc.clientId),
    getOrderById(doc.orderId),
    getWorkshop(),
  ]);

  if (!client) return <LinkOff />;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-5 flex flex-col gap-3 no-print sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-text">{workshop.name}</p>
          <p className="text-xs text-text-muted">
            Votre document {doc.number} · émis le {formatDateFr(doc.issuedAt)}
          </p>
        </div>
        <PublicDocumentDownload docNumber={doc.number} />
      </div>

      <div className="rounded-[var(--radius-lg)] border border-border bg-canvas/40 p-4 print:border-none print:bg-white print:p-0 sm:p-8">
        <DocumentPreview
          documentType={toPreviewType(doc.type)}
          number={doc.number}
          date={formatDateFr(doc.issuedAt)}
          organizationName={workshop.name}
          organizationPhone={formatPhoneDisplay(workshop.whatsappPhone)}
          organizationAddress={`${workshop.city}, ${workshop.country}`}
          // Seul le prénom du client apparaît côté public : le nom complet et
          // le numéro n'apportent rien à qui reçoit déjà son propre document.
          clientName={client.firstName}
          lines={buildDocumentLines(doc, order)}
          totalAmount={doc.totalAmount}
          discountAmount={doc.discountAmount}
          paidAmount={doc.paidAmount}
          notes={`Pour toute question sur ce document, contactez ${workshop.name} au ${formatPhoneDisplay(workshop.whatsappPhone)}.`}
          className="printable-document shadow-sm print:shadow-none"
        />
      </div>

      <p className="mt-6 text-center text-xs text-text-subtle no-print">
        Document transmis par {workshop.name} · Généré avec Fildor
      </p>
    </main>
  );
}
