import Link from "next/link";
import { AuthGoogleButton } from "@/components/auth/auth-google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { getUsers } from "@/lib/mock-data/users";
import { getWorkshop } from "@/lib/mock-data/workshop";
import { ROLE_LABELS } from "@/features/auth/types";
import { loginAction } from "@/features/auth/actions";
import { ArrowRight, UserCheck } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  selection: "Veuillez renseigner votre email ou choisir un profil.",
  utilisateur: "Ce profil n'existe plus. Choisissez-en un autre.",
  identifiants: "Aucun compte ne correspond à cette adresse e-mail.",
  email: "Cette adresse e-mail n'est pas valide.",
  password: "Saisissez votre mot de passe.",
};

const SUCCESS_MESSAGES: Record<string, string> = {
  mot_de_passe_reinitialise: "Votre mot de passe a été réinitialisé avec succès. Vous pouvez vous connecter.",
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; erreur?: string; succes?: string }>;
}) {
  const { redirect, erreur, succes } = await searchParams;
  const [users, workshop] = await Promise.all([getUsers(), getWorkshop()]);
  const errorMessage = erreur ? ERROR_MESSAGES[erreur] : undefined;
  const successMessage = succes ? SUCCESS_MESSAGES[succes] : undefined;

  return (
    <div className="space-y-6">
      {/* Titre & Sous-titre */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-950">
          Bon retour parmi nous
        </h1>
        <p className="text-sm text-text-muted">
          Connectez-vous pour accéder à l&apos;atelier <strong className="text-text">{workshop.name}</strong>.
        </p>
      </div>

      {/* Messages de retour */}
      {errorMessage ? (
        <div className="rounded-xl border border-danger/30 bg-danger-bg p-3.5 text-xs font-semibold text-danger">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl border border-success/30 bg-success-bg p-3.5 text-xs font-semibold text-success">
          {successMessage}
        </div>
      ) : null}

      {/* Moyen rapide : Connexion 1-clic avec Google */}
      <div className="space-y-3">
        <AuthGoogleButton
          label="Se connecter avec Google"
          redirectTo={redirect}
        />

        <div className="relative flex items-center justify-center py-2">
          <div className="w-full border-t border-border" />
          <span className="absolute bg-surface px-3 text-xs font-semibold uppercase tracking-wider text-text-subtle">
            ou par email
          </span>
        </div>
      </div>

      {/* Formulaire standard Email / Mot de passe */}
      <form action={loginAction} className="space-y-4">
        <input type="hidden" name="redirect" value={redirect ?? ""} />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text">
            Email professionnel
          </label>
          <input
            type="email"
            name="email"
            defaultValue="amina@atelier-elegance.bj"
            placeholder="votre-email@atelier.com"
            required
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-800/20 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-text">
              Mot de passe
            </label>
            <Link
              href="/mot-de-passe-oublie"
              className="text-xs font-semibold text-primary-800 hover:text-primary-950 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <PasswordInput
            name="password"
            defaultValue="password123"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            id="remember-me"
            type="checkbox"
            defaultChecked
            className="size-4 rounded border-border text-primary-900 focus:ring-primary-800"
          />
          <label htmlFor="remember-me" className="text-xs text-text-muted cursor-pointer">
            Se souvenir de moi pendant 30 jours
          </label>
        </div>

        <Button type="submit" fullWidth size="lg" className="mt-2">
          <span>Se connecter à mon atelier</span>
          <ArrowRight className="size-4" />
        </Button>
      </form>

      {/* Sélection rapide de profils de test pour démonstration */}
      <div className="rounded-2xl border border-border/80 bg-surface-muted/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-text">
            <UserCheck className="size-4 text-primary-800" />
            <span>Accès rapide démo atelier</span>
          </div>
          <span className="text-[10px] font-semibold text-text-subtle">1-clic</span>
        </div>

        <form action={loginAction} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input type="hidden" name="redirect" value={redirect ?? ""} />
          {users.slice(0, 2).map((user) => (
            <button
              key={user.id}
              type="submit"
              name="userId"
              value={user.id}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-surface p-2.5 text-left hover:border-primary-800/60 hover:bg-surface-muted active:scale-[0.98] transition-all cursor-pointer"
            >
              <Avatar name={user.fullName} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-text truncate">{user.fullName}</p>
                <p className="text-[11px] text-text-subtle">{ROLE_LABELS[user.role]}</p>
              </div>
            </button>
          ))}
        </form>
      </div>

      {/* Lien vers Inscription */}
      <div className="text-center pt-2">
        <p className="text-xs text-text-muted">
          Vous n&apos;avez pas encore d&apos;atelier ?{" "}
          <Link
            href="/inscription"
            className="font-bold text-primary-800 hover:text-primary-950 underline underline-offset-4"
          >
            Créer mon atelier gratuitement
          </Link>
        </p>
      </div>
    </div>
  );
}
