import { z } from "zod";

/** Montant en entier XOF — jamais de float pour les sommes financières. */
export const amountSchema = z.number().int().min(0, "Le montant ne peut pas être négatif.");

export const phoneSchema = z
  .string()
  .trim()
  .min(6, "Numéro de téléphone trop court.")
  .regex(/^[\d+\s.-]+$/, "Numéro de téléphone invalide.");

export const isoDateSchema = z.preprocess(
  (val) => (val === "" || val === null ? undefined : val),
  z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Date invalide.")
);
