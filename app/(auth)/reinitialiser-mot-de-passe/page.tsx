import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/password-input";
import { resetPasswordAction } from "@/features/auth/actions";

const ERROR_MESSAGES: Record<string, string> = {
  password: "Le mot de passe doit contenir au moins 8 caractères.",
  confirmPassword: "Les deux mots de passe ne correspondent pas.",
};

export default async function ReinitialiserMotDePassePage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const errorMessage = erreur ? (ERROR_MESSAGES[erreur] ?? "Vérifiez votre saisie.") : undefined;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="space-y-2">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-900 border border-primary-100">
          <Lock className="size-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-950">
          Nouveau mot de passe
        </h1>
        <p className="text-sm text-text-muted">
          Choisissez un nouveau mot de passe sécurisé pour protéger l&apos;accès à votre atelier.
        </p>
      </div>

      <form action={resetPasswordAction} className="space-y-4">
        {errorMessage ? (
          <div
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger-bg p-3.5 text-xs font-semibold text-danger"
          >
            {errorMessage}
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text">
            Nouveau mot de passe *
          </label>
          <PasswordInput
            name="password"
            placeholder="Au moins 8 caractères"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text">
            Confirmer le nouveau mot de passe *
          </label>
          <PasswordInput
            name="confirmPassword"
            placeholder="Répétez le mot de passe"
            required
          />
        </div>

        <Button type="submit" fullWidth size="lg" className="mt-2">
          <span>Enregistrer le nouveau mot de passe</span>
        </Button>
      </form>

      {/* Lien Retour */}
      <div className="pt-2">
        <Link
          href="/connexion"
          className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Annuler et retourner à la connexion</span>
        </Link>
      </div>
    </div>
  );
}
