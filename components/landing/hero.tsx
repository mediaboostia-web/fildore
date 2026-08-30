import Link from "next/link";
import { ArrowRight, Scissors, CheckCircle2, Clock, Plus, MessageCircle, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

        {/* Visuel Produit Réaliste avec mini-cartes flottantes inspirées des écrans de référence */}
        <div className="relative mt-12 mx-auto max-w-4xl">
          {/* Badge flottant 1 : Commande prête */}
          <div className="hidden lg:flex absolute -left-6 top-16 z-20 items-center gap-2.5 rounded-xl border border-border bg-surface p-3 shadow-lg animate-in fade-in slide-in-from-left duration-300">
            <div className="flex size-8 items-center justify-center rounded-lg bg-success-bg text-success">
              <CheckCircle2 className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">Robe sirène prête</p>
              <p className="text-[11px] text-text-muted">Aïcha D. · Essayage 16h</p>
            </div>
          </div>

          {/* Badge flottant 2 : WhatsApp prêt */}
          <div className="hidden lg:flex absolute -right-6 top-32 z-20 items-center gap-2.5 rounded-xl border border-border bg-surface p-3 shadow-lg animate-in fade-in slide-in-from-right duration-300">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#E7F7EE] text-[#128C7E]">
              <MessageCircle className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">WhatsApp prêt</p>
              <p className="text-[11px] text-text-muted">Message généré en 1 clic</p>
            </div>
          </div>

          {/* Badge flottant 3 : Mesures retrouvées */}
          <div className="hidden lg:flex absolute -left-4 bottom-12 z-20 items-center gap-2.5 rounded-xl border border-border bg-surface p-3 shadow-lg animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary-900">
              <Ruler className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">Mesures enregistrées</p>
              <p className="text-[11px] text-text-muted">Profil Boubou & Robe</p>
            </div>
          </div>

          {/* Cadre de l'application */}
          <div className="relative rounded-2xl border border-border-strong/70 bg-surface shadow-xl overflow-hidden">
            {/* Barre de fenêtre d'application */}
            <div className="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-400/80 inline-block" />
                <span className="size-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="size-3 rounded-full bg-emerald-400/80 inline-block" />
                <span className="ml-2 text-xs font-semibold text-text-muted hidden sm:inline">
                  Fildor — Atelier Nadège
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-bg px-2 py-0.5 rounded-full">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" />
                  Atelier en ligne
                </span>
              </div>
            </div>

            {/* Contenu Dashboard Réaliste */}
            <div className="p-4 sm:p-6 bg-canvas/40 space-y-5">
              {/* En-tête atelier */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-text">Bonjour, Atelier Nadège 👋</h3>
                    <Badge tone="success" className="text-[10px]">Atelier Ouvert</Badge>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Aujourd'hui · Cotonou, Bénin
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary-900 px-3 py-2 text-xs font-semibold text-white shadow-xs">
                  <Plus className="size-3.5" />
                  <span>Nouvelle commande</span>
                </div>
              </div>

              {/* 3 Cartes d'activité du jour */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-surface p-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text-muted">À livrer aujourd'hui</span>
                    <Clock className="size-4 text-primary-800" />
                  </div>
                  <p className="text-2xl font-bold text-text mt-1.5">3 tenues</p>
                  <span className="text-[11px] text-success font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="size-3" />
                    En finition & repassage
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-surface p-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text-muted">Mesures enregistrées</span>
                    <Ruler className="size-4 text-primary-900" />
                  </div>
                  <p className="text-2xl font-bold text-primary-900 mt-1.5">48 profils</p>
                  <span className="text-[11px] text-text-muted mt-0.5 block">
                    Réutilisables en 1 clic
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-surface p-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text-muted">En confection</span>
                    <Scissors className="size-4 text-accent-600" />
                  </div>
                  <p className="text-2xl font-bold text-accent-600 mt-1.5">7 commandes</p>
                  <span className="text-[11px] text-text-muted mt-0.5 block">
                    Coupe & couture
                  </span>
                </div>
              </div>

              {/* Liste des commandes réelles */}
              <div className="rounded-xl border border-border bg-surface p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text uppercase tracking-wider">
                    Commandes prioritaires
                  </span>
                  <span className="text-xs text-text-muted">2 prêtes · 1 en couture</span>
                </div>

                <div className="divide-y divide-border">
                  {/* Commande 1 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-primary-900">FIL-CTN-000124</span>
                        <Badge tone="success" className="text-[10px]">Prête</Badge>
                      </div>
                      <p className="text-sm font-bold text-text">Robe cérémonie — Aïcha D.</p>
                      <p className="text-xs text-text-muted">Livraison : Aujourd'hui (16h00) · Wax Hollandais</p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-xs font-bold text-text block">Échéance : Aujourd'hui</span>
                      <span className="text-[11px] text-success">Client notifié par WhatsApp</span>
                    </div>
                  </div>

                  {/* Commande 2 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-primary-900">FIL-CTN-000125</span>
                        <Badge tone="info" className="text-[10px]">Couture</Badge>
                      </div>
                      <p className="text-sm font-bold text-text">Ensemble homme brodé — Koffi A.</p>
                      <p className="text-xs text-text-muted">Livraison : Demain · Bazin riche 3 pièces</p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-xs font-semibold text-text block">Échéance : Demain</span>
                      <span className="text-[11px] text-text-muted">Mesures vérifiées</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
