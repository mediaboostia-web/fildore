import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface text-text">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Marque & Slogan */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary-900 text-white font-black text-sm">
                F
              </span>
              <span className="text-xl font-bold tracking-tight text-primary-950">Fildor</span>
            </Link>

            <p className="text-xs text-text-muted max-w-sm leading-relaxed">
              Le copilote opérationnel des couturiers, stylistes et ateliers de mode en Afrique.
              Gérez vos clients, mesures, commandes, paiements et communications WhatsApp en toute simplicité.
            </p>

            <p className="text-xs font-semibold text-primary-900">
              Fildor — Le fil conducteur de votre atelier.
            </p>
          </div>

          {/* Colonne Produit */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">Produit</h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link href="#fonctionnalites" className="hover:text-primary-900 transition-colors">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/commandes" className="hover:text-primary-900 transition-colors">
                  Commandes
                </Link>
              </li>
              <li>
                <Link href="/clients" className="hover:text-primary-900 transition-colors">
                  Clients & Mesures
                </Link>
              </li>
              <li>
                <Link href="/factures" className="hover:text-primary-900 transition-colors">
                  Factures & Devis
                </Link>
              </li>
              <li>
                <Link href="/modeles" className="hover:text-primary-900 transition-colors">
                  Catalogue Modèles
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne Entreprise */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">Entreprise</h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link href="#comment-ca-marche" className="hover:text-primary-900 transition-colors">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="#tarifs" className="hover:text-primary-900 transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/inscription" className="hover:text-primary-900 transition-colors">
                  Devenir atelier pilote
                </Link>
              </li>
              <li>
                <Link
                  href="https://wa.me/22997000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-900 transition-colors"
                >
                  Contact WhatsApp
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne Aide & Légal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">Aide & Légal</h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link href="#faq" className="hover:text-primary-900 transition-colors">
                  Questions fréquentes (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-primary-900 transition-colors">
                  Espace de connexion
                </Link>
              </li>
              <li>
                <span className="text-text-subtle">Confidentialité</span>
              </li>
              <li>
                <span className="text-text-subtle">Conditions d'utilisation</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <p>© 2026 Fildor. Tous droits réservés.</p>
          <p>Conçu avec passion pour l'artisanat et la mode africaine.</p>
        </div>
      </div>
    </footer>
  );
}
