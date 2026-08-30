import { getDb, wait } from "./store";
import { generateId } from "./ids";
import type { Role, User } from "@/features/auth/types";

/** Couleurs d'avatar réutilisées en rotation pour les nouveaux membres. */
const AVATAR_COLORS = ["#215149", "#C45A32", "#2F6687", "#A86412", "#3A7B6C"];

export async function getUsers(): Promise<User[]> {
  await wait();
  return getDb().users;
}

export async function getUserById(id: string): Promise<User | undefined> {
  await wait();
  return getDb().users.find((u) => u.id === id);
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  await wait();
  const normalized = email.trim().toLowerCase();
  return getDb().users.find((u) => u.email.toLowerCase() === normalized);
}

export interface CreateUserInput {
  workshopId: string;
  fullName: string;
  email: string;
  role: Role;
}

/**
 * Ajoute un membre à l'atelier. Le mock n'envoie évidemment pas d'e-mail : le
 * membre est créé directement et apparaît dans la liste de l'équipe, ce qui est
 * vérifiable — plutôt qu'un message « invitation envoyée » sans effet.
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  await wait();
  const db = getDb();
  const user: User = {
    id: generateId("user"),
    workshopId: input.workshopId,
    fullName: input.fullName,
    email: input.email.trim().toLowerCase(),
    role: input.role,
    avatarColor: AVATAR_COLORS[db.users.length % AVATAR_COLORS.length],
  };
  db.users.push(user);
  return user;
}
