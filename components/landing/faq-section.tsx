"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function LandingFAQSection() {
  const faqs = [
    {
      q: "Fildor est-il réservé aux grands ateliers ?",
      a: "Non. Fildor est conçu pour les couturiers indépendants, les petits ateliers et les maisons de couture. Vous pouvez commencer seul et inviter vos collaborateurs au fur et à mesure que votre activité grandit.",
    },
    {
      q: "Puis-je utiliser Fildor sur mon téléphone ?",
      a: "Oui, absolument. Fildor est conçu d'abord pour mobile afin que vous puissiez enregistrer un client, consulter une mesure ou vérifier une commande depuis l'atelier, au marché aux tissus ou chez un client.",
    },
    {
      q: "Puis-je garder et réutiliser les mesures de mes clients ?",
      a: "Oui. Chaque client peut posséder plusieurs profils de mesures (Robe, Boubou, Costume, Chemise, etc.). Lors d'une nouvelle commande, vous sélectionnez son profil en un clic et les mesures sont automatiquement associées.",
    },
    {
      q: "Puis-je envoyer une facture ou un devis par WhatsApp ?",
      a: "Oui. Chaque facture ou devis dispose d'un bouton de partage direct vers WhatsApp pour l'envoyer au client en quelques secondes.",
    },
    {
      q: "Mes données et mes mesures sont-elles protégées ?",
      a: "Oui. Les données de votre atelier sont strictement isolées. Aucun autre atelier ne peut consulter vos fiches clients, vos commandes ou vos mesures corporelles.",
    },
    {
      q: "Fildor fonctionne-t-il dans mon pays ?",
      a: "Fildor est optimisé pour les ateliers d'Afrique de l'Ouest et d'Afrique francophone (Bénin, Côte d'Ivoire, Sénégal, Togo, Cameroun, etc.) avec la gestion native du Franc CFA (XOF / XAF).",
    },
    {
      q: "Puis-je ajouter les membres de mon équipe ?",
      a: "Oui. Vous pouvez inviter vos apprentis, couturiers, réceptionnistes et leur attribuer des accès adaptés à leur rôle dans l'atelier.",
    },
    {
      q: "Dois-je abandonner WhatsApp pour utiliser Fildor ?",
      a: "Non, au contraire ! Fildor fonctionne main dans la main avec WhatsApp : confirmations de commande, rappels d'essayage, avis de commande prête et devis sont préparés en un clic pour WhatsApp.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 md:py-24 bg-surface-muted/60 border-y border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* En-tête de section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 text-primary-900 px-3.5 py-1 text-xs font-bold border border-primary-100">
            <HelpCircle className="size-3.5" />
            <span>Foire aux questions</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="text-sm text-text-muted max-w-xl mx-auto">
            Tout ce que vous devez savoir pour démarrer sereinement avec Fildor dans votre atelier.
          </p>
        </div>

        {/* Accordéon FAQ */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-text hover:text-primary-900 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-text-subtle transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary-900" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-border/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
