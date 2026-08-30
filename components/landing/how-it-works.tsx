import Link from "next/link";
import { UserCheck, Sparkles, Scissors, CheckCircle, ArrowRight } from "lucide-react";

export function LandingHowItWorks() {
  const steps = [
    {
      num: "01",
      icon: UserCheck,
      title: "Ajoutez votre client et ses mesures",
      text: "Enregistrez ses coordonnées, ses préférences et plusieurs profils de mesures anatomiques réutilisables.",
    },
    {
      num: "02",
      icon: Sparkles,
      title: "Créez une commande claire",
      text: "Ajoutez le modèle, les photos d'inspiration, le prix de confection, la date de livraison promise et les détails du tissu.",
    },
    {
      num: "03",
      icon: Scissors,
      title: "Suivez la confection",
      text: "Faites évoluer la tenue de la coupe à la couture, à l'essayage, à la retouche et jusqu'à la mise à disposition.",
    },
    {
      num: "04",
      icon: CheckCircle,
      title: "Livrez et fidélisez",
      text: "Prévenez votre client sur WhatsApp, partagez un reçu ou un bon de commande et gardez un historique pour ses prochaines tenues.",
    },
  ];

  return (
    <section id="comment-ca-marche" className="py-16 md:py-24 bg-surface-muted/60 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* En-tête de section */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-800">
            Simple à utiliser au quotidien
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            De la première prise de mesure à la livraison, tout reste sous contrôle.
          </h2>
          <p className="text-sm text-text-muted sm:text-base leading-relaxed">
            Fildor respecte les habitudes de votre atelier. Vous organisez simplement mieux ce que vous faites déjà.
          </p>
        </div>

        {/* 4 Étapes */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-border bg-surface p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-primary-900/30">
                      {step.num}
                    </span>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-900">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-text mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-primary-800 transition-all cursor-pointer"
          >
            <span>Commencer avec ma première commande</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
