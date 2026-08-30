import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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

  // La configuration modifie les coordonnées de l'atelier : c'est une action
  // authentifiée, pas un écran public de la page d'inscription.
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirect=/onboarding");

  const workshop = await getWorkshop();

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Configuration de votre atelier</CardTitle>
        <CardDescription>
          Ces coordonnées apparaîtront sur vos reçus, vos factures et vos messages WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={completeOnboardingAction} className="space-y-4">
          {errorMessage ? (
            <div
              role="alert"
              className="rounded-[var(--radius-md)] border border-danger/30 bg-danger-bg p-3 text-sm font-medium text-danger"
            >
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Pays"
              name="country"
              required
              defaultValue={workshop.country || "Bénin"}
              options={COUNTRY_OPTIONS}
            />
            <Input
              label="Ville principale"
              name="city"
              required
              defaultValue={workshop.city || "Cotonou"}
            />
          </div>

          <Input
            label="Numéro WhatsApp de l'atelier"
            name="whatsappPhone"
            type="tel"
            required
            defaultValue={workshop.whatsappPhone}
            placeholder="+229 97 00 00 00"
            hint="C'est le numéro que vos clients verront sur vos documents."
          />

          <Input
            label="Devise"
            defaultValue="FCFA (XOF)"
            disabled
            hint="La gestion multidevise arrivera dans une prochaine version."
          />

          <Button type="submit" fullWidth icon={<ArrowRight className="size-4" />}>
            Enregistrer et accéder à mon tableau de bord
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
