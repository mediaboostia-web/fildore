import Link from "next/link";
import {
  ClipboardList,
  Users,
  FileText,
  MessageSquare,
  Shirt,
  Layers,
  Check,
  ArrowRight,
} from "lucide-react";

export function LandingFeaturesSection() {
  const features = [
    {
      id: "commandes",
      icon: ClipboardList,
      title: "Commandes sous contrôle",
      desc: "Créez, organisez et suivez chaque commande jusqu'à sa livraison. Voyez immédiatement ce qui est urgent, ce qui est en retard et ce qui doit être terminé cette semaine.",
      points: [
        "Dates de livraison visibles d'un coup d'œil",
        "Statuts de confection clairs (Coupe, Couture, Essayage)",
        "Photos d'inspiration et modèles associés",
        "Historique complet de chaque commande",
      ],
      linkText: "Découvrir les commandes",
      href: "/commandes",
    },
    {
      id: "clients",
      icon: Users,
      title: "Une mémoire pour votre atelier",
      desc: "Gardez les informations importantes de vos clients : contacts, préférences, historique et mesures anatomiques réutilisables.",
      points: [
        "Fiches clients complètes et sécurisées",
        "Profils de mesures multiples par type de vêtement",
        "Historique complet des anciennes confections",
        "Accès WhatsApp direct en un clic",
      ],
      linkText: "Découvrir les clients",
      href: "/clients",
    },
    {
      id: "documents",
      icon: FileText,
      title: "Des documents professionnels en clics",
      desc: "Transformez une commande en devis, bon de commande ou facture sans jamais recopier les informations à la main.",
      points: [
        "Devis et bons de commande numérotés",
        "Impression standard A4 et ticket thermique",
        "Logo et coordonnées officielles de votre atelier",
        "Partage immédiat sur WhatsApp ou par lien",
      ],
      linkText: "Découvrir les documents",
      href: "/factures",
    },
    {
      id: "messagerie",
      icon: MessageSquare,
      title: "Communiquez mieux avec vos clients",
      desc: "Préparez des messages simples et chaleureux pour confirmer une commande, annoncer un essayage ou avertir que la tenue est prête.",
      points: [
        "Messages WhatsApp préremplis avec variables réelles",
        "Confirmation de commande instantanée",
        "Annonce 'Votre tenue est prête pour essayage'",
        "Remerciements et suivi de satisfaction",
      ],
      linkText: "Découvrir la messagerie",
      href: "/messages",
    },
    {
      id: "modeles",
      icon: Shirt,
      title: "Valorisez vos modèles & créations",
      desc: "Conservez vos créations, organisez vos inspirations et préparez un catalogue que vous pourrez montrer à vos clients.",
      points: [
        "Bibliothèque de modèles par catégorie",
        "Prix indicatifs et délais moyens de confection",
        "Tags de styles (Wax, Bazin, Cérémonie)",
        "Lancement de commande directe depuis un modèle",
      ],
      linkText: "Découvrir les modèles",
      href: "/modeles",
    },
    {
      id: "organisation",
      icon: Layers,
      title: "Organisation d'équipe & atelier",
      desc: "Structurez le travail entre vos apprentis, couturiers et réceptionnistes pour que tout le monde avance au même rythme.",
      points: [
        "Rôles d'atelier (Owner, Manager, Couturière, Réception)",
        "Permissions adaptées à chaque collaborateur",
        "Visibilité sur la charge de travail globale",
        "Accès multi-postes smartphone et ordinateur",
      ],
      linkText: "Découvrir les paramètres",
      href: "/parametres",
    },
  ];

  return (
    <section id="fonctionnalites" className="py-16 md:py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* En-tête de section */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-600">
            Tout ce dont votre atelier a besoin
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Un outil simple pour suivre le travail qui compte vraiment.
          </h2>
          <p className="text-sm text-text-muted sm:text-base leading-relaxed">
            Fildor rassemble vos opérations essentielles sans vous encombrer avec des écrans compliqués
            ou des fonctions superflues.
          </p>
        </div>

        {/* Grille des 6 fonctionnalités majeures */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-canvas/40 p-6 shadow-xs transition-all hover:border-primary-800 hover:bg-surface hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary-900 text-white shadow-xs">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="text-lg font-bold text-text">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {feat.desc}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-border">
                    {feat.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-text">
                        <Check className="size-3.5 text-success shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 mt-4 border-t border-border/60">
                  <Link
                    href={feat.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-900 hover:text-accent-600 transition-colors"
                  >
                    <span>{feat.linkText}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
