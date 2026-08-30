import { redirect } from "next/navigation";
import { Shield, Building, LogOut, ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { getUsers } from "@/lib/mock-data/users";
import { getWorkshop } from "@/lib/mock-data/workshop";
import { ROLE_LABELS, type Role } from "@/features/auth/types";
import { loginAction, logoutAction } from "@/features/auth/actions";

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  owner: [
    "Gestion intégrale de l'atelier et des paramètres",
    "Création, modification et suppression de commandes",
    "Gestion des clients et des profils de mesures",
    "Encaissement et consultation de la trésorerie",
    "Émission et impression des factures et reçus",
    "Envoi de messages WhatsApp avec templates",
    "Gestion de l'équipe et des accès",
  ],
  manager: [
    "Création, modification et suivi des commandes",
    "Attribution des commandes aux couturiers",
    "Gestion des clients et des profils de mesures",
    "Encaissement et validation des paiements",
    "Émission des factures et bons de commande",
    "Communication client par WhatsApp",
  ],
  couturiere: [
    "Consultation des fiches techniques de confection",
    "Accès aux profils de mesures anatomiques",
    "Mise à jour des statuts de production (Coupe, Couture, Prête)",
  ],
  reception: [
    "Accueil des clients et enregistrement des fiches",
    "Prise de mesures et saisie des commandes",
    "Encaissement des acomptes initiaux",
    "Envoi des notifications WhatsApp de commande prête",
  ],
  comptable: [
    "Suivi des encaissements et des soldes impayés",
    "Émission et export des factures et reçus de paiement",
    "Consultation du journal financier",
  ],
};

export default async function ProfilePage() {
  const [currentUser, allUsers, workshop] = await Promise.all([
    getCurrentUser(),
    getUsers(),
    getWorkshop(),
  ]);

  if (!currentUser) {
    redirect("/connexion");
  }

  const permissions = ROLE_PERMISSIONS[currentUser.role] || [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Mon Profil"
        description="Consultez vos informations de compte, vos permissions d'atelier et changez de profil."
      />

      {/* Carte d'identité utilisateur */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <Avatar name={currentUser.fullName} size="lg" className="size-20 text-xl" />
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-bold text-text">{currentUser.fullName}</h2>
              <Badge
                tone={
                  currentUser.role === "owner"
                    ? "success"
                    : currentUser.role === "manager"
                    ? "info"
                    : currentUser.role === "couturiere"
                    ? "warning"
                    : "neutral"
                }
                className="self-center sm:self-auto text-xs"
              >
                {ROLE_LABELS[currentUser.role] || currentUser.role}
              </Badge>
            </div>

            <p className="text-sm text-text-muted">{currentUser.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <Building className="size-4 text-primary-800" />
                {workshop.name} — {workshop.city}, {workshop.country}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="size-4 text-accent-600" />
                Accès {ROLE_LABELS[currentUser.role]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions du rôle */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Shield className="size-5 text-primary-800" />
          <h3 className="text-base font-bold text-text">
            Vos droits & permissions ({ROLE_LABELS[currentUser.role]})
          </h3>
        </div>

        <ul className="grid gap-2.5 sm:grid-cols-2">
          {permissions.map((perm, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-text">
              <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
              <span>{perm}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Switcher rapide d'utilisateur (Démo) */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm space-y-4">
        <div className="border-b border-border pb-3">
          <h3 className="text-base font-bold text-text">Changer de profil (Session Démo)</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Sélectionnez un autre collaborateur pour tester l&apos;interface avec ses permissions spécifiques.
          </p>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {allUsers.map((u) => {
            const isCurrent = u.id === currentUser.id;
            return (
              <form key={u.id} action={loginAction} className="w-full">
                <input type="hidden" name="userId" value={u.id} />
                <input type="hidden" name="redirect" value="/profil" />
                <button
                  type="submit"
                  disabled={isCurrent}
                  className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all ${
                    isCurrent
                      ? "border-primary-800 bg-primary-50/60 cursor-default"
                      : "border-border bg-surface hover:border-primary-700 hover:bg-surface-muted cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={u.fullName} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-text">{u.fullName}</p>
                      <p className="text-xs text-text-muted">{ROLE_LABELS[u.role]}</p>
                    </div>
                  </div>
                  {isCurrent ? (
                    <Badge tone="success" className="text-xs">
                      Actif
                    </Badge>
                  ) : (
                    <ArrowRight className="size-4 text-text-subtle" />
                  )}
                </button>
              </form>
            );
          })}
        </div>
      </div>

      {/* Bouton de déconnexion */}
      <div className="flex justify-end pt-2">
        <form action={logoutAction}>
          <Button type="submit" variant="secondary" className="text-danger hover:bg-danger-bg" icon={<LogOut className="size-4" />}>
            Se déconnecter de Fildor
          </Button>
        </form>
      </div>
    </div>
  );
}
