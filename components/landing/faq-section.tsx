"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const FAQS = [
  {
    q: "Comment Fildor m'aide-t-il à ne plus perdre les mesures de mes clients ?",
    a: "Chaque client dispose de sa propre fiche sécurisée sur votre smartphone. Vous pouvez enregistrer plusieurs profils de mesures (Robe, Boubou, Chemise, Costume, Enfant). Dès qu'un client revient, vous retrouvez ses mensurations en 2 secondes sans chercher dans des vieux cahiers.",
  },
  {
    q: "Puis-je utiliser Fildor directement sur mon téléphone portable ?",
    a: "Oui, absolument ! Fildor est optimisé à 100% pour smartphone Android et iPhone. Vous n'avez pas besoin d'ordinateur pour ajouter une commande, consulter une fiche de coupe ou générer un reçu de paiement.",
  },
  {
    q: "Comment fonctionne l'envoi des reçus et factures par WhatsApp ?",
    a: "En 1 clic, Fildor génère un message WhatsApp soigné et personnalisé contenant le détail de la commande, le montant versé, le solde restant et la date d'essayage. Vous pouvez aussi télécharger ou imprimer une facture professionnelle.",
  },
  {
    q: "Puis-je inviter mes apprentis et couturiers sur le compte de l'atelier ?",
    a: "Oui. Vous pouvez créer des accès pour vos collaborateurs (couturiers, apprentis, coupeurs). Chacun consulte uniquement les fiches de travail et étapes de confection qui le concernent, sans modifier vos finances.",
  },
  {
    q: "Mes données et mes photos de modèles sont-elles protégées ?",
    a: "Oui. Toutes vos données sont stockées de façon sécurisée et isolée. Vos profils de mesures, vos commandes et vos catalogues de créations restent votre propriété exclusive et ne sont jamais partagés.",
  },
  {
    q: "Fildor fonctionne-t-il avec le Franc CFA (FCFA) ?",
    a: "Oui, Fildor gère nativement le Franc CFA (XOF / XAF) ainsi que les spécificités des ateliers de confection et maisons de couture d'Afrique de l'Ouest et Centrale.",
  },
];

export function LandingFAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 md:py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* En-tête de section centré */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#128C7E]">
            FAQs
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-primary-950">
            Questions fréquemment posées
          </h2>
        </div>

        {/* Disposition en 2 colonnes : Montage photo à gauche + Accordéon à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Colonne Gauche : Montage de 3 photos d'immersion atelier */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[380px] sm:h-[460px] w-full max-w-md mx-auto">
              {/* Photo 1 (En haut à gauche) */}
              <div className="absolute top-0 left-0 w-[58%] h-[52%] rounded-3xl overflow-hidden border-2 border-white shadow-xl bg-primary-950">
                <Image
                  src="/images/tailor-workshop.jpg"
                  alt="Équipe d'atelier de couture"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Photo 2 (En haut à droite) */}
              <div className="absolute top-4 right-0 w-[50%] h-[48%] rounded-3xl overflow-hidden border-2 border-white shadow-xl bg-primary-950">
                <Image
                  src="/images/tailor-fabrics.jpg"
                  alt="Tissus et créations en atelier"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Photo 3 (Au centre / en bas - mise en avant) */}
              <div className="absolute bottom-0 left-6 right-6 h-[54%] rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-primary-950 z-10">
                <Image
                  src="/images/tailor-craft.jpg"
                  alt="Travail minutieux de confection sur-mesure"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 80vw, 30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="text-xs font-bold">Assistance & Support Fildor</p>
                  <p className="text-[11px] text-white/80">Disponible 7j/7 sur WhatsApp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Liste Accordéon interactif (Inspirée de la maquette jointe) */}
          <div className="lg:col-span-7 divide-y divide-border/80">
            {FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="py-4.5 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 text-left group cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-bold text-primary-950 group-hover:text-primary-800 transition-colors">
                      {faq.q}
                    </span>

                    {/* Petit bouton carré vert avec icône chevron comme la maquette */}
                    <div
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                        isOpen
                          ? "bg-[#173B36] text-white shadow-xs"
                          : "bg-[#173B36] text-white group-hover:bg-[#128C7E]"
                      )}
                    >
                      {isOpen ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </div>
                  </button>

                  {/* Contenu déroulant */}
                  {isOpen && (
                    <div className="mt-3 pr-8 text-sm text-text-muted leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
