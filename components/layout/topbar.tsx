import Link from "next/link";
import { UserMenu, type UserMenuUser } from "./user-menu";

export interface TopbarProps {
  user: UserMenuUser;
}

/** Barre supérieure : marque (mobile, la sidebar la porte déjà sur desktop) + menu utilisateur. */
export function Topbar({ user }: TopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
      <Link href="/tableau-de-bord" className="text-base font-semibold text-primary-900 md:hidden">
        Fildor
      </Link>
      <span className="hidden md:block" />
      <UserMenu user={user} />
    </header>
  );
}
