"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Users, Palette, CheckCircle2, ArrowRight, Sparkles, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const AUDIENCES = [
  {
    id: "solo",
    tabLabel: "Couturier Solo",
    icon: User,
    badge: "Indépendant & Créateur",
    title: "Pour les couturiers et couturières solo",
    description:
      "Finis les cahiers égarés et les oublis de mesures. Enregistrez chaque commande sur votre smartphone et travaillez l'esprit libre.",
    screenshot: "/screenshots/dashboard.png",
    screenshotAlt: "Tableau de bord Fildor - Suivi de production et mesures",
    benefits: [
      {
        icon: CheckCircle2,
        iconTone: "text-success",
        title: "Mesures protégées à vie",
        text: "Retrouvez instantanément le tour de poitrine, longueur robe ou épaule de chaque client.",
      },
      {
        icon: Clock,
        iconTone: "text-primary-800",
        title: "Alertes d'échéances sans stress",
        text: "Visualisez les tenues à livrer cette semaine et prévenez vos clients à temps.",
      },
      {
        icon: Sparkles,
        iconTone: "text-accent-600",
        title: "Reçus WhatsApp en 1 clic",
        text: "Partagez un récapitulatif clair de commande et le solde restant sans calculatrice.",
      },
    ],
    stats: { number: "100%", label: "Disponible sur smartphone Android & iPhone" },
  },
  {
    id: "atelier",
    tabLabel: "Atelier & Équipe",
    icon: Users,
    badge: "2 à 10 personnes",
    title: "Pour les ateliers de confection en équipe",
    description:
      "Répartissez la coupe, la couture et le repassage entre vos apprentis et couturiers. Éliminez les retards et les confusions de tissus.",
    screenshot: "/screenshots/documents.png",
    screenshotAlt: "Factures, reçus de paiement et documents d'atelier Fildor",
    benefits: [
      {
        icon: CheckCircle2,
        iconTone: "text-success",
        title: "Suivi des étapes en temps réel",
        text: "Coupe, assemblage, essayage, retouche : tout le monde sait exactement quoi faire.",
      },
      {
        icon: Shield,
        iconTone: "text-primary-800",
        title: "Sécurisation des acomptes",
        text: "Tracez chaque versement pour financer les tissus et fournitures en toute transparence.",
      },
      {
        icon: Sparkles,
        iconTone: "text-accent-600",
        title: "Fiches de travail claires",
        text: "Chaque commande a sa fiche imprimable ou consultable sans risque d'erreur.",
      },
    ],
    stats: { number: "0", label: "Retard de livraison évitable grâce au suivi" },
  },
  {
    id: "styliste",
    tabLabel: "Styliste & Modéliste",
    icon: Palette,
    badge: "Maison de mode & Créateurs",
    title: "Pour les stylistes, créateurs et sur-mesure",
    description:
      "Valorisez vos collections, partagez votre catalogue de modèles avec vos clients et traitez les commandes sur-mesure avec standing.",
    screenshot: "/screenshots/catalog.png",
    screenshotAlt: "Catalogue de modèles et créations de mode Fildor",
    benefits: [
      {
        icon: CheckCircle2,
        iconTone: "text-success",
        title: "Catalogue de créations soigné",
        text: "Ajoutez photos, prix de confection et métrages de tissus recommandés.",
      },
      {
        icon: Sparkles,
        iconTone: "text-accent-600",
        title: "Factures & Devis de standing",
        text: "Générez des factures professionnelles à l'image de votre marque.",
      },
      {
        icon: Clock,
        iconTone: "text-primary-800",
        title: "Commandes de groupe & cérémonies",
        text: "Gérez les mariages, uniformes et cortèges avec des mesures multiples.",
      },
    ],
    stats: { number: "2 sec", label: "Pour générer et partager un devis ou modèle" },
  },
];

export function LandingTargetAudiences() {
  const [activeTab, setActiveTab] = useState<string>("solo");
  const current = AUDIENCES.find((a) => a.id === activeTab) || AUDIENCES[0];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-surface">
      {/* Accent de fond doux */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 size-96 rounded-full bg-primary-100/40 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* En-tête de section */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-100">
            Fildor s&apos;adapte à votre façon de travailler
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-primary-950 sm:text-4xl">
            Que vous travailliez seul ou en équipe, Fildor vous aide à rester serein.
          </h2>
        </div>

        {/* Barre de navigation d'onglets */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface-muted/70 p-1.5 shadow-xs backdrop-blur-sm">
            {AUDIENCES.map((aud) => {
              const active = aud.id === activeTab;
              const Icon = aud.icon;
              return (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => setActiveTab(aud.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer",
                    active
                      ? "bg-primary-900 text-white shadow-sm"
                      : "text-text-muted hover:text-text hover:bg-surface"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{aud.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grand Panneau Interactif avec 3 Cartes / Avantages + Vrai écran d'application */}
        <div className="rounded-3xl border border-border/80 bg-canvas/60 p-5 sm:p-8 lg:p-10 shadow-xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Colonne Gauche : Titre + 3 Points Clés */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-800">
                  {current.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-primary-950">
                  {current.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {current.description}
                </p>
              </div>

              {/* 3 Avantages avec icônes distinctes */}
              <div className="space-y-3 pt-1">
                {current.benefits.map((b, idx) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 rounded-2xl border border-border/70 bg-surface p-4 shadow-xs transition-transform hover:scale-[1.01]"
                    >
                      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                        <Icon className={cn("size-5", b.iconTone)} />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-text">{b.title}</h4>
                        <p className="text-xs text-text-muted leading-relaxed">{b.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action CTA + Stat clé */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/60">
                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-800 transition-all cursor-pointer"
                >
                  <span>Créer mon atelier gratuit</span>
                  <ArrowRight className="size-4" />
                </Link>

                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span className="text-lg font-extrabold text-primary-900">
                    {current.stats.number}
                  </span>
                  <span className="max-w-[200px] leading-tight">
                    {current.stats.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Vraie capture d'écran de l'application correspondante */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-border bg-surface shadow-2xl">
                {/* Barre de fenêtre d'application */}
                <div className="flex items-center justify-between border-b border-border bg-surface-muted px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-red-400 inline-block" />
                    <span className="size-2.5 rounded-full bg-amber-400 inline-block" />
                    <span className="size-2.5 rounded-full bg-emerald-400 inline-block" />
                  </div>
                  <span className="text-[10px] font-semibold text-text-muted">
                    Fildor Web & Mobile
                  </span>
                </div>

                <div className="relative w-full aspect-[4/3] bg-canvas overflow-hidden">
                  <Image
                    src={current.screenshot}
                    alt={current.screenshotAlt}
                    fill
                    className="object-cover object-top transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
