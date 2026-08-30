import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Ruler,
  Scissors,
  Receipt,
  Sparkles,
  Star,
} from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28 bg-canvas">
      {/* 1. Dégradés d'arrière-plan lumineux & Anneaux orbitaux concentriques (inspirés de la capture) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Halo radial vert atelier & doré */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-tr from-primary-800/15 via-primary-500/10 to-amber-500/10 blur-3xl" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-radial from-primary-100/40 via-transparent to-transparent blur-2xl" />

        {/* Cercles orbitaux concentriques stylisés */}
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] opacity-25"
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="500" cy="500" r="220" stroke="#173B36" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="500" cy="500" r="340" stroke="#173B36" strokeWidth="1" />
          <circle cx="500" cy="500" r="460" stroke="#173B36" strokeWidth="1" strokeDasharray="6 8" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          {/* Badge social proof supérieur avec avis */}
          <div className="inline-flex items-center gap-3 rounded-full border border-border/80 bg-surface/90 px-4 py-1.5 shadow-xs backdrop-blur-md animate-in fade-in zoom-in-95 duration-500">
            <div className="flex -space-x-1.5 overflow-hidden">
              <div className="relative size-6 rounded-full ring-2 ring-surface overflow-hidden">
                <Image src="/images/tailor-hero.jpg" alt="Atelier Cotonou" fill className="object-cover" />
              </div>
              <div className="relative size-6 rounded-full ring-2 ring-surface overflow-hidden">
                <Image src="/images/tailor-modeliste.jpg" alt="Modéliste Abidjan" fill className="object-cover" />
              </div>
              <div className="relative size-6 rounded-full ring-2 ring-surface overflow-hidden">
                <Image src="/images/tailor-couturiere.jpg" alt="Couturière Lomé" fill className="object-cover" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>Adopté par +500 ateliers de couture</span>
            </div>
          </div>

          {/* Titre principal percutant (Clarté & Bénéfice direct en 3s) */}
          <h1 className="text-3xl font-extrabold tracking-tight text-primary-950 sm:text-5xl lg:text-6xl sm:leading-[1.14]">
            Ne perdez plus jamais les mesures d&apos;un client.{" "}
            <span className="bg-gradient-to-r from-primary-900 via-primary-800 to-amber-700 bg-clip-text text-transparent">
              Tout votre atelier réuni.
            </span>
          </h1>

          {/* Sous-titre rédigé sans jargon */}
          <p className="text-base text-text-muted sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
            Remplacez vos cahiers papier par une application simple sur smartphone.
            Suivez l&apos;avancement de vos confections, sécurisez vos acomptes et prévenez vos clients sur WhatsApp en 1 clic.
          </p>

          {/* Boutons d'action clairs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/inscription"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary-900 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-900/20 hover:bg-primary-800 active:scale-98 transition-all cursor-pointer"
            >
              <span>Créer mon atelier gratuitement</span>
              <ArrowRight className="size-4.5" />
            </Link>

            <Link
              href="#fonctionnalites"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-base font-semibold text-text hover:bg-surface-muted hover:border-primary-800/40 transition-all cursor-pointer"
            >
              <span>Découvrir les fonctionnalités</span>
            </Link>
          </div>

          {/* Microcopy de réassurance */}
          <p className="text-xs font-medium text-text-subtle pt-1">
            Sans carte bancaire · Fonctionne sur Android, iPhone et Ordinateur · Prêt en 2 minutes
          </p>
        </div>

        {/* Visuel Application Fildor avec Badges Flottants Orbitaux */}
        <div className="relative mt-12 md:mt-16 mx-auto max-w-5xl">
          {/* Badge 1 : Mesures conservées */}
          <div className="hidden lg:flex absolute -left-6 top-12 z-20 items-center gap-3 rounded-2xl border border-border/80 bg-surface/95 p-3.5 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-left duration-700">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary-100 text-primary-900">
              <Ruler className="size-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">Mesures sauvegardées</p>
              <p className="text-[11px] text-text-muted">Profil Boubou, Robe & Chemise</p>
            </div>
          </div>

          {/* Badge 2 : Notification WhatsApp directe */}
          <div className="hidden lg:flex absolute -right-6 top-24 z-20 items-center gap-3 rounded-2xl border border-border/80 bg-surface/95 p-3.5 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-right duration-700">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#E7F7EE] text-[#128C7E]">
              <MessageCircle className="size-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">WhatsApp en 1 clic</p>
              <p className="text-[11px] text-text-muted">Message prêt avec photo & solde</p>
            </div>
          </div>

          {/* Badge 3 : Facture professionnelle */}
          <div className="hidden lg:flex absolute -left-4 bottom-14 z-20 items-center gap-3 rounded-2xl border border-border/80 bg-surface/95 p-3.5 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom duration-700">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
              <Receipt className="size-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">Reçu & Facture atelier</p>
              <p className="text-[11px] text-text-muted">Acompte sécurisé · Solde tracé</p>
            </div>
          </div>

          {/* Mockup d'application */}
          <div className="relative rounded-2xl sm:rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden ring-1 ring-black/5">
            {/* Barre de navigation interne d'aperçu */}
            <div className="flex items-center justify-between border-b border-border bg-surface-muted/90 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-danger/70 inline-block" />
                <span className="size-3 rounded-full bg-warning/70 inline-block" />
                <span className="size-3 rounded-full bg-success/70 inline-block" />
                <span className="ml-2 text-xs font-semibold text-text-muted hidden sm:inline">
                  Fildor — Tableau de bord de l&apos;atelier
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-success bg-success-bg px-2.5 py-0.5 rounded-full border border-success/20">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" />
                  Atelier connecté
                </span>
              </div>
            </div>

            {/* Capture d'écran réelle du Dashboard */}
            <div className="relative w-full aspect-[16/9] bg-surface-muted overflow-hidden">
              <Image
                src="/screenshots/dashboard.png"
                alt="Tableau de bord Fildor pour atelier de couture"
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
