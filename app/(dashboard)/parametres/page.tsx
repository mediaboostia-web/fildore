import { Users, Shield } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { RoleGate } from "@/components/shared/role-gate";
import { getWorkshop } from "@/lib/mock-data/workshop";
import { getUsers } from "@/lib/mock-data/users";
import { ROLE_LABELS, type Role } from "@/features/auth/types";
import { getCurrentUser } from "@/lib/auth/session";
import { logoutAction } from "@/features/auth/actions";
import { WorkshopSettingsForm } from "./_components/workshop-settings-form";
import { InviteMemberDialog } from "./_components/invite-member-dialog";

/** Modification des paramètres et gestion d'équipe réservées au propriétaire. */
const WORKSHOP_ADMIN_ROLES: Role[] = ["owner"];

export default async function ParametresPage() {
  const [workshop, users, currentUser] = await Promise.all([
    getWorkshop(),
    getUsers(),
    getCurrentUser(),
  ]);

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Paramètres de l'atelier"
        description="Gérez les informations de votre établissement, l'équipe et les préférences de gestion."
      />

      {/* Informations Atelier */}
      <RoleGate
        allow={WORKSHOP_ADMIN_ROLES}
        role={currentUser?.role}
        fallback={
          <p className="rounded-lg border border-border bg-surface-muted p-4 text-sm text-text-muted">
            Seul le propriétaire de l&apos;atelier peut modifier ces informations.
          </p>
        }
      >
        <WorkshopSettingsForm initialWorkshop={workshop} />
      </RoleGate>

      {/* Équipe & Rôles */}
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary-800" />
            <h2 className="font-bold text-base text-text">Membres de l&apos;équipe ({users.length})</h2>
          </div>
          <RoleGate allow={WORKSHOP_ADMIN_ROLES} role={currentUser?.role}>
            <InviteMemberDialog />
          </RoleGate>
        </div>

        <div className="divide-y divide-border">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Avatar name={u.fullName} size="md" />
                <div>
                  <p className="font-medium text-sm text-text">
                    {u.fullName} {u.id === currentUser?.id && "(Vous)"}
                  </p>
                  <p className="text-xs text-text-muted">{u.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  tone={
                    u.role === "owner"
                      ? "success"
                      : u.role === "manager"
                      ? "info"
                      : u.role === "couturiere"
                      ? "warning"
                      : "neutral"
                  }
                  className="text-xs"
                >
                  {ROLE_LABELS[u.role] || u.role}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sécurité & Session */}
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Shield className="size-5 text-primary-800" />
          <h2 className="font-bold text-base text-text">Sécurité & Accès</h2>
        </div>

        <p className="text-sm text-text-muted">
          Vous êtes actuellement connecté en tant que <strong>{currentUser?.fullName}</strong> (
          {ROLE_LABELS[currentUser?.role || "owner"]}).
        </p>

        <div className="pt-2">
          <form action={logoutAction}>
            <Button type="submit" variant="secondary" className="text-danger hover:bg-danger-bg">
              Se déconnecter de cet appareil
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
