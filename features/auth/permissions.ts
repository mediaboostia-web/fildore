import type { Role } from "./types";

/**
 * Qui a le droit de faire quoi dans l'atelier.
 *
 * Table unique : le serveur s'en sert pour autoriser (`requireCan`), l'interface
 * pour masquer (`RoleGate`), et la page Profil pour afficher à chacun ses droits.
 * Une seule source évite qu'un bouton visible déclenche une action refusée —
 * ou l'inverse, plus grave : une action autorisée que rien n'annonce.
 */
export type Permission =
  // Commandes
  | "commande:creer"
  | "commande:modifier"
  | "commande:changer_statut"
  | "commande:annuler"
  // Argent
  | "paiement:encaisser"
  | "paiement:annuler"
  | "document:generer"
  // Clients et mesures
  | "client:creer"
  | "client:modifier"
  | "client:archiver"
  | "mesures:enregistrer"
  | "mesures:corriger"
  // Atelier
  | "catalogue:gerer"
  | "message:envoyer"
  | "demande:traiter"
  | "atelier:parametres"
  | "equipe:gerer";

/** Libellé affiché au collaborateur sur sa page Profil. Écrit de son point de vue. */
export const PERMISSION_LABELS: Record<Permission, string> = {
  "commande:creer": "Créer des commandes",
  "commande:modifier": "Modifier une commande en cours",
  "commande:changer_statut": "Faire avancer la production (coupe, couture, prête…)",
  "commande:annuler": "Annuler une commande",
  "paiement:encaisser": "Encaisser un acompte ou un solde",
  "paiement:annuler": "Annuler un paiement saisi par erreur",
  "document:generer": "Créer devis, factures, reçus et bons de livraison",
  "client:creer": "Ajouter des clients",
  "client:modifier": "Modifier la fiche d'un client",
  "client:archiver": "Archiver un client",
  "mesures:enregistrer": "Prendre et enregistrer des mesures",
  "mesures:corriger": "Corriger un profil de mesures",
  "catalogue:gerer": "Gérer le catalogue de modèles",
  "message:envoyer": "Envoyer des messages WhatsApp aux clients",
  "demande:traiter": "Accepter ou refuser les demandes reçues en ligne",
  "atelier:parametres": "Modifier les informations de l'atelier",
  "equipe:gerer": "Ajouter et gérer les membres de l'équipe",
};

const ALL_PERMISSIONS = Object.keys(PERMISSION_LABELS) as Permission[];

/**
 * Droits par rôle, calqués sur les métiers réels d'un atelier :
 * la couturière fait avancer la production mais ne touche pas à l'argent ;
 * la réception accueille, prend les mesures et encaisse l'acompte du jour ;
 * le comptable suit les encaissements et édite les documents ;
 * le manager pilote l'atelier ; le propriétaire décide de tout.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: ALL_PERMISSIONS,

  manager: [
    "commande:creer",
    "commande:modifier",
    "commande:changer_statut",
    "paiement:encaisser",
    "document:generer",
    "client:creer",
    "client:modifier",
    "client:archiver",
    "mesures:enregistrer",
    "mesures:corriger",
    "catalogue:gerer",
    "message:envoyer",
    "demande:traiter",
  ],

  couturiere: ["commande:changer_statut"],

  reception: [
    "commande:creer",
    "commande:changer_statut",
    "paiement:encaisser",
    "client:creer",
    "client:modifier",
    "mesures:enregistrer",
    "mesures:corriger",
    "message:envoyer",
    // La réception accueille déjà les clients qui passent : accepter une
    // demande venue de la page publique relève du même geste.
    "demande:traiter",
  ],

  comptable: ["paiement:encaisser", "document:generer", "message:envoyer"],
};

/** Vrai si ce rôle a le droit. Un rôle absent ou inconnu n'a aucun droit. */
export function can(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/** Rôles autorisés pour une permission — format attendu par `RoleGate allow={…}`. */
export function rolesAllowedTo(permission: Permission): Role[] {
  return (Object.keys(ROLE_PERMISSIONS) as Role[]).filter((role) => can(role, permission));
}
