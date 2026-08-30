import type { ReactNode } from "react";
import { SidebarDesktop } from "./sidebar-desktop";
import { BottomTabBar } from "./bottom-tab-bar";
import { Topbar } from "./topbar";
import { Toaster } from "@/components/ui/toast";
import type { UserMenuUser } from "./user-menu";

export interface AppShellProps {
  children: ReactNode;
  user: UserMenuUser;
}

/**
 * Ossature applicative : sidebar desktop + barre d'onglets mobile + topbar.
 * Mobile-first — le contenu réserve l'espace nécessaire pour la barre fixe
 * du bas (PROJECT_RULES.md §3 "Mobile-first obligatoire").
 */
export function AppShell({ children, user }: AppShellProps) {
  return (
    <div className="min-h-screen w-full bg-canvas">
      <SidebarDesktop />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden md:pl-60">
        <Topbar user={user} />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-4 md:px-6 md:pb-6 md:pt-6">{children}</main>
      </div>
      <BottomTabBar />
      <Toaster />
    </div>
  );
}
