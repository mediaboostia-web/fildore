import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FildorLogo } from "@/components/brand/fildor-logo";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden w-full grid grid-cols-1 lg:grid-cols-12 bg-surface">
      {/* Colonne Gauche : Formulaire & Actions d'authentification sans scroll inutile */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-surface lg:h-screen lg:overflow-y-auto">
        {/* En-tête : Logo Fildor */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 transition-transform hover:scale-102"
            title="Retour à l'accueil Fildor"
          >
            <FildorLogo variant="lockup" height={30} />
          </Link>
        </div>

        {/* Contenu dynamique auth centré */}
        <div className="py-4 sm:py-6 max-w-sm w-full mx-auto">
          {children}
        </div>

        {/* Pied de page discret */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-text-subtle pt-3 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-text-muted font-medium">
            <ShieldCheck className="size-3.5 text-primary-800" />
            <span>Données d&apos;atelier 100% sécurisées</span>
          </div>
          <p>© {new Date().getFullYear()} Fildor</p>
        </div>
      </div>

      {/* Colonne Droite : Immersion Atelier & Témoignage */}
      <div className="hidden lg:block lg:col-span-6 xl:col-span-7 relative bg-primary-950 lg:h-screen overflow-hidden">
        <Image
          src="/images/tailor-workshop.jpg"
          alt="Atelier de couture Fildor"
          fill
          priority
          className="object-cover object-center brightness-95 contrast-105"
          sizes="(min-width: 1024px) 60vw, 0vw"
        />

        {/* Dégradés d'ambiance */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
        <div className="absolute inset-0 bg-primary-950/20 mix-blend-multiply" />

        {/* Badge supérieur */}
        <div className="absolute top-6 right-6 z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-primary-950 px-3.5 py-1 text-xs font-semibold text-white">
            <CheckCircle2 className="size-3.5 text-emerald-400" />
            <span>Pour couturiers & modélistes</span>
          </div>
        </div>

        {/* Témoignage — surface opaque, pas de verre dépoli (PROJECT_RULES.md §5) */}
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <div className="rounded-[var(--radius-lg)] border border-white/20 bg-primary-950 p-5 sm:p-6 text-white shadow-lg space-y-3">
            <p className="text-sm sm:text-base font-normal leading-relaxed text-white/95">
              « Fildor a totalement transformé l&apos;organisation de notre atelier. Nous n&apos;avons plus jamais perdu une seule mesure de client, et nos livraisons de robes et boubous se font toujours à temps. »
            </p>

            <div className="flex items-center justify-between border-t border-white/15 pt-3">
              <div>
                <h4 className="text-xs font-bold text-white">Amina Chabi</h4>
                <p className="text-[11px] text-white/75">
                  Directrice de Maison de Couture · Cotonou
                </p>
              </div>

              {/* 5 étoiles */}
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
