import { DollarSign, Clock, HeartCrack, AlertTriangle } from "lucide-react";

export function LandingPainPointsSection() {
  const pains = [
    {
      badge: "Perte d'argent",
      badgeColor: "bg-red-50 text-danger border-danger/30",
      icon: DollarSign,
      iconBg: "bg-danger/10 text-danger",
      title: "Acomptes oubliés & Soldes contestés",
      quote: "« Maître, je t'avais déjà tout payé non ? »",
      desc: "Sans reçu écrit, les acomptes en espèces ou MoMo s'oublient. Vous travaillez dur sans être payé à votre juste valeur.",
    },
    {
      badge: "Perte de temps",
      badgeColor: "bg-amber-50 text-warning border-warning/30",
      icon: Clock,
      iconBg: "bg-warning/10 text-warning",
      title: "Cahiers de mesures perdus ou déchirés",
      quote: "« Attendez, je cherche votre page dans le cahier... »",
      desc: "30 minutes perdues à fouiller des piles de vieux carnets au lieu de couper le tissu et faire tourner les machines.",
    },
    {
      badge: "Perte de confiance",
      badgeColor: "bg-orange-50 text-accent-700 border-accent-600/30",
      icon: HeartCrack,
      iconBg: "bg-accent-50 text-accent-600",
      title: "Retards de livraison & Clients énervés",
      quote: "« C'était pour mon mariage aujourd'hui ! »",
      desc: "Le planning s'embrouille dans la tête, la tenue n'est pas prête à temps et vous perdez un client fidèle pour toujours.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-surface border-b border-border/80 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* En-tête de section percutant (Compris en 5 secondes) */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-danger-bg px-3.5 py-1 text-xs font-bold text-danger border border-danger/20">
            <AlertTriangle className="size-3.5" />
            <span>Ce qui coûte cher à votre atelier chaque mois</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-primary-950">
            Gérer son atelier sur papier, <br className="hidden sm:inline" />
            <span className="text-danger">c&apos;est perdre de l&apos;argent, du temps et des clients.</span>
          </h2>

          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
            Ces situations vous sont familières ? Vous n&apos;êtes pas seul, mais il existe désormais une solution simple.
          </p>
        </div>

        {/* Grille des 3 douleurs réelles */}
        <div className="grid gap-6 md:grid-cols-3">
          {pains.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-border bg-canvas/30 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-danger/40 hover:bg-surface hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`flex size-11 items-center justify-center rounded-xl ${item.iconBg}`}>
                      <Icon className="size-5" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text group-hover:text-danger transition-colors">
                    {item.title}
                  </h3>

                  <div className="rounded-xl border border-border/80 bg-surface p-3 text-xs italic text-text-muted font-medium">
                    {item.quote}
                  </div>

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
