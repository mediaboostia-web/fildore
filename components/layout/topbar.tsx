import Link from "next/link";
import { UserMenu, type UserMenuUser } from "./user-menu";
import { NotificationPopover } from "./notification-popover";

export interface TopbarProps {
  user: UserMenuUser;
}

/** Barre supérieure : marque (mobile, la sidebar la porte déjà sur desktop) + menu utilisateur. */
export function Topbar({ user }: TopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between md:justify-end border-b border-border bg-surface px-4 md:px-6">
      <Link href="/tableau-de-bord" className="text-base font-bold text-primary-900 md:hidden">
        Fildor
      </Link>
      <div className="flex items-center gap-3 ml-auto md:ml-0">
        <NotificationPopover compact />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
