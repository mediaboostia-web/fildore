import Link from "next/link";
import { AuthGoogleButton } from "@/components/auth/auth-google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { signupAction } from "@/features/auth/actions";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  fullName: "Indiquez votre nom complet.",
  workshopName: "Indiquez le nom de votre atelier.",
  email: "Cette adresse e-mail n'est pas valide.",
  password: "Le mot de passe doit contenir au moins 8 caractères.",
  email_existant: "Un compte existe déjà avec cette adresse e-mail.",
};

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const errorMessage = erreur ? (ERROR_MESSAGES[erreur] ?? "Vérifiez votre saisie.") : undefined;

  return (
    <div className="space-y-4">
      {/* Titre & Sous-titre */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary-950">
          Créer votre atelier Fildor
        </h1>
        <p className="text-xs text-text-muted">
          Prenez le contrôle de vos commandes, mesures et paiements en 2 minutes.
        </p>
      </div>

      {/* Moyen rapide : Inscription 1-clic avec Google */}
      <div className="space-y-2">
        <AuthGoogleButton label="S'inscrire avec Google en 1 clic" />

        <div className="relative flex items-center justify-center py-1">
          <div className="w-full border-t border-border" />
          <span className="absolute bg-surface px-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-subtle">
            ou par formulaire
          </span>
        </div>
      </div>

      {/* Formulaire standard compact */}
      <form action={signupAction} className="space-y-3">
        {errorMessage ? (
          <div
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger-bg p-2.5 text-xs font-semibold text-danger"
          >
            {errorMessage}
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-text">
              Nom complet *
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Amina Sossou"
              required
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs sm:text-sm text-text placeholder:text-text-subtle focus:border-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-800/20 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-text">
              Nom de l&apos;atelier *
            </label>
            <input
              type="text"
              name="workshopName"
              placeholder="Atelier Élégance Mode"
              required
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs sm:text-sm text-text placeholder:text-text-subtle focus:border-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-800/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-text">
            Email professionnel *
          </label>
          <input
            type="email"
            name="email"
            placeholder="amina@elegance.bj"
            required
            className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs sm:text-sm text-text placeholder:text-text-subtle focus:border-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-800/20 transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-text">
            Créer un mot de passe *
          </label>
          <PasswordInput
            name="password"
            placeholder="Au moins 8 caractères"
            required
          />
        </div>

        <div className="flex items-center gap-2 pt-0.5 text-[11px] text-text-muted">
          <CheckCircle2 className="size-3.5 text-success shrink-0" />
          <span>Sans carte bancaire · Vos données d&apos;atelier protégées</span>
        </div>

        <Button type="submit" fullWidth size="md" className="mt-1">
          <span>Créer mon espace atelier</span>
          <ArrowRight className="size-4" />
        </Button>
      </form>

      {/* Lien vers Connexion */}
      <div className="text-center pt-1">
        <p className="text-xs text-text-muted">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/connexion"
            className="font-bold text-primary-800 hover:text-primary-950 underline underline-offset-4"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
