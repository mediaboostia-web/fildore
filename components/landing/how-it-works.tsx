import Link from "next/link";
import Image from "next/image";
import { UserCheck, Sparkles, Scissors, CheckCircle, ArrowRight } from "lucide-react";

export function LandingHowItWorks() {
  const steps = [
    {
      num: "01",
      icon: UserCheck,
      title: "Ajoutez votre client et ses mesures",
      text: "Enregistrez ses coordonnées, ses préférences et plusieurs profils de mesures réutilisables.",
      image: "/image couture.jpg",
      alt: "Prise de mesures et tissus d'atelier",
    },
    {
      num: "02",
      icon: Sparkles,
      title: "Créez une commande claire",
      text: "Ajoutez le modèle, le prix de confection, la date de livraison promise et les détails du tissu.",
      image: "/Je suis votre modéliste.jpg",
      alt: "Création et modélisme de vêtement",
    },
    {
      num: "03",
      icon: Scissors,
      title: "Suivez la confection",
      text: "Faites évoluer la tenue de la coupe à la couture, à l'essayage et jusqu'à la mise à disposition.",
      image: "/Une Couturière Africaine Coud Avec Diligence Des Vêtements à Laide De Machines Dans Son Bureau De Tailleur Photo Et Image en Téléchargement Gratuit - Pngtree.jpg",
      alt: "Couture sur machine en atelier",
    },
    {
      num: "04",
      icon: CheckCircle,
      title: "Livrez et fidélisez",
      text: "Prévenez votre client sur WhatsApp, partagez un reçu ou une facture et gardez l'historique.",
      image: "/Image propre.jpg",
      alt: "Tenue finie prête pour le client",
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

        {/* 4 Étapes avec photos d'atelier réelles */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-border bg-surface overflow-hidden shadow-xs flex flex-col justify-between transition-all hover:shadow-lg hover:border-primary-800"
              >
                {/* Photo de l'étape */}
                <div className="relative h-44 w-full overflow-hidden bg-primary-950">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 flex size-8 items-center justify-center rounded-xl bg-surface/90 backdrop-blur-md text-xs font-black text-primary-950 shadow-xs">
                    {step.num}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-primary-50 text-primary-900">
                        <Icon className="size-4" />
                      </div>
                      <h3 className="text-sm font-bold text-text line-clamp-1">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {step.text}
                    </p>
                  </div>
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
