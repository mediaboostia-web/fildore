import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { getWorkshopBySlug } from "@/lib/mock-data/workshop";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { PublicHeader } from "../../_components/public-header";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Confirmation après envoi d'une demande.
 *
 * Elle dit ce qui va se passer et par quel canal : sans cela, le visiteur
 * attend un e-mail qui n'arrivera jamais, ou renvoie trois fois la même demande.
 */
export default async function OrderRequestThanksPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workshop = await getWorkshopBySlug(slug);
  if (!workshop) notFound();

  return (
    <>
      <PublicHeader workshop={workshop} />

      <main className="mx-auto w-full max-w-xl px-4 py-12 text-center sm:px-6">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-bg text-success">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-xl font-bold text-text">Votre demande est bien arrivée.</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          {workshop.name} l&apos;a reçue et vous rappellera sur WhatsApp au numéro que vous avez
          indiqué, pour confirmer les mesures, le tissu et le prix.
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Rien n&apos;est facturé tant que vous n&apos;avez pas confirmé.
        </p>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <LinkButton
            href={`https://wa.me/${workshop.whatsappPhone.replace(/\D/g, "")}`}
            variant="whatsapp"
            fullWidth="mobile"
            icon={<MessageCircle className="size-4" />}
          >
            Écrire à l&apos;atelier
          </LinkButton>
          <LinkButton href={`/atelier/${workshop.slug}`} variant="secondary" fullWidth="mobile">
            Revoir les modèles
          </LinkButton>
        </div>

        <p className="mt-8 text-xs text-text-subtle">
          {workshop.name} · {formatPhoneDisplay(workshop.whatsappPhone)}
        </p>
      </main>
    </>
  );
}
