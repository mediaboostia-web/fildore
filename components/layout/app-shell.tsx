"use client";

import type { ReactNode } from "react";
import { SidebarDesktop } from "./sidebar-desktop";
import { BottomTabBar } from "./bottom-tab-bar";
import { Topbar } from "./topbar";
import { Toaster } from "@/components/ui/toast";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils/cn";
import type { UserMenuUser } from "./user-menu";

export interface AppShellProps {
  children: ReactNode;
  user: UserMenuUser;
}

function AppShellContent({ children, user }: AppShellProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen w-full bg-canvas">
      <SidebarDesktop />
      <div
        className={cn(
          "flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden transition-all duration-200",
          isCollapsed ? "md:pl-18" : "md:pl-60"
        )}
      >
        <Topbar user={user} />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-4 md:px-6 md:pb-6 md:pt-6">
          {children}
        </main>
      </div>
      <BottomTabBar />
      <Toaster />
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <SidebarProvider>
      <AppShellContent {...props} />
    </SidebarProvider>
  );
}
