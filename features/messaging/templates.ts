import type { MessageTemplate, MessageTemplateVariables } from "./types";

/**
 * Les 11 templates initiaux du cahier des charges (section 6.7). Le document
 * ne fournit que les noms, pas le texte exact — le contenu ci-dessous est
 * rédigé dans le ton Fildor (clair, chaleureux, orienté action, sans jargon)
 * et reste modifiable par l'atelier avant envoi (voir WhatsAppMessagePreview).
 */
export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    key: "confirmation_commande",
    label: "Confirmation commande",
    body: "Bonjour {prenom_client}, votre commande {reference_commande} chez {nom_atelier} est bien enregistrée. Livraison prévue le {date_livraison}. Montant total : {montant_total}. Récapitulatif : {lien_document}. Merci de votre confiance !",
  },
  {
    key: "demande_acompte",
    label: "Demande acompte",
    body: "Bonjour {prenom_client}, pour lancer la production de votre commande {reference_commande}, merci de régler un acompte de {acompte}. Nous restons disponibles pour organiser le paiement. Merci !",
  },
  {
    key: "confirmation_paiement",
    label: "Confirmation paiement",
    body: "Bonjour {prenom_client}, nous confirmons la réception de votre paiement pour la commande {reference_commande}. Solde restant : {solde}. Merci !",
  },
  {
    key: "rendez_vous_mesures",
    label: "Rendez-vous mesures",
    body: "Bonjour {prenom_client}, nous aimerions prendre vos mesures pour la commande {reference_commande}. Quand seriez-vous disponible pour passer à {nom_atelier} ?",
  },
  {
    key: "mise_a_jour_production",
    label: "Mise à jour production",
    body: "Bonjour {prenom_client}, petite mise à jour : votre commande {reference_commande} avance bien en atelier. Livraison prévue le {date_livraison}.",
  },
  {
    key: "invitation_essayage",
    label: "Invitation essayage",
    body: "Bonjour {prenom_client}, votre tenue {nom_commande} est prête pour un essayage. Passez à {nom_atelier} quand vous le pouvez !",
  },
  {
    key: "commande_prete",
    label: "Commande prête",
    body: "Bonjour {prenom_client}, bonne nouvelle : votre commande {reference_commande} est prête à être récupérée ! Solde à régler : {solde}.",
  },
  {
    key: "rappel_solde",
    label: "Rappel solde",
    body: "Bonjour {prenom_client}, petit rappel : le solde de votre commande {reference_commande} est de {solde}. Merci de le régler dès que possible.",
  },
  {
    key: "confirmation_livraison",
    label: "Confirmation livraison",
    body: "Bonjour {prenom_client}, votre commande {reference_commande} a bien été livrée. Merci de votre confiance, {nom_atelier} reste à votre disposition.",
  },
  {
    key: "remerciement",
    label: "Remerciement",
    body: "Bonjour {prenom_client}, merci d'avoir choisi {nom_atelier} pour votre commande {reference_commande} ! Nous espérons vous revoir bientôt.",
  },
  {
    key: "demande_avis",
    label: "Demande d'avis",
    body: "Bonjour {prenom_client}, votre avis compte pour nous ! Que pensez-vous de votre commande {reference_commande} ? Merci de nous laisser un petit mot.",
  },
];

export function getMessageTemplate(key: MessageTemplate["key"]): MessageTemplate {
  const template = MESSAGE_TEMPLATES.find((t) => t.key === key);
  if (!template) {
    throw new Error(`Template de message introuvable : "${key}".`);
  }
  return template;
}

/** Résout les variables uniquement avec les données du client et de la commande ciblés. */
export function resolveMessageTemplate(
  template: MessageTemplate,
  variables: MessageTemplateVariables
): string {
  return template.body.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = variables[key as keyof MessageTemplateVariables];
    return value !== undefined ? value : match;
  });
}

export function buildWhatsAppLink(phoneE164: string, message: string): string {
  const digits = phoneE164.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
