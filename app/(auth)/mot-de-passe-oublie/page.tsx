import Link from "next/link";
import { ArrowLeft, CheckCircle2, KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction } from "@/features/auth/actions";

export default async function MotDePasseOubliePage({
  searchParams,
}: {
  searchParams: Promise<{ succes?: string; erreur?: string }>;
}) {
  const { succes, erreur } = await searchParams;
  const isSuccess = succes === "1";

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="space-y-2">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-900 border border-primary-100">
          <KeyRound className="size-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-950">
          Mot de passe oublié ?
        </h1>
        <p className="text-sm text-text-muted">
          Saisissez l&apos;adresse email de votre atelier pour recevoir un lien de réinitialisation sécurisé.
        </p>
      </div>

      {/* Message de succès */}
      {isSuccess ? (
        <div className="rounded-2xl border border-success/30 bg-success-bg p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-success font-bold text-sm">
            <CheckCircle2 className="size-5 shrink-0" />
            <span>Email de réinitialisation envoyé !</span>
          </div>
          <p className="text-xs text-text leading-relaxed">
            Consultez votre boîte de réception. Cliquez sur le lien pour définir un nouveau mot de passe sécurisé.
          </p>
          <div className="pt-2">
            <Link
              href="/reinitialiser-mot-de-passe"
              className="inline-flex items-center text-xs font-bold text-primary-900 hover:underline"
            >
              Simuler le lien de réinitialisation →
            </Link>
          </div>
        </div>
      ) : (
        <form action={forgotPasswordAction} className="space-y-4">
          {erreur ? (
            <div className="rounded-xl border border-danger/30 bg-danger-bg p-3.5 text-xs font-semibold text-danger">
              Veuillez saisir une adresse email valide.
            </div>
          ) : null}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text">
              Email de l&apos;atelier
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="amina@elegance.bj"
                required
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 pl-10 text-sm text-text placeholder:text-text-subtle focus:border-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-800/20 transition-all"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-subtle" />
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" className="mt-2">
            <span>Envoyer le lien de réinitialisation</span>
          </Button>
        </form>
      )}

      {/* Lien Retour */}
      <div className="pt-2">
        <Link
          href="/connexion"
          className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Retour à la connexion</span>
        </Link>
      </div>
    </div>
  );
}
