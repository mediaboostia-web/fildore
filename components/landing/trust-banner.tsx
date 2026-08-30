import { ShieldCheck, Star, TrendingUp, Users } from "lucide-react";

export function LandingTrustBanner() {
  const stats = [
    {
      value: "+500",
      label: "Ateliers & Couturiers",
      detail: "Bénin, Côte d'Ivoire, Sénégal, Togo",
      icon: Users,
    },
    {
      value: "100%",
      label: "Mesures Sécurisées",
      detail: "Historique client consultable à vie",
      icon: ShieldCheck,
    },
    {
      value: "0 Oubli",
      label: "Délais Maîtrisés",
      detail: "Suivi visuel des dates de livraison",
      icon: TrendingUp,
    },
    {
      value: "4.9 / 5",
      label: "Note de Satisfaction",
      detail: "Recommandé par les modélistes",
      icon: Star,
    },
  ];

  return (
    <section className="border-y border-border/80 bg-surface py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5 p-1 sm:p-2">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-100/80 text-primary-900 shadow-2xs">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-extrabold text-primary-950 leading-tight">
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
    </section>
  );
}
