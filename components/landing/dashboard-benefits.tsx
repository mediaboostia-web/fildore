import Link from "next/link";
import { LayoutDashboard, CheckCircle, ArrowRight, Scissors, Clock, AlertTriangle, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

          {/* Simulation Visuelle Réelle de l'App (7 cols - Correspondance exacte avec la capture utilisateur) */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-xl space-y-4">
            {/* Header miniature */}
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary-900">
                  <LayoutDashboard className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text">Tableau de bord</h4>
                  <p className="text-[10px] text-text-muted">Activité de l&apos;atelier en temps réel</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-success bg-success-bg px-2 py-0.5 rounded-full">
                En direct
              </span>
            </div>

            {/* 4 KPIs Réels de l'App */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl border border-border bg-surface p-3 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Production</span>
                  <Scissors className="size-3.5 text-primary-800" />
                </div>
                <p className="text-xl font-black text-text">38</p>
                <span className="text-[10px] text-text-subtle block truncate">En cours</span>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">À livrer</span>
                  <Clock className="size-3.5 text-warning" />
                </div>
                <p className="text-xl font-black text-text">3</p>
                <span className="text-[10px] text-warning font-semibold block truncate">Sous 3 jours</span>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">En retard</span>
                  <AlertTriangle className="size-3.5 text-danger" />
                </div>
                <p className="text-xl font-black text-danger">2</p>
                <span className="text-[10px] text-danger font-semibold block truncate">Prioritaire</span>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Solde</span>
                  <Wallet className="size-3.5 text-success" />
                </div>
                <p className="text-sm font-black text-success mt-1 truncate">649 000 F</p>
                <span className="text-[10px] text-text-subtle block truncate">À encaisser</span>
              </div>
            </div>

            {/* Cadre Commandes urgentes & délais proches (Identique à la capture réelle) */}
            <div className="rounded-xl border border-[#F6EBDD] bg-[#FFFBF7] p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <AlertTriangle className="size-3.5 text-warning" />
                  <span>Commandes urgentes & Délais proches</span>
                </div>
                <span className="text-[10px] font-semibold text-text-muted">5 prioritaires</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Commande 1 */}
                <div className="rounded-lg border border-border/80 bg-surface p-2.5 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary-900">FIL-CTN-000001</span>
                    <Badge tone="danger" className="text-[9px] px-1.5 py-0">En retard</Badge>
                  </div>
                  <p className="text-xs font-bold text-text">Robe soirée wax</p>
                  <p className="text-[10px] text-text-muted">Client : Adjoavi Houngbédji</p>
                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px]">
                    <span className="text-text-subtle">Échéance 22 août</span>
                    <span className="font-bold text-danger">Reste 20 000 FCFA</span>
                  </div>
                </div>

                {/* Commande 2 */}
                <div className="rounded-lg border border-border/80 bg-surface p-2.5 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary-900">FIL-CTN-000002</span>
                    <Badge tone="warning" className="text-[9px] px-1.5 py-0">Livraison imminente</Badge>
                  </div>
                  <p className="text-xs font-bold text-text">Costume trois pièces</p>
                  <p className="text-[10px] text-text-muted">Client : Serge Adjovi</p>
                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px]">
                    <span className="text-text-subtle">Échéance 25 août</span>
                    <span className="font-bold text-danger">Reste 30 000 FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
