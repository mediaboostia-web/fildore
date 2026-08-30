import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Zap } from "lucide-react";

export function LandingWhyFildorSection() {
  const comparisons = [
    {
      situation: "1. La cliente revient 6 mois après",
      before: "Vous devez reprendre toutes les mesures de zéro (20 min perdues).",
      after: "Ses mensurations complètes sont retrouvées en 2 secondes sur votre téléphone.",
    },
    {
      situation: "2. Le client verse un acompte",
      before: "Noté sur un bout de papier qui s'égare. Dispute sur le solde restant.",
      after: "Reçu et facture A4 générés immédiatement avec partage WhatsApp direct.",
    },
    {
      situation: "3. La tenue est prête à l'atelier",
      before: "Le vêtement traîne sur le cintre parce qu'on a oublié de prévenir le client.",
      after: "Un clic sur « WhatsApp » et le client reçoit son invitation d'essayage.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-[#F2F7F4] via-[#F8FAF9] to-surface border-b border-border/80 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* En-tête de section (Compris en 3 secondes) */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3.5 py-1 text-xs font-bold text-primary-900 border border-primary-200">
            <Zap className="size-3.5" />
            <span>Pourquoi Fildor ?</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-primary-950">
            La différence entre gérer son atelier au hasard et <span className="text-primary-800">avec Fildor</span>.
          </h2>

          <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
            3 situations courantes qui prouvent pourquoi Fildor est l&apos;outil indispensable de votre quotidien.
          </p>
        </div>

        {/* Grille de comparaison claire & lisible en 3 secondes */}
        <div className="grid gap-6 md:grid-cols-3">
          {comparisons.map((c, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md hover:border-primary-800/40 transition-all"
            >
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-primary-950 border-b border-border pb-2.5">
                  {c.situation}
                </h3>

                {/* Bloc Avant (Sans Fildor) */}
                <div className="rounded-xl border border-danger/20 bg-danger-bg/50 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-danger">
                    <XCircle className="size-4 shrink-0" />
                    <span>Sans Fildor</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {c.before}
                  </p>
                </div>

                {/* Bloc Avec Fildor */}
                <div className="rounded-xl border border-success/30 bg-success-bg/60 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-success">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>Avec Fildor</span>
                  </div>
                  <p className="text-xs font-semibold text-text leading-relaxed">
                    {c.after}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA direct */}
        <div className="text-center pt-2">
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-7 py-3.5 text-sm font-bold text-white shadow-md hover:bg-primary-800 active:scale-98 transition-all cursor-pointer"
          >
            <span>Passer mon atelier sur Fildor gratuitement</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
