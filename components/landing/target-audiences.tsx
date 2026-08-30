import Link from "next/link";
import { User, Users, Building2, Palette, Layers, ArrowRight } from "lucide-react";

export function LandingTargetAudiences() {
  const audiences = [
    {
      icon: User,
      title: "Couturier ou couturière solo",
      text: "Gardez vos commandes, mesures et acomptes bien rangés sur votre smartphone sans risquer de perdre vos cahiers.",
    },
    {
      icon: Users,
      title: "Petit atelier (2 à 5 personnes)",
      text: "Répartissez la coupe et la couture, suivez les dates d'essayage et éliminez les retards de livraison.",
    },
    {
      icon: Building2,
      title: "Maison de couture (5 à 20 personnes)",
      text: "Gérez les commandes sur mesure complexes, générez des factures professionnelles et coordonnez votre équipe.",
    },
    {
      icon: Palette,
      title: "Styliste ou créateur de mode",
      text: "Valorisez vos créations en un catalogue soigné et partagez vos modèles directement avec vos clients.",
    },
    {
      icon: Layers,
      title: "Commandes de groupe & uniformes",
      text: "Centralisez les mensurations multiples, les livraisons en série pour écoles ou entreprises et les factures globales.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* En-tête de section */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-600">
            Fildor s'adapte à votre façon de travailler
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Que vous travailliez seul ou en équipe, Fildor vous aide à rester serein.
          </h2>
        </div>

        {/* Grille des profils */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-border bg-canvas/40 p-6 transition-all hover:border-primary-800 hover:bg-surface hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary-900 text-white">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-text">{aud.title}</h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {aud.text}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Carte CTA d'intégration */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary-800 bg-primary-900 p-6 text-white shadow-md">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-100">
                Rejoignez le mouvement
              </span>
              <h3 className="text-lg font-bold text-white">Votre atelier mérite le meilleur outil</h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Testez Fildor dès aujourd'hui sur vos premières commandes et constatez la différence.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/inscription"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-primary-950 shadow-sm hover:bg-surface-muted transition-colors cursor-pointer"
              >
                <span>Fildor est fait pour mon atelier</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
