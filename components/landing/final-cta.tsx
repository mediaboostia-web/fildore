import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Users, ShieldCheck, TrendingUp, Star } from "lucide-react";

export function LandingFinalCTA() {
  const stats = [
    {
      value: "+500",
      label: "Ateliers Actifs",
      detail: "Bénin, Côte d'Ivoire, Sénégal, Togo",
      icon: Users,
    },
    {
      value: "100%",
      label: "Mesures Protégées",
      detail: "Retrouvées en 2 secondes",
      icon: ShieldCheck,
    },
    {
      value: "0 Retard",
      label: "Délais Maîtrisés",
      detail: "Alertes automatiques d'essayage",
      icon: TrendingUp,
    },
    {
      value: "4.9 / 5",
      label: "Satisfaction",
      detail: "Par les maîtres tailleurs",
      icon: Star,
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-surface border-t border-border">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Bandeau Chiffres Clés & Impact d'Ateliers intégré */}
        <div className="rounded-2xl border border-border bg-canvas/40 p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex items-center gap-3.5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-900 shadow-2xs">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-primary-950 leading-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs font-bold text-text mt-0.5">{stat.label}</p>
                    <p className="text-[11px] text-text-muted hidden sm:block">{stat.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grand Cadre Communauté WhatsApp */}
        <div className="relative rounded-3xl border border-border bg-surface p-6 sm:p-10 lg:p-12 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Colonne Gauche : Titre + Bullets + CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E7F7EE] px-3.5 py-1 text-xs font-bold text-[#128C7E] border border-[#25D366]/30">
                <MessageCircle className="size-4 text-[#25D366]" />
                <span>Espace d&apos;échange & entraide couturiers</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-primary-950 leading-tight">
                  Rejoignez la Communauté <br />
                  <span className="text-[#128C7E]">WhatsApp Fildor</span>
                </h2>
                <p className="text-sm text-text-muted leading-relaxed">
                  Échangez directement avec l&apos;équipe Fildor et des centaines d&apos;ateliers pour partager vos modèles, astuces et retours d&apos;expérience.
                </p>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm font-semibold text-text">
                <li className="flex items-center gap-2.5">
                  <span className="text-primary-800 text-xs font-black">✔</span>
                  <span>Posez vos questions et obtenez des réponses directes de l&apos;équipe</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-primary-800 text-xs font-black">✔</span>
                  <span>Découvrez de nouvelles coupes et modèles inspirants</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-primary-800 text-xs font-black">✔</span>
                  <span>Support prioritaire et assistance gratuite</span>
                </li>
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="https://wa.me/22997000000?text=Bonjour,%20je%20souhaite%20rejoindre%20la%20communaute%20Fildor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:brightness-95 active:scale-98 transition-all cursor-pointer"
                >
                  <MessageCircle className="size-4.5" />
                  <span>Rejoindre sur WhatsApp</span>
                </Link>

                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-primary-800 active:scale-98 transition-all cursor-pointer"
                >
                  <span>Créer mon atelier gratuit</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            {/* Colonne Droite : Photo Authentique Styliste */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[320px] sm:h-[360px] w-full rounded-2xl overflow-hidden border border-border bg-primary-950 shadow-md">
                <Image
                  src="/images/tailor-designer.jpg"
                  alt="Styliste et créateur de mode Fildor"
                  fill
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
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
