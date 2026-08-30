import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MessageCircle,
  Ruler,
  Receipt,
  Star,
} from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-[#E8F4EE] via-[#F6FAF8] to-canvas border-b border-border/70">

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          {/* Badge social proof supérieur animé */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-primary-200 bg-surface px-4 py-1.5 shadow-xs animate-in fade-in slide-in-from-top-3 duration-500">
            <div className="flex -space-x-1.5 overflow-hidden">
              <div className="relative size-6 rounded-full ring-2 ring-surface overflow-hidden">
                <Image src="/images/tailor-craft.jpg" alt="Atelier Cotonou" fill className="object-cover" />
              </div>
              <div className="relative size-6 rounded-full ring-2 ring-surface overflow-hidden">
                <Image src="/images/tailor-modeliste.jpg" alt="Modéliste Abidjan" fill className="object-cover" />
              </div>
              <div className="relative size-6 rounded-full ring-2 ring-surface overflow-hidden">
                <Image src="/images/tailor-couturiere.jpg" alt="Couturière Lomé" fill className="object-cover" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-text">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-primary-950 font-bold">Adopté par +500 ateliers de couture</span>
            </div>
          </div>

          {/* Titre avec promesse percutante et empathique (Compris en 3 secondes) */}
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary-950 sm:text-5xl lg:text-6xl sm:leading-[1.14]">
              Fini les mesures perdues.{" "}
              <span className="relative inline-block text-primary-900 whitespace-nowrap">
                <span>Cousez l&apos;esprit tranquille.</span>
                {/* Ligne de soulignement calligraphique dynamique */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-full h-3.5 text-[#C45A32] overflow-visible"
                  viewBox="0 0 300 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 10C70 3 190 2 297 8.5"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
          </div>

          {/* Description courte stricte (< 50 caractères) */}
          <p className="text-base text-text-muted sm:text-lg max-w-md mx-auto leading-relaxed font-semibold animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200 fill-mode-both">
            Mesures, acomptes et WhatsApp en 1 clic.
          </p>

          {/* Boutons d'action clairs et animés */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300 fill-mode-both">
            <Link
              href="/inscription"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-8 py-3.5 text-base font-bold text-white shadow-md hover:bg-primary-800 hover:shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="size-4.5" />
            </Link>

            <Link
              href="https://wa.me/22997000000?text=Bonjour,%20je%20souhaite%20réserver%20une%20démo%20de%20Fildor"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-primary-200/90 bg-surface px-6 py-3.5 text-base font-bold text-text hover:bg-surface-muted hover:border-primary-800/40 transition-all cursor-pointer shadow-2xs"
            >
              <MessageCircle className="size-4.5 text-[#128C7E]" />
              <span>Réserver une démo</span>
            </Link>
          </div>

          {/* Microcopy de réassurance */}
          <p className="text-xs font-medium text-text-subtle pt-1 animate-in fade-in duration-700 delay-400 fill-mode-both">
            Sans carte bancaire · Fonctionne sur Android, iPhone et Ordinateur · Prêt en 2 minutes
          </p>
        </div>

        {/* Aperçu Réel 2D Flat de l'Application Fildor avec Badges d'Atelier */}
        <div className="relative mt-12 md:mt-16 mx-auto max-w-5xl animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both">
          {/* Badge 1 : Mesures conservées */}
          <div className="hidden lg:flex absolute -left-4 top-10 z-20 items-center gap-3 rounded-xl border border-border bg-surface p-3.5 shadow-lg animate-in slide-in-from-left-4 duration-700 delay-500 fill-mode-both">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary-100 text-primary-900">
              <Ruler className="size-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">Mesures sauvegardées</p>
              <p className="text-[11px] text-text-muted">Profil Boubou, Robe & Chemise</p>
            </div>
          </div>

          {/* Badge 2 : Notification WhatsApp directe */}
          <div className="hidden lg:flex absolute -right-4 top-20 z-20 items-center gap-3 rounded-xl border border-border bg-surface p-3.5 shadow-lg animate-in slide-in-from-right-4 duration-700 delay-600 fill-mode-both">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#E7F7EE] text-[#128C7E]">
              <MessageCircle className="size-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">WhatsApp en 1 clic</p>
              <p className="text-[11px] text-text-muted">Message prêt avec photo & solde</p>
            </div>
          </div>

          {/* Badge 3 : Facture professionnelle */}
          <div className="hidden lg:flex absolute -left-2 bottom-12 z-20 items-center gap-3 rounded-xl border border-border bg-surface p-3.5 shadow-lg animate-in slide-in-from-left-4 duration-700 delay-700 fill-mode-both">
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
              <Receipt className="size-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">Reçu & Facture atelier</p>
              <p className="text-[11px] text-text-muted">Acompte sécurisé · Solde tracé</p>
            </div>
          </div>

          {/* Cadre mockup épuré 2D */}
          <div className="relative rounded-2xl border border-primary-200/70 bg-surface shadow-2xl overflow-hidden ring-4 ring-primary-900/5">
            <div className="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-danger/70 inline-block" />
                <span className="size-2.5 rounded-full bg-warning/70 inline-block" />
                <span className="size-2.5 rounded-full bg-success/70 inline-block" />
                <span className="ml-2 text-xs font-semibold text-text-muted hidden sm:inline">
                  Fildor — Tableau de bord atelier
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-success bg-success-bg px-2.5 py-0.5 rounded-full border border-success/20">
                  <span className="size-1.5 rounded-full bg-success" />
                  Atelier connecté
                </span>
              </div>
            </div>

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
