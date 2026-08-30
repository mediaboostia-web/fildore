import Link from "next/link";
import { ArrowRight, UserCheck, Scissors, MessageCircle } from "lucide-react";

export function LandingHowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Prise de mesures & tissu",
      desc: "Créez une fiche client avec ses mensurations complètes et rattachez le modèle ou le tissu choisi.",
      icon: UserCheck,
    },
    {
      num: "2",
      title: "Suivi de confection & acompte",
      desc: "Faites évoluer la tenue de la coupe à l'essayage et enregistrez les acomptes versés en toute sécurité.",
      icon: Scissors,
    },
    {
      num: "3",
      title: "Livraison & WhatsApp en 1 clic",
      desc: "Prévenez votre client dès que c'est prêt avec son récapitulatif et imprimez la facture d'atelier.",
      icon: MessageCircle,
    },
  ];

  const stats = [
    { value: "+500", label: "Ateliers équipés" },
    { value: "100%", label: "Mesures protégées" },
    { value: "0 Retard", label: "Délais maîtrisés" },
  ];

  return (
    <section id="comment-ca-marche" className="py-16 md:py-24 bg-surface border-b border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Colonne Gauche : Composition visuelle avec grand cercle d'arrière-plan et 3 cartes en cascade */}
          <div className="lg:col-span-6 relative flex justify-center py-4">
            {/* Grand disque vert sauge d'arrière-plan inspiré de la capture */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[340px] sm:size-[430px] rounded-full bg-primary-100/70 pointer-events-none -z-0" />

            {/* 3 Cartes flottantes étagées */}
            <div className="relative z-10 w-full max-w-md space-y-4 sm:space-y-6">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className={`relative rounded-2xl border border-border/80 bg-surface p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      idx === 1 ? "sm:ml-8" : idx === 2 ? "sm:ml-4" : ""
                    }`}
                  >
                    {/* Numéro flottant en haut à gauche */}
                    <div className="absolute -top-3.5 -left-3 size-8 rounded-xl bg-primary-900 text-white flex items-center justify-center text-xs font-black shadow-md">
                      {step.num}
                    </div>

                    <div className="flex items-start gap-3.5 pt-1">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-900">
                        <Icon className="size-4.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-text">
                          {step.title}
                        </h3>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colonne Droite : Titre, Explications et Chiffres clés alignés */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-0.5 w-6 bg-primary-900 inline-block rounded-full" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary-900">
                  Comment ça marche
                </span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-primary-950 sm:text-4xl lg:text-5xl leading-tight">
                La façon la plus simple de{" "}
                <span className="text-primary-800">gérer votre atelier</span>
              </h2>

              <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-lg">
                Fildor remplace les cahiers papier qui s&apos;égarent et simplifie chaque étape du travail des maîtres tailleurs, modélistes et couturières. Tout se fait sur votre téléphone en quelques secondes.
              </p>
            </div>

            {/* 3 Statistiques alignées horizontalement comme sur la capture */}
            <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-black text-primary-950 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs font-semibold text-text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Bouton CTA */}
            <div className="pt-2">
              <Link
                href="/inscription"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-7 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-primary-800 active:scale-98 transition-all cursor-pointer"
              >
                <span>Essayer gratuitement</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
