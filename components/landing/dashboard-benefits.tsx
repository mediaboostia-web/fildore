import Link from "next/link";
import { LayoutDashboard, CheckCircle, ArrowRight, Clock, AlertTriangle, Ruler, Scissors } from "lucide-react";

export function LandingDashboardBenefits() {
  const kpis = [
    { label: "À livrer aujourd'hui", value: "3 commandes", color: "text-text", bg: "bg-surface" },
    { label: "En retard", value: "0 incident", color: "text-success", bg: "bg-success-bg/60" },
    { label: "Essayages prévus", value: "4 rendez-vous", color: "text-primary-900", bg: "bg-primary-50" },
    { label: "Mesures enregistrées", value: "48 profils", color: "text-text", bg: "bg-surface" },
  ];

  const benefits = [
    "À livrer aujourd'hui & cette semaine",
    "Commandes en retard identifiées immédiatement",
    "Essayages programmés et rappelés",
    "Profils de mesures réutilisables d'un geste",
    "Suivi précis des étapes de confection",
    "Journal d'activité en temps réel pour l'atelier",
  ];

  return (
    <section className="py-16 md:py-24 bg-surface-muted/50 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Texte & Bénéfices */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-800">
                Votre atelier en un coup d'œil
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-4xl">
                Chaque matin, sachez exactement quoi faire.
              </h2>
            </div>

            <p className="text-sm text-text-muted sm:text-base leading-relaxed">
              Le tableau de bord Fildor vous montre les livraisons du jour, les commandes urgentes,
              les essayages à préparer et les actions prioritaires de votre équipe.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {benefits.map((b, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-text font-medium">
                  <CheckCircle className="size-4 text-primary-800 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Encadré de bénéfice */}
            <div className="rounded-xl border border-primary-800/20 bg-primary-50/70 p-4">
              <p className="text-xs sm:text-sm font-semibold text-primary-950 leading-relaxed">
                💡 Au lieu de fouiller dans plusieurs cahiers et conversations WhatsApp,
                retrouvez les informations importantes dans un seul tableau de bord clair.
              </p>
            </div>

            <div>
              <Link
                href="/tableau-de-bord"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-800 transition-all cursor-pointer"
              >
                <span>Voir le tableau de bord en direct</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Simulation Visuelle Carte Dashboard */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary-900 text-white">
                  <LayoutDashboard className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text">Tableau de bord opérationnel</h4>
                  <p className="text-xs text-text-muted">Vue d'ensemble matinale</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-success bg-success-bg px-2.5 py-1 rounded-full">
                À jour
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {kpis.map((kpi, idx) => (
                <div key={idx} className={`rounded-xl border border-border p-3.5 ${kpi.bg}`}>
                  <span className="text-[11px] font-medium text-text-muted block truncate">
                    {kpi.label}
                  </span>
                  <p className={`text-base sm:text-lg font-bold mt-1 ${kpi.color}`}>
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-canvas/60 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text">Prochaine action prioritaire</span>
                <span className="text-primary-800 font-semibold">14h00</span>
              </div>
              <p className="text-xs text-text-muted">
                Essayage Robe sirène pour <strong>Aïcha D.</strong> · Tissu Wax Hollandais prêt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
