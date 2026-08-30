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
