import { getDb, wait } from "./store";
import type { User } from "@/features/auth/types";

export async function getUsers(): Promise<User[]> {
  await wait();
  return getDb().users;
}

export async function getUserById(id: string): Promise<User | undefined> {
  await wait();
  return getDb().users.find((u) => u.id === id);
}
