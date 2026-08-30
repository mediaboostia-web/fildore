import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";

export function LandingFinalCTA() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-surface">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Grand Cadre Communauté WhatsApp inspiré de la maquette de référence */}
        <div className="relative rounded-3xl border border-border/80 bg-gradient-to-br from-[#FFF9F5] via-surface to-[#F1F8F5] p-6 sm:p-10 lg:p-14 shadow-2xl overflow-hidden">
          {/* Cercles décoratifs d'arrière-plan */}
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-primary-100/40 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-accent-100/30 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Colonne Gauche : Titre + Bullets + CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E7F7EE] px-3.5 py-1 text-xs font-bold text-[#128C7E] border border-[#25D366]/30">
                <MessageCircle className="size-4 text-[#25D366]" />
                <span>Espace d&apos;échange & entraide</span>
              </div>

              <div className="space-y-2">
                <span className="text-base sm:text-lg font-semibold text-text-muted">
                  Rejoignez la
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary-950 leading-[1.15]">
                  Communauté <br />
                  <span className="text-[#128C7E]">WhatsApp Fildor</span>
                </h2>
              </div>

              {/* Liste d'avantages avec flèches stylisées de la maquette */}
              <ul className="space-y-2.5 pt-1 text-sm sm:text-base font-semibold text-primary-950">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#C45A32] text-xs font-black">▲</span>
                  <span>Posez vos questions et obtenez des réponses directes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#C45A32] text-xs font-black">▲</span>
                  <span>Partagez vos idées et vos retours d&apos;atelier</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#C45A32] text-xs font-black">▲</span>
                  <span>Envoyez vos captures d&apos;écran pour un support immédiat</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#C45A32] text-xs font-black">▲</span>
                  <span>Recevez de l&apos;aide, des modèles et des conseils rapidement</span>
                </li>
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                <Link
                  href="https://wa.me/22997000000?text=Bonjour,%20je%20souhaite%20rejoindre%20la%20communaute%20Fildor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-base font-bold text-white shadow-lg hover:brightness-95 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <MessageCircle className="size-5" />
                  <span>Rejoindre sur WhatsApp</span>
                </Link>

                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-6 py-3.5 text-base font-bold text-white shadow-md hover:bg-primary-800 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Créer mon atelier gratuit</span>
                  <ArrowRight className="size-4.5" />
                </Link>
              </div>
            </div>

            {/* Colonne Droite : Photo Utilisateur & Artisan */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[340px] sm:h-[400px] w-full rounded-2xl overflow-hidden border border-border bg-primary-950 shadow-2xl">
                <Image
                  src="/images/tailor-designer.jpg"
                  alt="Équipe d'atelier et communauté Fildor"
                  fill
                  className="object-cover object-top transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badge flottant actif */}
                <div className="absolute top-4 right-4 rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-3 py-1 text-white text-xs font-semibold flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span>Groupe Actif</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bandeau inférieur sombre exclusif de la maquette avec Logo Fildor */}
          <div className="mt-8 rounded-2xl bg-primary-950 px-5 py-3.5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm font-medium text-white/90 text-center sm:text-left">
              Échangez directement avec <strong className="text-white">l&apos;équipe Fildor</strong> et les <strong className="text-white">autres ateliers de couture</strong>.
            </p>

            <div className="flex items-center gap-2 shrink-0">
              <Image
                src="/Logo fildor.png"
                alt="Fildor"
                width={24}
                height={24}
                className="size-6 rounded-lg object-contain"
              />
              <span className="text-xs font-bold tracking-wider uppercase text-accent-100">
                Fildor Communauté
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
