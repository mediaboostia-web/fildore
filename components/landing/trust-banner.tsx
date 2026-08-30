import { Smartphone, MessageCircle, Ruler, CheckCircle2 } from "lucide-react";

export function LandingTrustBanner() {
  const points = [
    {
      icon: Smartphone,
      title: "Mobile-first",
      desc: "Utilisable directement depuis votre smartphone à l'atelier.",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp-first",
      desc: "Partagez confirmations et avis d'essayage en 1 clic.",
    },
    {
      icon: Ruler,
      title: "Mesures protégées",
      desc: "Tous les profils de mesures de vos clients conservés et réutilisables.",
    },
    {
      icon: CheckCircle2,
      title: "Prise en main en 2 min",
      desc: "Simple et fluide, sans aucune compétence technique requise.",
    },
  ];

  return (
    <section className="border-y border-border bg-surface py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5 p-2">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-900">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text">{pt.title}</h4>
                  <p className="text-xs text-text-muted leading-tight mt-0.5">{pt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
