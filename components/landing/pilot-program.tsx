import Link from "next/link";
import Image from "next/image";
import { Users2, ShieldCheck, HeartHandshake, ArrowRight, Scissors } from "lucide-react";

export function LandingPilotProgram() {
  return (
    <section className="py-16 md:py-24 bg-surface-muted/60 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Colonne Texte */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 text-accent-700 px-3.5 py-1 text-xs font-bold border border-accent-100">
              <Scissors className="size-3.5 text-accent-600" />
              <span>Construit avec les ateliers</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-4xl">
              Fildor se construit avec celles et ceux qui font vivre la mode au quotidien.
            </h2>

            <p className="text-sm text-text-muted sm:text-base leading-relaxed">
              Nous travaillons étroitement avec des couturiers, stylistes et chefs d&apos;ateliers pour concevoir
              une application qui correspond réellement à vos habitudes de travail, à vos contraintes de terrain
              et à votre relation client sur WhatsApp.
            </p>

            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <div className="rounded-xl border border-border bg-surface p-3.5 shadow-xs space-y-1.5">
                <Users2 className="size-5 text-primary-900" />
                <h4 className="text-xs font-bold text-text">Écoute active</h4>
                <p className="text-[11px] text-text-muted">
                  Vos retours orientent chaque nouveauté.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3.5 shadow-xs space-y-1.5">
                <ShieldCheck className="size-5 text-primary-900" />
                <h4 className="text-xs font-bold text-text">Données protégées</h4>
                <p className="text-[11px] text-text-muted">
                  Vos mesures restent confidentielles.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3.5 shadow-xs space-y-1.5">
                <HeartHandshake className="size-5 text-primary-900" />
                <h4 className="text-xs font-bold text-text">Accompagnement</h4>
                <p className="text-[11px] text-text-muted">
                  Support réactif et chaleureux.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/inscription"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-800 transition-all cursor-pointer"
              >
                <span>Devenir atelier pilote</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Colonne Image Atelier Pilote */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-border bg-primary-950 shadow-xl min-h-[320px] lg:min-h-[380px]">
            <Image
              src="/Construction of $11_07-mn garment factory begins in northern Ghana.jpg"
              alt="Atelier de production textile et confection"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-accent-100">
                Communauté d&apos;ateliers partenaires
              </p>
              <p className="text-xs text-white/90">
                Cotonou, Lomé, Abidjan, Dakar, Bamako, Yaoundé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
