import Link from "next/link";
import { ArrowRight, MessageSquare, Scissors } from "lucide-react";

export function LandingFinalCTA() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-primary-950 text-white">
      {/* Texture géométrique subtile */}
      <div className="absolute inset-0 bg-[radial-gradient(#C45A32_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-900 px-4 py-1.5 text-xs font-bold text-accent-100 border border-primary-800">
          <Scissors className="size-3.5 text-accent-500" />
          <span>Passez à la vitesse supérieure</span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl max-w-3xl mx-auto leading-tight">
          Votre atelier mérite une organisation à la hauteur de votre savoir-faire.
        </h2>

        <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
          Créez votre espace Fildor en 2 minutes, ajoutez votre première commande et suivez
          votre activité avec une clarté totale et l'esprit tranquille.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/inscription"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-accent-600 px-7 py-4 text-base font-bold text-white shadow-lg hover:bg-accent-700 active:bg-accent-800 transition-all cursor-pointer"
          >
            <span>Créer mon atelier gratuitement</span>
            <ArrowRight className="size-5" />
          </Link>

          <Link
            href="https://wa.me/22997000000?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20Fildor"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-base font-semibold text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <MessageSquare className="size-5" />
            <span>Parler à l'équipe Fildor</span>
          </Link>
        </div>

        <p className="text-xs text-white/60 pt-2">
          Simple à utiliser · Prêt pour smartphone · Pensé pour les ateliers de couture
        </p>
      </div>
    </section>
  );
}
