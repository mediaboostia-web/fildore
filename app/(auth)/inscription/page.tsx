import Link from "next/link";
import { AuthGoogleButton } from "@/components/auth/auth-google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { signupAction } from "@/features/auth/actions";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function InscriptionPage() {
  return (
    <div className="space-y-6">
      {/* Titre & Sous-titre */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-bold text-accent-600 border border-accent-100">
          <span>Création instantanée</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-950">
          Créer votre atelier Fildor
        </h1>
        <p className="text-sm text-text-muted">
          Prenez le contrôle de vos commandes, mesures et paiements en 2 minutes.
        </p>
      </div>

      {/* Moyen rapide : Inscription 1-clic avec Google */}
      <div className="space-y-3">
        <AuthGoogleButton label="S'inscrire avec Google en 1 clic" />

        <div className="relative flex items-center justify-center py-2">
          <div className="w-full border-t border-border" />
          <span className="absolute bg-surface px-3 text-xs font-semibold uppercase tracking-wider text-text-subtle">
            ou inscription par formulaire
          </span>
        </div>
      </div>

      {/* Formulaire standard */}
      <form action={signupAction} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text">
            Votre nom complet *
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Ex. Amina Sossou"
            required
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-800/20 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text">
            Nom de l&apos;atelier de couture *
          </label>
          <input
            type="text"
            name="workshopName"
            placeholder="Ex. Atelier Élégance Mode"
            required
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-800/20 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text">
            Email professionnel *
          </label>
          <input
            type="email"
            name="email"
            placeholder="amina@elegance.bj"
            required
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-800/20 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text">
            Créer un mot de passe *
          </label>
          <PasswordInput
            name="password"
            placeholder="Au moins 8 caractères"
            required
          />
        </div>

        <div className="space-y-2 pt-1 text-xs text-text-muted">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
            <span>Aucune carte bancaire requise · Prêt pour smartphone</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
            <span>Vos mesures et données protégées à vie</span>
          </div>
        </div>

        <Button type="submit" fullWidth size="lg" className="mt-2">
          <span>Créer mon espace atelier</span>
          <ArrowRight className="size-4" />
        </Button>
      </form>

      {/* Lien vers Connexion */}
      <div className="text-center pt-2">
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
