import { getDb, wait } from "./store";
import type { Workshop } from "@/features/auth/types";

export async function getWorkshop(): Promise<Workshop> {
  await wait();
  return getDb().workshop;
}
