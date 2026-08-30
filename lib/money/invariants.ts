/**
 * Tous les montants Fildor sont des entiers (jamais de float) — voir PROJECT_RULES.md §6/§7.
 * `assertInteger` est le garde-fou dev appelé à l'écriture (repository mock, puis Supabase plus tard).
 */
export function assertInteger(value: number, label: string): number {
  if (!Number.isInteger(value)) {
    throw new Error(`Montant invalide pour "${label}" : ${value} n'est pas un entier.`);
  }
  return value;
}
