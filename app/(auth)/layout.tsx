import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FildorLogo } from "@/components/brand/fildor-logo";
import { Star, ShieldCheck, Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-background">
      {/* Colonne Gauche : Formulaire & Actions d'authentification */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-surface min-h-screen">
        {/* En-tête : Logo Fildor cliquable */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 group transition-transform hover:scale-105"
            title="Retour à l'accueil Fildor"
          >
            <FildorLogo variant="lockup" height={32} />
          </Link>
        </div>

        {/* Contenu dynamique de la page auth (Connexion / Inscription / Mot de passe oublié) */}
        <div className="py-8 sm:py-12 max-w-md w-full mx-auto">
          {children}
        </div>

        {/* Pied de page discret */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-subtle pt-6 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-text-muted">
            <ShieldCheck className="size-4 text-primary-800" />
            <span>Données d&apos;atelier 100% sécurisées</span>
          </div>
          <p>© {new Date().getFullYear()} Fildor · Tous droits réservés</p>
        </div>
      </div>

      {/* Colonne Droite : Visuel Grand Format + Carte Témoignage Glassmorphism */}
      <div className="hidden lg:block lg:col-span-6 xl:col-span-7 relative bg-primary-950 overflow-hidden">
        {/* Image d'immersion atelier de couture */}
        <Image
          src="/African tailor happily standing in front of her sewing machine _ Premium Photo.jpg"
          alt="Couturière souriante dans son atelier de confection"
          fill
          className="object-cover object-top filter brightness-90"
          priority
          sizes="(min-width: 1024px) 60vw, 0vw"
        />

        {/* Dégradés d'ambiance */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <div className="absolute inset-0 bg-primary-950/20 mix-blend-multiply" />

        {/* Badge en haut à droite */}
        <div className="absolute top-8 right-8 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <Sparkles className="size-3.5 text-accent-400" />
            <span>Conçu pour les créateurs & ateliers</span>
          </div>
        </div>

        {/* Carte de Témoignage Glassmorphism (Inspirée de la capture) */}
        <div className="absolute bottom-10 left-10 right-10 z-10">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 text-white backdrop-blur-xl shadow-2xl space-y-4">
            <p className="text-base sm:text-lg font-medium leading-relaxed text-white/95">
              « Fildor a totalement transformé l&apos;organisation de notre atelier. Nous n&apos;avons plus jamais perdu une seule mesure de client, et nos livraisons de robes et boubous se font toujours à temps. »
            </p>

            <div className="flex items-center justify-between border-t border-white/15 pt-4">
              <div>
                <h4 className="text-sm font-bold text-white">Amina Chabi</h4>
                <p className="text-xs text-white/75">
                  Directrice de Maison de Couture & Styliste · Cotonou
                </p>
              </div>

              {/* 5 étoiles */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
