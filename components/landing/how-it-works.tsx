import Link from "next/link";
import Image from "next/image";
import { UserCheck, Scissors, MessageCircle, ArrowRight } from "lucide-react";

export function LandingHowItWorks() {
  const steps = [
    {
      num: "01",
      icon: UserCheck,
      title: "Enregistrez le client & ses mesures",
      text: "Créez une fiche client avec ses mensurations exactes (poitrine, taille, carrure, longueur) et rattachez la photo du tissu ou le modèle choisi.",
      image: "/images/modele_couture_afrique.jpg",
      alt: "Modèle de robe wax africaine et prise de mesures",
    },
    {
      num: "02",
      icon: Scissors,
      title: "Suivez la confection & l'acompte",
      text: "Faites passer la commande de la coupe à l'assemblage et à l'essayage. Enregistrez l'acompte versé pour garder une trace financière nette.",
      image: "/images/tailor-craft.jpg",
      alt: "Confection et couture minutieuse en atelier",
    },
    {
      num: "03",
      icon: MessageCircle,
      title: "Livrez à temps & prévenez sur WhatsApp",
      text: "Dès que la tenue est prête, envoyez un message WhatsApp en 1 clic avec le récapitulatif et le solde restant. Imprimez la facture si besoin.",
      image: "/images/tailor-boutique.jpg",
      alt: "Tenue prête et remise au client avec facture",
    },
  ];

  return (
    <section id="comment-ca-marche" className="py-16 md:py-24 bg-surface-muted/50 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* En-tête de section */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="inline-block rounded-full bg-primary-100 px-3.5 py-1 text-xs font-bold text-primary-900 uppercase tracking-wider">
            Comment ça marche
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-primary-950 sm:text-4xl">
            3 étapes simples pour organiser votre atelier
          </h2>
          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
            Fildor s&apos;adapte aux réalités de votre quotidien : pas de jargon technique, tout est pensé pour aller vite sur votre téléphone.
          </p>
        </div>

        {/* Grille des 3 étapes avec numéros en arrière-plan */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-border bg-surface overflow-hidden shadow-xs flex flex-col justify-between transition-all hover:shadow-md hover:border-primary-800"
              >
                {/* Photo de l'étape */}
                <div className="relative h-48 w-full overflow-hidden bg-primary-950">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Numéro incrusté */}
                  <span className="absolute top-3 left-3 flex size-9 items-center justify-center rounded-xl bg-surface text-sm font-black text-primary-950 shadow-sm">
                    {step.num}
                  </span>
                </div>

                <div className="relative p-6 flex-1 flex flex-col justify-between space-y-4">
                  {/* Grand filigrane du numéro en arrière-plan */}
                  <span className="absolute right-4 bottom-2 text-7xl font-black text-primary-900/5 select-none pointer-events-none">
                    {step.num}
                  </span>

                  <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary-100 text-primary-900 shrink-0">
                        <Icon className="size-4.5" />
                      </div>
                      <h3 className="text-base font-bold text-text">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action sous les étapes */}
        <div className="text-center pt-2">
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-7 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-primary-800 active:scale-98 transition-all cursor-pointer"
          >
            <span>Tester avec ma première commande</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
