import Link from "next/link";
import { FildorLogo } from "@/components/brand/fildor-logo";
import { UserMenu, type UserMenuUser } from "./user-menu";
import { NotificationPopover } from "./notification-popover";
import type { WorkshopNotification } from "@/features/dashboard/notifications";

export interface TopbarProps {
  user: UserMenuUser;
  notifications: WorkshopNotification[];
}

/** Barre supérieure : logo Fildor sur mobile + popover notifications + menu utilisateur. */
export function Topbar({ user, notifications }: TopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between md:justify-end border-b border-border bg-surface px-4 md:px-6">
      {/* Logo Fildor visible sur mobile */}
      <Link href="/tableau-de-bord" className="flex items-center gap-2 md:hidden">
        <FildorLogo variant="lockup" height={26} />
      </Link>

      <div className="flex items-center gap-3 ml-auto md:ml-0">
        <NotificationPopover notifications={notifications} compact />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
