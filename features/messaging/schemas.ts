import { z } from "zod";
import { MESSAGE_TEMPLATE_KEYS } from "./types";

/**
 * Journalisation d'un envoi WhatsApp.
 *
 * Une Server Action reçoit ce qui arrive sur le réseau : le type TypeScript
 * disparaît à l'exécution et ne protège rien. Sans ce schéma, n'importe quelle
 * session valide pouvait écrire un corps de message de taille illimitée et un
 * modèle inexistant dans le journal de l'atelier.
 */
export const logMessageSchema = z.object({
  clientId: z.string().min(1, "Client manquant."),
  orderId: z.string().min(1).optional(),
  templateKey: z.enum(MESSAGE_TEMPLATE_KEYS),
  // Un message WhatsApp dépasse rarement 1 500 caractères ; au-delà, c'est un
  // abus de stockage, pas une relance.
  resolvedBody: z.string().min(1, "Message vide.").max(4000, "Message trop long."),
});

export type LogMessageInput = z.infer<typeof logMessageSchema>;
