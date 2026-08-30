import {
  ClipboardX,
  Ruler,
  MessageSquareWarning,
  Receipt,
  Users,
  ImageOff,
} from "lucide-react";

export function LandingProblemsSection() {
  const problems = [
    {
      icon: ClipboardX,
      title: "Des commandes oubliées ou mal suivies",
      text: "Retrouvez chaque commande, sa date de livraison promise, son statut de fabrication et ce qui reste à faire.",
      badge: "Zéro retard",
    },
    {
      icon: Ruler,
      title: "Des mesures introuvables dans les cahiers",
      text: "Conservez les mesures de chaque client et réutilisez-les instantanément lors de sa prochaine commande.",
      badge: "Mémoire atelier",
    },
    {
      icon: MessageSquareWarning,
      title: "Des clients qui demandent sans cesse où en est leur tenue",
      text: "Préparez des messages WhatsApp professionnels pour rassurer, inviter à l'essayage et informer vos clients.",
      badge: "WhatsApp en 1 clic",
    },
    {
      icon: Receipt,
      title: "Des devis et factures rédigés à la main",
      text: "Générez un devis ou une facture soignée directement à partir des informations de la commande.",
      badge: "Documents pro",
    },
    {
      icon: ImageOff,
      title: "Des photos de modèles perdues dans la galerie",
      text: "Classez vos photos de créations par catégorie et associez-les directement aux commandes des clients.",
      badge: "Catalogue soigné",
    },
    {
      icon: Users,
      title: "Une équipe d'atelier difficile à coordonner",
      text: "Suivez les commandes en cours, les étapes de coupe, de couture et d'essayage dans un même espace partagé.",
      badge: "Équipe alignée",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* En-tête de section */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-600">
            Le quotidien d&apos;un atelier ne devrait pas être compliqué
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Trop de commandes se perdent entre le cahier, le téléphone et WhatsApp.
          </h2>
          <p className="text-sm text-text-muted sm:text-base leading-relaxed">
            Quand les mesures sont dans un cahier, les inspirations dans la galerie du téléphone et les
            échanges dans les messages, il devient difficile de tout suivre. Fildor rassemble l&apos;essentiel au même endroit.
          </p>
        </div>

        {/* 6 Cartes Problèmes */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-xl border border-border bg-canvas/40 p-6 transition-all hover:border-primary-800 hover:bg-surface hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-surface border border-border text-primary-900 shadow-xs group-hover:bg-primary-900 group-hover:text-white transition-colors">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-primary-800 bg-primary-50 px-2 py-0.5 rounded">
                    {prob.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-text mb-2 group-hover:text-primary-900 transition-colors">
                  {prob.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {prob.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
