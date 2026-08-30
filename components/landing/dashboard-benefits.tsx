import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowRight } from "lucide-react";

export function LandingDashboardBenefits() {
  const benefits = [
    "Commandes en production & à livrer sous 3 jours",
    "Alertes sur les commandes en retard identifiées immédiatement",
    "Suivi financier des soldes et acomptes à encaisser",
    "Fiches clients avec profils de mesures réutilisables",
    "Suivi précis des étapes de coupe, couture et essayage",
    "Accès instantané depuis smartphone et ordinateur",
  ];

  return (
    <section className="py-16 md:py-24 bg-surface-muted/50 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Texte & Bénéfices (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-800">
                Votre atelier en un coup d&apos;œil
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-primary-950 sm:text-4xl">
                Chaque matin, sachez exactement quoi faire.
              </h2>
            </div>

            <p className="text-sm text-text-muted sm:text-base leading-relaxed">
              Le tableau de bord Fildor vous montre les livraisons du jour, les retards évités,
              le solde total à encaisser et les commandes urgentes de l&apos;atelier.
            </p>

            <ul className="space-y-2.5 pt-1">
              {benefits.map((b, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-text font-medium">
                  <CheckCircle className="size-4 text-primary-800 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Encadré de bénéfice */}
            <div className="rounded-xl border border-primary-800/20 bg-primary-50/70 p-4">
              <p className="text-xs sm:text-sm font-semibold text-primary-950 leading-relaxed">
                💡 Au lieu de fouiller dans plusieurs cahiers et conversations WhatsApp,
                retrouvez toutes vos activités dans un tableau de bord clair et sécurisé.
              </p>
            </div>

            <div>
              <Link
                href="/tableau-de-bord"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-primary-800 transition-all cursor-pointer"
              >
                <span>Accéder au tableau de bord</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Vraie Capture d'écran du Tableau de bord (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-surface overflow-hidden shadow-2xl">
            {/* Barre supérieure de fenêtre */}
            <div className="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-400/80 inline-block" />
                <span className="size-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="size-3 rounded-full bg-emerald-400/80 inline-block" />
                <span className="ml-2 text-xs font-semibold text-text-muted">
                  Fildor — Tableau de bord
                </span>
              </div>
              <span className="text-[10px] font-bold text-success bg-success-bg px-2.5 py-0.5 rounded-full">
                Temps réel
              </span>
            </div>

            <div className="relative w-full aspect-[16/10] bg-canvas overflow-hidden">
              <Image
                src="/screenshots/dashboard.png"
                alt="Tableau de bord de l'atelier Fildor"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
