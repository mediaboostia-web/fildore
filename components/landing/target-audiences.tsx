import Link from "next/link";
import Image from "next/image";
import { User, Users, Building2, Palette, Layers, ArrowRight } from "lucide-react";

export function LandingTargetAudiences() {
  const audiences = [
    {
      icon: User,
      title: "Couturier ou couturière solo",
      text: "Gardez vos commandes, mesures et acomptes bien rangés sur votre smartphone sans risquer de perdre vos cahiers.",
      image: "/Une Couturière Africaine Coud Avec Diligence Des Vêtements à Laide De Machines Dans Son Bureau De Tailleur Photo Et Image en Téléchargement Gratuit - Pngtree.jpg",
      objectPosition: "object-top",
    },
    {
      icon: Users,
      title: "Petit atelier (2 à 5 personnes)",
      text: "Répartissez la coupe et la couture, suivez les dates d'essayage et éliminez les retards de livraison.",
      image: "/Images pro.jpg",
      objectPosition: "object-center",
    },
    {
      icon: Building2,
      title: "Maison de couture (5 à 20 personnes)",
      text: "Gérez les commandes sur mesure complexes, générez des factures professionnelles et coordonnez votre équipe.",
      image: "/Construction of $11_07-mn garment factory begins in northern Ghana.jpg",
      objectPosition: "object-center",
    },
    {
      icon: Palette,
      title: "Styliste ou créateur de mode",
      text: "Valorisez vos créations en un catalogue soigné et partagez vos modèles directement avec vos clients.",
      image: "/Je suis votre modéliste.jpg",
      objectPosition: "object-top",
    },
    {
      icon: Layers,
      title: "Commandes de groupe & uniformes",
      text: "Centralisez les mensurations multiples, les livraisons en série pour écoles ou entreprises et les factures globales.",
      image: "/La couture et la mode inclusive.jpg",
      objectPosition: "object-center",
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <div
                key={idx}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-surface overflow-hidden shadow-xs transition-all duration-200 hover:border-primary-800 hover:shadow-xl"
              >
                {/* Photo bien proportionnée sans découpage des visages */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-primary-950">
                  <Image
                    src={aud.image}
                    alt={aud.title}
                    fill
                    className={`object-cover ${aud.objectPosition} transition-transform duration-500 group-hover:scale-105`}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Contenu textuel aéré avec icône et titre */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-900 shadow-xs">
                        <Icon className="size-4.5" />
                      </div>
                      <h3 className="text-base font-bold text-text">
                        {aud.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed pt-1">
                      {aud.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Carte CTA d'intégration */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary-800 bg-primary-900 p-6 sm:p-7 text-white shadow-xl">
            <div className="space-y-4">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-accent-100 bg-primary-950/40 px-3 py-1 rounded-full">
                Rejoignez le mouvement
              </span>
              <h3 className="text-xl font-bold text-white leading-snug">
                Votre atelier mérite le meilleur outil
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Testez Fildor dès aujourd'hui sur vos premières commandes et constatez la différence.
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="/inscription"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary-950 shadow-md hover:bg-surface-muted transition-all cursor-pointer"
              >
                <span>Fildor est fait pour mon atelier</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
