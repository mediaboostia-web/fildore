import Link from "next/link";
import { Wallet, CheckCircle, ArrowRight, ShieldCheck, Banknote, Smartphone } from "lucide-react";

export function LandingPaymentsSection() {
  const methods = [
    { name: "MTN Mobile Money", tag: "MoMo Bénin & Afrique" },
    { name: "Moov Money", tag: "Moov Bénin & Ouest" },
    { name: "Wave", tag: "Sénégal & Côte d'Ivoire" },
    { name: "Espèces à l'atelier", tag: "Reçu immédiat" },
    { name: "Virement bancaire", tag: "Commandes B2B" },
  ];

  return (
    <section id="paiements" className="py-16 md:py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Texte & Moyens */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-600">
                Gardez le contrôle sur vos encaissements
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-4xl">
                Chaque acompte et chaque solde ont leur place.
              </h2>
            </div>

            <p className="text-sm text-text-muted sm:text-base leading-relaxed">
              Fildor vous aide à enregistrer les paiements de vos clients, à suivre le montant restant
              et à garder une preuve claire et incontestable de chaque encaissement.
            </p>

            <ul className="space-y-2.5">
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-text">
                <CheckCircle className="size-4 text-success shrink-0" />
                <span>Enregistrez les espèces, Mobile Money ou virements bancaires</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-text">
                <CheckCircle className="size-4 text-success shrink-0" />
                <span>Suivez les paiements partiels et les acomptes en montants entiers XOF (FCFA)</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-text">
                <CheckCircle className="size-4 text-success shrink-0" />
                <span>Générez un reçu imprimable ou partageable après encaissement</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-text">
                <CheckCircle className="size-4 text-success shrink-0" />
                <span>Identifiez les soldes à relancer avant la remise de la tenue</span>
              </li>
            </ul>

            {/* Note de transparence */}
            <div className="rounded-xl border border-border bg-canvas/60 p-4 space-y-1">
              <p className="text-xs font-semibold text-text">🛡️ Transparence et flexibilité</p>
              <p className="text-xs text-text-muted leading-relaxed">
                Vous gardez le contrôle total : les paiements sont saisis manuellement et réconciliés
                instantanément dans votre caisse d'atelier.
              </p>
            </div>

            <div>
              <Link
                href="/paiements"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-800 transition-all cursor-pointer"
              >
                <span>Suivre mes paiements</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Grille visuelle des modes de paiement acceptés */}
          <div className="rounded-2xl border border-border bg-canvas/40 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <Wallet className="size-5 text-primary-900" />
                <h3 className="font-bold text-base text-text">Modes de règlement suivis</h3>
              </div>
              <span className="text-xs font-bold text-primary-900 bg-primary-50 px-2 py-0.5 rounded">
                FCFA / XOF
              </span>
            </div>

            <div className="space-y-2.5">
              {methods.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface p-3.5 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary-900 font-bold text-xs">
                      {idx % 2 === 0 ? <Smartphone className="size-4" /> : <Banknote className="size-4" />}
                    </div>
                    <span className="text-sm font-bold text-text">{m.name}</span>
                  </div>
                  <span className="text-xs text-text-muted">{m.tag}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-text-subtle text-center pt-2">
              Chaque versement génère automatiquement un numéro de reçu unique (ex: REC-2026-000042)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
