import Link from "next/link";
import { Users2, ShieldCheck, HeartHandshake, ArrowRight, Scissors } from "lucide-react";

export function LandingPilotProgram() {
  return (
    <section className="py-16 md:py-24 bg-surface-muted/60 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 text-accent-700 px-3.5 py-1 text-xs font-bold border border-accent-100">
            <Scissors className="size-3.5 text-accent-600" />
            <span>Construit avec les ateliers</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Fildor se construit avec celles et ceux qui font vivre la mode au quotidien.
          </h2>

          <p className="text-sm text-text-muted sm:text-base leading-relaxed max-w-2xl mx-auto">
            Nous travaillons étroitement avec des couturiers, stylistes et chefs d'ateliers pour concevoir
            une application qui correspond réellement à vos habitudes de travail, à vos contraintes de terrain
            et à votre relation client sur WhatsApp.
          </p>

          <div className="grid gap-4 sm:grid-cols-3 pt-4 text-left">
            <div className="rounded-xl border border-border bg-surface p-4 shadow-xs space-y-2">
              <Users2 className="size-5 text-primary-900" />
              <h4 className="text-sm font-bold text-text">Écoute active</h4>
              <p className="text-xs text-text-muted">
                Vos retours directs orientent chaque amélioration et nouveauté de Fildor.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 shadow-xs space-y-2">
              <ShieldCheck className="size-5 text-primary-900" />
              <h4 className="text-sm font-bold text-text">Données protégées</h4>
              <p className="text-xs text-text-muted">
                L'intégralité des mesures et clients de votre atelier reste strictement confidentielle.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 shadow-xs space-y-2">
              <HeartHandshake className="size-5 text-primary-900" />
              <h4 className="text-sm font-bold text-text">Accompagnement</h4>
              <p className="text-xs text-text-muted">
                Un support réactif et chaleureux pour vous aider dans la prise en main.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-primary-800 transition-all cursor-pointer"
            >
              <span>Devenir atelier pilote</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
