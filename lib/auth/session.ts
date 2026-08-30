import { cookies } from "next/headers";
import { getUserById } from "@/lib/mock-data/users";
import { can, type Permission } from "@/features/auth/permissions";
import type { Role, User } from "@/features/auth/types";

export const SESSION_COOKIE_NAME = "fildor_session";

/**
 * Centralise la lecture de session — jamais de check de rôle ad hoc dans un
 * composant (utiliser `RoleGate` ou `requireRole` à la place).
 * `cookies()` est async depuis Next.js 15/16, toujours `await`.
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!userId) return null;
  const user = await getUserById(userId);
  return user ?? null;
}

export async function requireCurrentUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Session invalide : veuillez vous reconnecter.");
  }
  return user;
}

/**
 * À appeler en tout premier dans chaque Server Action sensible. Next.js 16 ne
 * traite pas les Server Actions comme des routes séparées dans la chaîne du
 * proxy — un matcher qui exclut un chemin saute aussi ses Server Actions.
 * `proxy.ts` seul ne protège donc pas les mutations : chaque action revérifie
 * la session et le rôle elle-même.
 */
export async function requireRole(allowedRoles: Role[]): Promise<User> {
  const user = await requireCurrentUser();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Cette action n'est pas autorisée pour votre rôle.");
  }
  return user;
}

/**
 * Garde à privilégier sur `requireRole` : elle exprime le droit métier
 * (« encaisser un paiement ») plutôt que la liste des rôles, si bien qu'ajouter
 * un rôle plus tard ne demande de toucher qu'à `ROLE_PERMISSIONS`.
 * Renvoie l'utilisateur, à utiliser comme auteur de l'action.
 */
export async function requireCan(permission: Permission): Promise<User> {
  const user = await requireCurrentUser();
  if (!can(user.role, permission)) {
    throw new Error("Cette action n'est pas autorisée pour votre rôle.");
  }
  return user;
}

/** À appeler uniquement depuis une Server Action ou un Route Handler (jamais un Server Component). */
export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/** À appeler uniquement depuis une Server Action ou un Route Handler (jamais un Server Component). */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
