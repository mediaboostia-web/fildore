import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, CheckCircle2 } from "lucide-react";

export function LandingFinalCTA() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-canvas border-t border-border">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Grand Cadre Communauté WhatsApp avec fond dégradé premium captivant */}
        <div className="relative rounded-3xl border border-primary-800/40 bg-gradient-to-br from-[#102B28] via-[#173B36] to-[#1E4D45] p-6 sm:p-10 lg:p-14 shadow-2xl overflow-hidden text-white">
          {/* Halos lumineux subtils d'ambiance */}
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Colonne Gauche : Titre + Bullets + CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-white/15 backdrop-blur-xs">
                <MessageCircle className="size-4 text-[#25D366]" />
                <span>Espace d&apos;échange & entraide couturiers</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                  Rejoignez la Communauté <br />
                  <span className="text-[#25D366]">WhatsApp Fildor</span>
                </h2>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                  Échangez directement avec l&apos;équipe Fildor et des centaines d&apos;ateliers pour partager vos modèles, astuces de confection et retours d&apos;expérience.
                </p>
              </div>

              <ul className="space-y-2.5 pt-1 text-xs sm:text-sm font-semibold text-white/90">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#25D366] shrink-0" />
                  <span>Posez vos questions et obtenez des réponses directes de l&apos;équipe</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#25D366] shrink-0" />
                  <span>Découvrez de nouvelles coupes et modèles inspirants chaque semaine</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#25D366] shrink-0" />
                  <span>Support prioritaire et entraide entre maîtres tailleurs</span>
                </li>
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                <Link
                  href="https://wa.me/22997000000?text=Bonjour,%20je%20souhaite%20rejoindre%20la%20communaute%20Fildor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg hover:brightness-95 active:scale-98 transition-all cursor-pointer"
                >
                  <MessageCircle className="size-4.5" />
                  <span>Rejoindre sur WhatsApp</span>
                </Link>

                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-primary-950 px-6 py-3.5 text-sm font-extrabold shadow-lg hover:bg-white/90 active:scale-98 transition-all cursor-pointer"
                >
                  <span>Essayer gratuitement</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            {/* Colonne Droite : Photo Styliste avec badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[320px] sm:h-[360px] w-full rounded-2xl overflow-hidden border border-white/20 bg-primary-950 shadow-2xl">
                <Image
                  src="/images/tailor-designer.jpg"
                  alt="Styliste et créateur de mode Fildor"
                  fill
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-sm font-bold">Groupe d&apos;entraide & Modélistes</p>
                  <p className="text-xs text-white/80 mt-0.5">+500 membres actifs au quotidien</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
