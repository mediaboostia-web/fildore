import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export function LandingPricingSection() {
  const plans = [
    {
      name: "Découverte",
      price: "Gratuit",
      period: "pour commencer",
      desc: "Pour découvrir Fildor et organiser vos premières commandes.",
      features: [
        "Clients et commandes de base",
        "Profils de mesures corporelles",
        "Fiches et devis essentiels",
        "Partage de liens WhatsApp",
        "Accès smartphone et tablette",
      ],
      popular: false,
      ctaText: "Commencer gratuitement",
      ctaHref: "/inscription",
    },
    {
      name: "Starter",
      price: "5 000 FCFA",
      period: "/ mois",
      desc: "Pour le couturier indépendant qui souhaite professionnaliser son atelier.",
      features: [
        "Clients et commandes illimités",
        "Profils de mesures réutilisables",
        "Documents et factures A4 / tickets",
        "Messages WhatsApp préremplis",
        "Tableau de bord matinal complet",
        "Catalogue de modèles privé",
      ],
      popular: true,
      ctaText: "Choisir Starter",
      ctaHref: "/inscription?plan=starter",
    },
    {
      name: "Pro",
      price: "15 000 FCFA",
      period: "/ mois",
      desc: "Pour les ateliers de 2 à 10 personnes qui travaillent en équipe.",
      features: [
        "Tout ce qui est inclus dans Starter",
        "Jusqu'à 5 collaborateurs d'atelier",
        "Attribution et suivi des étapes de couture",
        "Catalogue de modèles partageable",
        "Rapports d'activité et livraisons",
        "Support prioritaire WhatsApp",
      ],
      popular: false,
      ctaText: "Choisir Pro",
      ctaHref: "/inscription?plan=pro",
    },
    {
      name: "Business",
      price: "Sur devis",
      period: "sur mesure",
      desc: "Pour les maisons de mode et ateliers à fort volume de production.",
      features: [
        "Tout ce qui est inclus dans Pro",
        "Équipe et utilisateurs illimités",
        "Multi-ateliers ou boutiques",
        "Accompagnement et formation sur site",
        "Personnalisation avancée",
      ],
      popular: false,
      ctaText: "Parler à l'équipe Fildor",
      ctaHref: "https://wa.me/22997000000?text=Bonjour,%20je%20souhaite%20en%20savoir%20plus%20sur%20Fildor%20Business",
    },
  ];

  return (
    <section id="tarifs" className="py-16 md:py-24 bg-gradient-to-b from-surface via-[#F3F8F5] to-surface relative overflow-hidden border-b border-border/80">
      {/* Halo émeraude */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-primary-100/35 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* En-tête de section */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-600">
            Commencez simplement. Évoluez quand votre atelier grandit.
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Un plan adapté à chaque étape de votre atelier.
          </h2>
          <p className="text-sm text-text-muted sm:text-base leading-relaxed">
            Commencez avec les fonctions essentielles, puis choisissez la formule adaptée à votre volume
            de commandes et à votre équipe.
          </p>
        </div>

        {/* Grille 4 cartes tarifaires */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all ${
                plan.popular
                  ? "border-primary-800 bg-primary-50/40 shadow-lg ring-2 ring-primary-900"
                  : "border-border bg-surface hover:shadow-md hover:border-border-strong"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-900 px-3 py-0.5 text-[11px] font-bold text-white shadow-xs">
                  Recommandé
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-text">{plan.name}</h3>
                  <p className="text-xs text-text-muted mt-1 leading-snug">{plan.desc}</p>
                </div>

                <div className="border-y border-border/60 py-3">
                  <span className="text-2xl font-extrabold text-primary-950">{plan.price}</span>
                  <span className="text-xs text-text-muted ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-2 text-xs text-text">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className="size-3.5 text-success shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-4 border-t border-border/60">
                <Link
                  href={plan.ctaHref}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    plan.popular
                      ? "bg-primary-900 text-white shadow-sm hover:bg-primary-800"
                      : "bg-surface text-text border border-border hover:bg-surface-muted hover:border-primary-800/40"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Note tarifaire */}
        <p className="text-center text-xs text-text-subtle max-w-2xl mx-auto">
          Tarification en Francs CFA (XOF / XAF), simple et sans engagement.
        </p>
      </div>
    </section>
  );
}
