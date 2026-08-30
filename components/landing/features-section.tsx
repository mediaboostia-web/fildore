import Image from "next/image";
import {
  ClipboardList,
  Users,
  Receipt,
  MessageCircle,
  Shirt,
  CalendarClock,
  ChevronRight,
} from "lucide-react";

export function LandingFeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-16 md:py-24 bg-gradient-to-b from-[#F0F6F3] via-[#F8FAF9] to-surface border-y border-border/80 relative overflow-hidden">
      {/* Halo subtil */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* En-tête de section axé clarté & bénéfices */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="inline-block rounded-full bg-primary-100 px-3.5 py-1 text-xs font-bold text-primary-900 uppercase tracking-wider">
            Fonctionnalités Clés
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-primary-950 sm:text-4xl">
            Conçu pour le quotidien des couturiers et modélistes
          </h2>
          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
            Chaque écran répond à un besoin réel de l&apos;atelier : plus de mesures perdues, plus de retards de livraison et des acomptes clairement enregistrés.
          </p>
        </div>

        {/* Grille de cartes inspirée de la capture (style carte blanche épurée, bordures d'accent et mini-listes de statut) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Carte 1 : Commandes & Délais */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-canvas/30 p-6 shadow-xs transition-all hover:shadow-md hover:border-primary-800/40 hover:bg-surface group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary-100 text-primary-900">
                  <ClipboardList className="size-5" />
                </div>
                <span className="text-[11px] font-bold text-primary-900 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200">
                  Suivi direct
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text">Gestion des Commandes</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Fini les doutes sur l&apos;état d&apos;avancement. Suivez chaque vêtement de la coupe à l&apos;essayage.
                </p>
              </div>

              {/* Micro-composant de prévisualisation inspiré de la capture */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-2.5 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-6 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-xs font-bold text-text">Robe de Soirée Wax</p>
                      <p className="text-[10px] text-text-muted">Prévue pour Samedi 16h</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Prête
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-2.5 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-6 rounded-full bg-amber-500" />
                    <div>
                      <p className="text-xs font-bold text-text">Boubou Bazin Riche</p>
                      <p className="text-[10px] text-text-muted">Étape : Couture & Broderie</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    En cours
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-border/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted">Alertes retards automatiques</span>
              <ChevronRight className="size-4 text-primary-800 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Carte 2 : Fiches Clients & Mesures Intelligentes */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-canvas/30 p-6 shadow-xs transition-all hover:shadow-md hover:border-primary-800/40 hover:bg-surface group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-purple-100 text-purple-900">
                  <Users className="size-5" />
                </div>
                <span className="text-[11px] font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                  Inaltérable
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text">Mesures & Fiches Clients</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Conservez les mensurations complètes de chaque client (poitrine, taille, hanches, carrure) réutilisables à vie.
                </p>
              </div>

              {/* Micro-composant de prévisualisation */}
              <div className="rounded-xl border border-border bg-surface p-3 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative size-7 rounded-full overflow-hidden">
                      <Image src="/images/tailor-testimonial-1.jpg" alt="Client" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text">Aminata Touré</p>
                      <p className="text-[10px] text-text-muted">+229 97 45 12 00</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    3 commandes
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1 text-center text-[10px]">
                  <div className="bg-surface-muted rounded p-1">
                    <span className="text-text-subtle block">Poitrine</span>
                    <strong className="text-text">96 cm</strong>
                  </div>
                  <div className="bg-surface-muted rounded p-1">
                    <span className="text-text-subtle block">Taille</span>
                    <strong className="text-text">74 cm</strong>
                  </div>
                  <div className="bg-surface-muted rounded p-1">
                    <span className="text-text-subtle block">Hanches</span>
                    <strong className="text-text">104 cm</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-border/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted">Mesures figées par commande</span>
              <ChevronRight className="size-4 text-primary-800 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Carte 3 : WhatsApp en 1 Clic */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-canvas/30 p-6 shadow-xs transition-all hover:shadow-md hover:border-primary-800/40 hover:bg-surface group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#E7F7EE] text-[#128C7E]">
                  <MessageCircle className="size-5" />
                </div>
                <span className="text-[11px] font-bold text-[#128C7E] bg-[#E7F7EE] px-2.5 py-1 rounded-md border border-[#128C7E]/20">
                  Instantané
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text">Messages WhatsApp 1-Clic</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Envoyez des confirmations, avis d&apos;essayage et rappels de solde personnalisés directement sur WhatsApp sans rien réécrire.
                </p>
              </div>

              {/* Micro-composant WhatsApp */}
              <div className="rounded-xl border border-[#25D366]/30 bg-[#E7F7EE]/80 p-3 text-xs space-y-1.5 shadow-2xs">
                <p className="font-bold text-[#0B443B] text-[11px]">
                  « Bonjour Aminata, votre tenue est prête pour l&apos;essayage à l&apos;atelier... »
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-[#128C7E] font-medium">Bouton direct vers l&apos;app WhatsApp</span>
                  <span className="text-[10px] font-bold bg-[#128C7E] text-white px-2 py-0.5 rounded-full">
                    Envoyer
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-border/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted">11 modèles prêts à l&apos;emploi</span>
              <ChevronRight className="size-4 text-primary-800 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Carte 4 : Factures & Reçus Professionnels */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-canvas/30 p-6 shadow-xs transition-all hover:shadow-md hover:border-primary-800/40 hover:bg-surface group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
                  <Receipt className="size-5" />
                </div>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Imprimable A4
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text">Factures & Reçus d&apos;Acompte</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Imprimez ou partagez des documents propres avec le logo de votre atelier, le détail des acomptes versés et le solde restant.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3 space-y-1.5 shadow-2xs">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-text">Facture FAC-2026-0042</span>
                  <span className="font-bold text-primary-900">65 000 FCFA</span>
                </div>
                <div className="flex justify-between text-[11px] text-text-muted">
                  <span>Acompte reçu (MoMo)</span>
                  <span className="text-success font-semibold">-40 000 FCFA</span>
                </div>
                <div className="flex justify-between text-xs font-extrabold border-t border-border pt-1 text-danger">
                  <span>Solde à la livraison</span>
                  <span>25 000 FCFA</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-border/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted">Partage WhatsApp & PDF</span>
              <ChevronRight className="size-4 text-primary-800 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Carte 5 : Galerie de Modèles & Confection */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-canvas/30 p-6 shadow-xs transition-all hover:shadow-md hover:border-primary-800/40 hover:bg-surface group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-blue-900">
                  <Shirt className="size-5" />
                </div>
                <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Catalogue
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text">Catalogue « Modèles »</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Présentez vos créations et coupes tendances à vos clients avec photos, prix indicatifs et conseils tissus.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-border">
                  <Image src="/images/fildor_modele_afrique.jpg" alt="Modèle Robe Kaba" fill className="object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1.5">
                    <span className="text-[10px] text-white font-bold">Robe Kaba</span>
                  </div>
                </div>
                <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-border">
                  <Image src="/images/fildor_modele.jpg" alt="Modèle Ensemble Wax" fill className="object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1.5">
                    <span className="text-[10px] text-white font-bold">Ensemble Wax</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-border/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted">Création de commande en 1 clic</span>
              <ChevronRight className="size-4 text-primary-800 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Carte 6 : Planning d'Atelier & Équipe */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-canvas/30 p-6 shadow-xs transition-all hover:shadow-md hover:border-primary-800/40 hover:bg-surface group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900">
                  <CalendarClock className="size-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Sérénité
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text">Planning & Zéro Retard</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Visualisez en un coup d&apos;œil ce qui doit être livré aujourd&apos;hui, cette semaine ou pour un événement spécial (mariage, fête).
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Livraisons de la semaine :</span>
                  <span className="font-extrabold text-primary-900">12 tenues</span>
                </div>
                <div className="w-full bg-surface-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary-900 h-2 rounded-full w-3/4" />
                </div>
                <p className="text-[10px] text-text-subtle text-right">9 terminées · 3 en coupe</p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-border/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted">Multi-utilisateurs (patron & apprentis)</span>
              <ChevronRight className="size-4 text-primary-800 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
