"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Check, ArrowRight, Send, CheckCheck } from "lucide-react";

export function LandingWhatsAppSection() {
  const scenarios = [
    {
      id: "prete",
      moment: "Commande prête",
      summary: "Message de retrait ou invitation essayage",
      sender: "Atelier Élégance",
      message: `Bonjour Aïcha,\n\nVotre commande FIL-CTN-000124 (Robe sirène cérémonie) est prête pour l'essayage.\n\nMontant total : 35 000 FCFA\nAcompte reçu : 15 000 FCFA\nSolde restant : 20 000 FCFA\n\nVous pouvez passer à l'atelier du lundi au samedi, de 9h à 19h.\nMerci de votre confiance.`,
      time: "10:32",
    },
    {
      id: "confirmation",
      moment: "Commande créée",
      summary: "Confirmation avec récapitulatif & acompte attendu",
      sender: "Atelier Élégance",
      message: `Bonjour Koffi, 👋\n\nVotre commande FIL-CTN-000125 pour Ensemble homme brodé a bien été enregistrée.\n\n📅 Date de livraison convenue : 6 septembre 2026\n💰 Montant total : 30 000 FCFA\n⏳ Acompte attendu : 15 000 FCFA\n\nÀ très vite chez Atelier Élégance !`,
      time: "11:15",
    },
    {
      id: "acompte",
      moment: "Acompte reçu",
      summary: "Confirmation du paiement & démarrage confection",
      sender: "Atelier Élégance",
      message: `Bonjour Mme Agbodjan, 🧾\n\nNous confirmons la bonne réception de votre acompte de 20 000 FCFA par MTN Mobile Money. La coupe de votre tenue est officiellement lancée !\n\nConsultez votre reçu ici : https://fildor.app/c/recu_4821\n\nBelle journée !`,
      time: "14:20",
    },
    {
      id: "solde",
      moment: "Solde restant",
      summary: "Rappel courtois avec montant dû",
      sender: "Atelier Élégance",
      message: `Bonjour M. Sanni,\n\nPetit rappel amical : votre commande FIL-CTN-000098 est prête. Le solde restant est de 10 000 FCFA payable au retrait en espèces ou MoMo.\n\nAu plaisir de vous accueillir !`,
      time: "16:45",
    },
  ];

  const [activeScenario, setActiveScenario] = useState(scenarios[0]);

  return (
    <section id="whatsapp" className="py-16 md:py-24 bg-surface-muted/70 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* En-tête de section */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F7EE] text-[#128C7E] px-3.5 py-1 text-xs font-bold">
            <MessageCircle className="size-3.5" />
            <span>Travaillez avec WhatsApp, pas contre WhatsApp</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Chaque commande peut devenir une conversation plus claire.
          </h2>
          <p className="text-sm text-text-muted sm:text-base leading-relaxed">
            Vos clients utilisent déjà WhatsApp. Fildor vous aide à leur envoyer les bonnes informations
            au bon moment, sans devoir réécrire les mêmes messages chaque jour.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-center">
          {/* Sélecteur de scénarios (Gauche) */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
              Moments clés du suivi client :
            </h3>

            {scenarios.map((sc) => {
              const isSelected = activeScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setActiveScenario(sc)}
                  className={`w-full flex items-center justify-between rounded-xl border p-4 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#128C7E] bg-surface shadow-sm ring-1 ring-[#128C7E]"
                      : "border-border bg-surface/70 hover:bg-surface hover:border-border-strong"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-text block">{sc.moment}</span>
                    <span className="text-xs text-text-muted">{sc.summary}</span>
                  </div>
                  {isSelected ? (
                    <span className="flex size-6 items-center justify-center rounded-full bg-[#128C7E] text-white">
                      <Check className="size-3.5" />
                    </span>
                  ) : (
                    <ArrowRight className="size-4 text-text-subtle" />
                  )}
                </button>
              );
            })}

            <div className="pt-3">
              <Link
                href="/messages"
                className="inline-flex items-center gap-2 text-xs font-bold text-primary-900 hover:text-accent-600 transition-colors"
              >
                <span>Découvrir les 11 templates disponibles dans Fildor</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Simulateur WhatsApp Vivant (Droite) */}
          <div className="lg:col-span-6">
            <div className="mx-auto max-w-md rounded-2xl border border-border bg-[#ECE5DD] shadow-xl overflow-hidden">
              {/* Header WhatsApp */}
              <div className="bg-[#075E54] p-3.5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#128C7E] font-bold text-xs">
                    AE
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-tight">{activeScenario.sender}</p>
                    <p className="text-[10px] text-white/80">en ligne</p>
                  </div>
                </div>
                <MessageCircle className="size-5 text-white/80" />
              </div>

              {/* Corps de discussion */}
              <div className="p-4 space-y-3 min-h-[260px] flex flex-col justify-end">
                {/* Bulle de message envoyé */}
                <div className="max-w-[90%] self-end rounded-lg rounded-tr-none bg-[#DCF8C6] p-3.5 text-xs text-[#303030] shadow-xs space-y-1.5 animate-in fade-in duration-150">
                  <p className="whitespace-pre-line leading-relaxed">{activeScenario.message}</p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-black/50 pt-1">
                    <span>{activeScenario.time}</span>
                    <CheckCheck className="size-3.5 text-[#34B7F1]" />
                  </div>
                </div>
              </div>

              {/* Footer WhatsApp */}
              <div className="bg-[#F0F0F0] p-2.5 flex items-center gap-2 border-t border-black/5">
                <div className="flex-1 rounded-full bg-white px-3.5 py-1.5 text-xs text-text-subtle border border-black/5">
                  Message préparé automatiquement par Fildor...
                </div>
                <div className="flex size-8 items-center justify-center rounded-full bg-[#128C7E] text-white">
                  <Send className="size-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
