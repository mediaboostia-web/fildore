export type MessageTemplateKey =
  | "confirmation_commande"
  | "demande_acompte"
  | "confirmation_paiement"
  | "rendez_vous_mesures"
  | "mise_a_jour_production"
  | "invitation_essayage"
  | "commande_prete"
  | "rappel_solde"
  | "confirmation_livraison"
  | "remerciement"
  | "demande_avis";

export interface MessageTemplate {
  key: MessageTemplateKey;
  label: string;
  body: string; // contient des variables {prenom_client}, {reference_commande}, etc.
}

export interface MessageTemplateVariables {
  prenom_client: string;
  nom_client: string;
  reference_commande: string;
  nom_commande: string;
  date_livraison: string;
  date_evenement?: string;
  montant_total: string;
  acompte: string;
  solde: string;
  nom_atelier: string;
  numero_atelier: string;
  lien_document: string;
}

/**
 * Client réduit à ce que la messagerie affiche.
 *
 * L'écran passait auparavant les objets `Client` et `Order` **complets** au
 * navigateur : adresses, notes internes et, via `Order.measurementSnapshot`,
 * les mesures corporelles de tous les clients de l'atelier partaient dans le
 * bundle JS (PROJECT_RULES.md §7).
 */
export interface MessagingClient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

/**
 * Commande réduite, avec les montants **déjà calculés par le serveur**.
 * Le solde n'est jamais recalculé dans le navigateur : c'est la règle §6
 * (« Le solde est calculé côté serveur »), et l'écran de relance l'enfreignait
 * en annonçant le total à la place du solde.
 */
export interface MessagingOrder {
  id: string;
  clientId: string;
  reference: string;
  title: string;
  deliveryDate: string;
  eventDate?: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  /** Premier acompte réellement encaissé, s'il existe. Jamais une estimation. */
  recordedDepositAmount?: number;
  /** Chemin du dernier document partagé pour cette commande, s'il existe. */
  documentSharePath?: string;
}

/** Coordonnées de l'atelier insérées dans les messages. */
export interface MessagingWorkshop {
  name: string;
  whatsappPhone: string;
}

export interface MessageLogEntry {
  id: string;
  workshopId: string;
  clientId: string;
  orderId?: string;
  templateKey: MessageTemplateKey;
  resolvedBody: string;
  sentByUserId: string;
  sentAt: string;
}
