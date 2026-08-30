import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, MessageCircle, Ruler } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-surface via-background to-background">
      {/* Texture de fond subtile */}
      <div className="absolute inset-0 bg-[radial-gradient(#173B36_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          {/* Titre principal - Compris en 3 secondes */}
          <h1 className="text-3xl font-extrabold tracking-tight text-primary-950 sm:text-5xl lg:text-6xl sm:leading-[1.12]">
            Tout votre atelier de couture,{" "}
            <span className="text-primary-800">au même endroit.</span>
          </h1>

          {/* Sous-titre ultra clair */}
          <p className="text-base text-text-muted sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Suivez chaque commande, retrouvez les mesures de vos clients en 2 secondes et préparez
            vos messages WhatsApp sans jamais rien perdre.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/inscription"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-primary-800 active:bg-primary-950 transition-all cursor-pointer"
            >
              <span>Créer mon atelier gratuitement</span>
              <ArrowRight className="size-5" />
            </Link>

            <Link
              href="#comment-ca-marche"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 text-base font-semibold text-text hover:bg-surface-muted hover:border-primary-800/40 transition-all cursor-pointer"
            >
              <span>Voir comment ça marche</span>
            </Link>
          </div>

          {/* Microcopy sous CTA */}
          <p className="text-xs font-medium text-text-subtle">
            Simple sur smartphone Android & iPhone · Sans carte bancaire
          </p>
        </div>

        {/* Visuel Réel de l'App Fildor avec badges flottants */}
        <div className="relative mt-12 mx-auto max-w-5xl">
          {/* Badge flottant 1 : Commande prête */}
          <div className="hidden lg:flex absolute -left-6 top-16 z-20 items-center gap-2.5 rounded-xl border border-border bg-surface p-3 shadow-xl animate-in fade-in slide-in-from-left duration-300">
            <div className="flex size-8 items-center justify-center rounded-lg bg-success-bg text-success">
              <CheckCircle2 className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">Robe sirène prête</p>
              <p className="text-[11px] text-text-muted">Aïcha D. · Essayage 16h</p>
            </div>
          </div>

          {/* Badge flottant 2 : WhatsApp prêt */}
          <div className="hidden lg:flex absolute -right-6 top-32 z-20 items-center gap-2.5 rounded-xl border border-border bg-surface p-3 shadow-xl animate-in fade-in slide-in-from-right duration-300">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#E7F7EE] text-[#128C7E]">
              <MessageCircle className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">WhatsApp prêt</p>
              <p className="text-[11px] text-text-muted">Message généré en 1 clic</p>
            </div>
          </div>

          {/* Badge flottant 3 : Mesures retrouvées */}
          <div className="hidden lg:flex absolute -left-4 bottom-12 z-20 items-center gap-2.5 rounded-xl border border-border bg-surface p-3 shadow-xl animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary-900">
              <Ruler className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">Mesures enregistrées</p>
              <p className="text-[11px] text-text-muted">Profil Boubou & Robe</p>
            </div>
          </div>

          {/* Cadre mockup avec la vraie capture de l'application */}
          <div className="relative rounded-2xl border border-border-strong/70 bg-surface shadow-2xl overflow-hidden">
            {/* Barre de fenêtre d'application */}
            <div className="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-400/80 inline-block" />
                <span className="size-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="size-3 rounded-full bg-emerald-400/80 inline-block" />
                <span className="ml-2 text-xs font-semibold text-text-muted hidden sm:inline">
                  Fildor — Tableau de bord atelier
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-success bg-success-bg px-2.5 py-0.5 rounded-full">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" />
                  Atelier en ligne
                </span>
              </div>
            </div>

            {/* Vraie capture du Dashboard */}
            <div className="relative w-full aspect-[16/9] bg-canvas overflow-hidden">
              <Image
                src="/screenshots/dashboard.png"
                alt="Tableau de bord Fildor réel"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
