import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";
import { ROLE_LABELS } from "@/features/auth/types";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // `proxy.ts` protège déjà ces routes, mais on revérifie ici : c'est aussi
  // ce layout qui a besoin des données utilisateur pour le rendu de l'AppShell.
  const user = await getCurrentUser();
  if (!user) {
    redirect("/connexion");
  }

  return (
    <AppShell
      user={{
        name: user.fullName,
        role: ROLE_LABELS[user.role],
        email: user.email,
      }}
    >
      {children}
    </AppShell>
  );
}
