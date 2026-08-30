import { ArrowRight, CheckCircle2, Building2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getCurrentUser } from "@/lib/auth/session";
import { getWorkshop } from "@/lib/mock-data/workshop";
import { completeOnboardingAction } from "@/features/auth/actions";

const COUNTRY_OPTIONS = [
  { value: "Bénin", label: "Bénin (+229)" },
  { value: "Togo", label: "Togo (+228)" },
  { value: "Côte d'Ivoire", label: "Côte d'Ivoire (+225)" },
  { value: "Sénégal", label: "Sénégal (+221)" },
];

const ERROR_MESSAGES: Record<string, string> = {
  country: "Sélectionnez le pays de votre atelier.",
  city: "Indiquez la ville principale de votre atelier.",
  whatsappPhone: "Ce numéro WhatsApp n'est pas valide.",
  atelier: "Votre session ne correspond pas à cet atelier. Reconnectez-vous.",
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const errorMessage = erreur ? (ERROR_MESSAGES[erreur] ?? "Vérifiez votre saisie.") : undefined;

  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirect=/onboarding");

  const workshop = await getWorkshop();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-0.5 text-xs font-bold text-primary-900 border border-primary-200">
          <Building2 className="size-3.5" />
          <span>Étape finale de configuration</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary-950">
          Coordonnées de l&apos;atelier
        </h1>
        <p className="text-xs text-text-muted">
          Ces informations figureront sur vos devis, reçus et factures d&apos;atelier.
        </p>
      </div>

      <form action={completeOnboardingAction} className="space-y-3">
        {errorMessage ? (
          <div
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger-bg p-2.5 text-xs font-semibold text-danger"
          >
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-2.5 sm:grid-cols-2">
          <Select
            label="Pays *"
            name="country"
            required
            defaultValue={workshop.country || "Bénin"}
            options={COUNTRY_OPTIONS}
          />
          <Input
            label="Ville principale *"
            name="city"
            required
            defaultValue={workshop.city || "Cotonou"}
            placeholder="Ex. Cotonou"
          />
        </div>

        <Input
          label="Numéro WhatsApp de l'atelier *"
          name="whatsappPhone"
          type="tel"
          required
          defaultValue={workshop.whatsappPhone || "+229 97 00 00 00"}
          placeholder="+229 97 00 00 00"
          hint="Numéro affiché aux clients pour le suivi et les paiements."
        />

        <Input
          label="Devise de facturation"
          defaultValue="Franc CFA — FCFA (XOF)"
          disabled
          hint="Devise officielle supportée pour l'Afrique de l'Ouest & Centrale."
        />

        <div className="flex items-center gap-2 pt-1 text-[11px] text-text-muted">
          <CheckCircle2 className="size-3.5 text-success shrink-0" />
          <span>Vous pourrez modifier ces informations à tout moment dans Paramètres</span>
        </div>

        <Button type="submit" fullWidth size="md" className="mt-2">
          <span>Enregistrer et ouvrir mon tableau de bord</span>
          <ArrowRight className="size-4" />
        </Button>
      </form>
    </div>
  );
}
