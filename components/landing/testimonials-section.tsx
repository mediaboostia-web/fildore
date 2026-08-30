import Image from "next/image";
import { Star, Quote, CheckCircle2 } from "lucide-react";

export function LandingTestimonialsSection() {
  const testimonials = [
    {
      name: "Rolande Adjovi",
      role: "Fondatrice & Maître Tailleur",
      atelier: "Atelier Sublime Couture",
      city: "Cotonou, Bénin",
      image: "/images/tailor-testimonial-1.jpg",
      quote:
        "Avant Fildor, je notais les mesures sur des morceaux de papier ou des cahiers d'écolier que je perdais constamment. Maintenant, je retrouve les mensurations d'une cliente en 2 secondes sur mon téléphone, même 1 an après !",
      highlight: "Zéro mesure perdue depuis 8 mois",
    },
    {
      name: "Moussa Konaté",
      role: "Styliste & Modéliste",
      atelier: "Maison Prestige Homme",
      city: "Abidjan, Côte d'Ivoire",
      image: "/images/tailor-workshop.jpg",
      quote:
        "Le bouton d'envoi WhatsApp avec le montant de l'acompte et le solde restant a tout changé. Mes clients reçoivent leur reçu propre et il n'y a plus aucune contestation de prix le jour de la livraison.",
      highlight: "Acomptes sécurisés & traçabilité",
    },
    {
      name: "Fatou Ndiaye",
      role: "Créatrice de Mode & Robes de Mariée",
      atelier: "Élégance Afro-Chic",
      city: "Dakar, Sénégal",
      image: "/images/tailor-testimonial-2.jpg",
      quote:
        "Gérer 25 commandes urgentes pour la période des mariages était un cauchemar de stress. Avec le suivi des étapes et les dates de livraison bien visibles, nous livrons toujours nos tenues à l'heure.",
      highlight: "Livraisons toujours à temps",
    },
  ];

  return (
    <section id="temoignages" className="py-16 md:py-24 bg-gradient-to-b from-[#FAF7F2] via-[#FFFDFC] to-surface relative overflow-hidden border-b border-border/80">
      {/* Halo subtil terre cuite */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-accent-100/35 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* En-tête de section */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="inline-block rounded-full bg-primary-100 px-3.5 py-1 text-xs font-bold text-primary-900 uppercase tracking-wider">
            Témoignages Ateliers
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-primary-950 sm:text-4xl">
            Ce que les couturiers et stylistes disent de Fildor
          </h2>
          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
            Découvrez comment des ateliers indépendants et des maisons de confection ont transformé leur organisation quotidienne.
          </p>
        </div>

        {/* Grille des 3 grands témoignages */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-xs hover:shadow-md transition-all relative"
            >
              <div className="space-y-4">
                {/* Étoiles & Badge de vérification */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success-bg px-2 py-0.5 rounded-full border border-success/20">
                    <CheckCircle2 className="size-3" />
                    Atelier vérifié
                  </span>
                </div>

                {/* Citation */}
                <p className="text-sm text-text leading-relaxed font-normal">
                  « {t.quote} »
                </p>

                {/* Badge point fort */}
                <div className="pt-1">
                  <span className="inline-block text-[11px] font-semibold text-primary-900 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200">
                    ✔ {t.highlight}
                  </span>
                </div>
              </div>

              {/* Auteur du témoignage */}
              <div className="flex items-center gap-3 pt-6 mt-4 border-t border-border">
                <div className="relative size-12 rounded-full overflow-hidden ring-2 ring-primary-900/10 shrink-0">
                  <Image src={t.image} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text">{t.name}</h3>
                  <p className="text-xs text-text-muted">{t.role}</p>
                  <p className="text-[11px] font-medium text-primary-800">{t.atelier} · {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
