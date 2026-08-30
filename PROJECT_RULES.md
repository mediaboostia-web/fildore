# Fildor — Règles du projet et Design System

> **Document de gouvernance pour Claude Code / Antigravity**
> Statut : obligatoire pour toute création, modification ou correction dans le projet Fildor.

---

## 1. Mission du projet

Fildor est un SaaS **mobile-first** conçu pour les couturiers, stylistes et ateliers de mode africains. Il centralise le cycle d'une commande : client, mesures, commande, production, acompte, paiement, facture, livraison et communication WhatsApp.

La priorité du produit est l'efficacité opérationnelle de l'atelier : l'utilisateur doit pouvoir retrouver une information, créer une commande, encaisser un paiement et communiquer avec un client sans complexité inutile.

### Promesse produit

> **Ne perdez plus une commande, une mesure, une date de livraison ou un paiement.**

### Principes de positionnement

- Fildor n'est pas un outil SaaS générique : il comprend le métier de la couture.
- Fildor n'est pas une marketplace au lancement : il résout d'abord les opérations quotidiennes de l'atelier.
- Fildor est conçu pour les réalités africaines : smartphone Android, connexion variable, WhatsApp, espèces et Mobile Money.
- Fildor doit être rassurant, lisible, chaleureux et professionnel.

---

## 2. Règles de travail pour Claude

### Instruction fondamentale

Avant toute modification, Claude doit :

1. Lire le code existant et identifier la structure réelle du projet.
2. Résumer la tâche demandée et son impact.
3. Proposer un plan court et concret.
4. Lister les fichiers à modifier ou à créer.
5. Identifier les impacts sur UI, données, routes, permissions, tests et documentation.
6. Ne pas modifier de module hors périmètre sans le signaler.
7. Préserver les comportements existants qui ne sont pas concernés.
8. Ajouter ou mettre à jour les tests lorsque la fonctionnalité le nécessite.

### Règles de qualité

- Utiliser TypeScript strict ; ne pas introduire de `any` sans justification.
- Préférer des composants petits, explicites et réutilisables.
- Ne pas dupliquer une logique déjà présente dans le projet.
- Ne pas créer de dépendance supplémentaire si une solution simple existe déjà dans la stack.
- Ne pas fabriquer de fausses intégrations : si une API n'est pas configurée, utiliser une interface clairement isolée ou un mock de développement, jamais une fausse logique de production.
- Garder les textes UI en français clair, simple et orienté action.
- Vérifier l'expérience mobile avant de considérer une tâche terminée.
- Ajouter les états `loading`, `empty`, `error` et `success` sur toute interface alimentée par des données.
- Ne jamais exposer de secret, clé privée, variable serveur ou information sensible côté navigateur.
- Ne jamais modifier une migration ou une règle d'accès de manière destructive sans plan de compatibilité et test associé.

### Règles de livraison

Chaque livraison doit inclure :

- Un résumé des changements.
- La liste des fichiers modifiés.
- Les décisions techniques prises.
- Les tests exécutés.
- Une checklist de vérification manuelle.
- Les éventuels risques, limites ou tâches restantes.

---

## 3. Principes UX

### Mobile-first obligatoire

Fildor est utilisé majoritairement depuis un smartphone. Toute interface doit être pensée d'abord pour 375 px de large, puis adaptée aux écrans plus grands.

- Les actions quotidiennes doivent être accessibles rapidement avec le pouce.
- Les boutons principaux doivent être visibles sans devoir chercher dans des menus.
- Les formulaires longs sont découpés en étapes logiques.
- Les tableaux doivent devenir des listes ou cartes lisibles sur mobile.
- Les informations critiques d'une commande — client, statut, date de livraison, montant, solde — doivent être visibles immédiatement.
- Les zones tactiles doivent être confortables ; cible minimale recommandée : 44 × 44 px.
- Les actions destructives exigent une confirmation explicite.

### Navigation principale

**Mobile**

```text
Accueil | Commandes | Clients | Messages | Plus
```

Dans `Plus` :

```text
Projets | Modèles | Catalogue | Factures | Paiements | Rapports | Équipe | Paramètres
```

**Desktop**

```text
Tableau de bord
Commandes
Clients
Projets
Modèles & Catalogue
Messagerie
Factures & Paiements
Rapports
Équipe
Paramètres
```

### Hiérarchie de l'information

Sur une fiche commande, l'ordre visuel prioritaire est :

1. Nom du client et moyen de contact.
2. Statut de production.
3. Date de livraison.
4. Montant total, encaissé et solde.
5. Prochaine action attendue.
6. Modèle, photos, mesures, notes et historique.

### États UX obligatoires

Chaque page ou composant dépendant de données doit prévoir :

| État | Attendu |
|---|---|
| Chargement | Skeleton ou indicateur discret qui conserve la structure de la page |
| Vide | Explication simple + action principale pour commencer |
| Erreur | Cause compréhensible + action de réessai |
| Succès | Confirmation claire et non intrusive |
| Hors connexion | Message clair si applicable + conservation de brouillon quand possible |
| Permission refusée | Explication sans détail technique ni fuite d'information |

### Ton rédactionnel

Le ton Fildor est :

- Clair.
- Direct.
- Chaleureux.
- Professionnel.
- Rassurant.
- Sans jargon technique.

Préférer :

- « Nouvelle commande »
- « Enregistrer un acompte »
- « Solde restant »
- « Commande prête à livrer »
- « Vérifiez votre connexion puis réessayez »

Éviter :

- « Mutation réussie »
- « Erreur 500 »
- « Entité créée »
- « Synchronisation de payload »
- « Ressource introuvable »

---

## 4. Design System Fildor

### Intention visuelle

Le design doit exprimer :

- La précision du métier de couture.
- La chaleur du travail artisanal.
- La confiance nécessaire à la gestion des paiements.
- La clarté d'un outil de gestion professionnel.
- Une modernité sobre, jamais ostentatoire.

Fildor doit éviter l'esthétique générique des landing pages IA ou crypto. L'interface doit être calme, structurée et utile.

### Palette recommandée

Les couleurs suivantes constituent une direction de base. Elles peuvent être ajustées avec cohérence, mais sans s'éloigner de l'esprit du système.

```css
:root {
  --color-primary-950: #102B28;
  --color-primary-900: #173B36;
  --color-primary-800: #215149;
  --color-primary-700: #2C675C;
  --color-primary-600: #3A7B6C;
  --color-primary-100: #DCECE6;
  --color-primary-50:  #F1F8F5;

  --color-accent-700: #A64B2A;
  --color-accent-600: #C45A32;
  --color-accent-500: #D97945;
  --color-accent-100: #F8E1D5;
  --color-accent-50:  #FFF5F0;

  --color-background: #FAFAF7;
  --color-surface: #FFFFFF;
  --color-surface-muted: #F4F6F4;
  --color-border: #D9E0DD;
  --color-border-strong: #B8C4BF;

  --color-text: #1B2422;
  --color-text-muted: #64716D;
  --color-text-subtle: #88938F;

  --color-success: #237A52;
  --color-success-bg: #E6F4EC;
  --color-warning: #A86412;
  --color-warning-bg: #FFF3D6;
  --color-danger: #B33A3A;
  --color-danger-bg: #FCE8E8;
  --color-info: #2F6687;
  --color-info-bg: #E8F2F8;
}
```

### Règles de couleur

- Utiliser le vert profond comme couleur de confiance, navigation et actions structurantes.
- Utiliser le terracotta/orange chaud avec parcimonie pour les appels à l'action, alertes commerciales ou accents artisanaux.
- Utiliser des fonds blancs cassés et neutres chauds pour réduire la fatigue visuelle.
- Ne jamais utiliser une couleur seule pour exprimer un statut : associer couleur, libellé et éventuellement icône.
- Garantir un contraste accessible pour les textes et boutons.
- Les couleurs d'état sont fonctionnelles et ne doivent pas être utilisées comme décoration.

### Typographie

- Utiliser une police sans-serif moderne, très lisible et disponible sur le web.
- Prioriser la lisibilité sur les petits écrans.
- Employer une hiérarchie simple : titre de page, sous-titre, titre de section, texte, légende.
- Éviter les polices décoratives, manuscrites ou trop luxueuses dans l'interface métier.
- Limiter le nombre de tailles et graisses pour conserver une interface calme.

Échelle indicative :

```text
Display : 32–40 px / 700 — marketing uniquement
H1      : 24–30 px / 700
H2      : 20–24 px / 700
H3      : 16–18 px / 600
Body    : 14–16 px / 400
Small   : 12–13 px / 400
Label   : 12–14 px / 500
```

### Espacement et grille

```text
Base d'espacement : 4 px
Échelle : 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 px
```

- Employer une grille simple et cohérente.
- Respecter des marges généreuses sur mobile sans gaspiller l'espace vertical.
- Limiter la largeur de lecture sur desktop.
- Regrouper les champs liés dans une même section avec un titre et une explication courte.

### Rayons et ombres

```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 14px;
--radius-xl: 18px;
```

- Les rayons doivent rester modérés et fonctionnels.
- Les cartes ne doivent pas toutes avoir le même style décoratif.
- Utiliser des ombres faibles et naturelles seulement lorsqu'elles indiquent une élévation ou un élément interactif.
- Préférer une bordure neutre et un fond net à une ombre prononcée.

### Boutons

| Type | Usage | Règle |
|---|---|---|
| Primaire | Action la plus importante de l'écran | Fond vert profond, texte clair |
| Secondaire | Action alternative | Fond clair ou bordure visible |
| Tertiaire | Action discrète | Texte ou icône, sans perdre l'accessibilité |
| Danger | Suppression, annulation irréversible | Rouge uniquement pour risque réel |
| WhatsApp | Lancer une conversation / partager | Vert WhatsApp uniquement dans ce contexte |

Règles :

- Un seul bouton primaire dominant par vue ou section.
- Libellé orienté action : « Créer la commande », pas « Soumettre ».
- Éviter les boutons trop larges ou inutilement décoratifs.
- Afficher un état de chargement pendant les actions asynchrones.
- Désactiver clairement un bouton indisponible en expliquant la raison si nécessaire.

### Formulaires

- Toujours afficher un label, pas uniquement un placeholder.
- Les champs obligatoires sont clairement marqués mais sans surcharge visuelle.
- Les erreurs apparaissent au niveau du champ concerné et indiquent la correction attendue.
- Les montants utilisent le format local : `35 000 FCFA`.
- Les téléphones utilisent un sélecteur pays ou une normalisation adaptée.
- Les champs de commande doivent proposer des valeurs initiales raisonnables sans masquer les choix importants.
- Ne jamais demander une information que le système peut calculer ou préremplir.

### Cartes, tableaux et listes

- Utiliser les cartes pour les entités autonomes sur mobile : commande, client, facture, tâche.
- Utiliser les tableaux principalement sur desktop et prévoir une alternative mobile.
- Les cartes doivent servir une hiérarchie d'information, pas décorer l'interface.
- Une carte commande mobile doit afficher au minimum : client, référence, statut, livraison, total et solde.
- Les listes doivent proposer recherche, filtres et états vides compréhensibles.

### Badges et statuts

Les statuts doivent utiliser un fond très léger, une couleur de texte contrastée et un libellé explicite.

| Statut | Couleur fonctionnelle |
|---|---|
| Confirmée / prête / payée | Success |
| En cours / couture / essayage | Info ou primaire |
| Acompte attendu / bientôt dû | Warning |
| En retard / impayé / annulée | Danger |
| Brouillon / archivée | Neutre |

### Icônes

- Utiliser Lucide React ou l'iconographie existante du projet.
- Les icônes doivent clarifier une action, jamais remplacer une étiquette ambiguë.
- Préférer les icônes simples, traits réguliers et tailles cohérentes.
- Éviter les icônes purement décoratives dans les écrans métier.
- Ne jamais utiliser d'icône étincelle à 4 branches.

### Images et fichiers

- Les photos de modèles, tissus et réalisations doivent être utiles à la commande ou au catalogue.
- Afficher des placeholders sobres avant chargement.
- Compresser les images ; prévoir recadrage simple si nécessaire.
- Ne pas utiliser d'images décoratives lourdes dans les espaces métier.
- Les documents PDF doivent privilégier la lisibilité A4 et mobile.

---

## 5. Matrice d'exclusion stricte — DO NOT USE

Les éléments suivants sont **interdits** dans les interfaces, pages marketing, dashboard, composants, animations, prompts de design et propositions de code Fildor.

| Élément interdit | Interdiction explicite | Alternative Fildor |
|---|---|---|
| Arrière-plans dark mode à lueurs violettes/cyans | Pas de background glows, halos néon ou ambiance crypto/IA | Fonds clairs chauds, surfaces nettes, contraste sobre |
| Sphères 3D flottantes brillantes | Pas de glossy floating orbs, blobs ou objets 3D décoratifs | Photos métier utiles, textures très légères si justifiées |
| Étincelles 4 branches | Ne jamais utiliser ✨, ✦ ni iconographie sparkle similaire | Icônes métier simples : ciseaux, document, paiement, message |
| Titres en dégradés | Pas de gradient-filled text | Titres unis en vert profond ou texte principal |
| Machine à écrire animée | Pas de typewriter effect | Transitions courtes et discrètes, ou contenu statique clair |
| Glassmorphism générique | Pas de backdrop-blur, panneaux transparents flous ou verre givré | Surface opaque, bordure neutre, ombre faible si nécessaire |
| Mockups flottants isométriques | Pas de faux écrans en perspective décorative | Captures réelles, aperçus plats ou illustrations utilitaires |
| Grilles Bento uniformes rounded-3xl | Pas de bento grid générique, ni coins excessivement arrondis | Grilles fonctionnelles, cartes de densité adaptée, rayons modérés |
| Bordures fluo ou néon animées | Pas de neon animated borders | Bordures neutres, état focus accessible, couleur fonctionnelle |

### Règle d'application

Si un design, une maquette, un composant généré ou une proposition de Claude contient l'un de ces éléments, il doit être corrigé avant validation. Aucune exception n'est accordée pour « moderniser » ou « rendre plus impressionnant » l'interface.

---

## 6. Règles fonctionnelles métier

### Commandes

La commande est l'objet central de Fildor. Elle relie client, mesures, modèles, paiements, documents, messages et production.

La fiche commande doit toujours rendre visibles :

- Client et contact WhatsApp.
- Référence commande.
- Statut actuel.
- Date de livraison.
- Montant total.
- Acompte et total encaissé.
- Solde restant.
- Prochaine action.
- Historique des changements.

Statuts recommandés :

```text
Brouillon
À confirmer
Acompte attendu
Confirmée
Mesures à prendre
Tissu / fournitures
Coupe
Couture
Essayage
Retouche
Prête
Livrée
Terminée
Suspendue
Annulée
```

### Clients et mesures

- Un client appartient à une seule organisation.
- Un client peut avoir plusieurs profils de mesures.
- Les profils de mesures doivent être datés et historisés.
- Une commande conserve un snapshot de mesures au moment de sa validation.
- Une modification ultérieure des mesures client ne doit jamais réécrire les anciennes commandes.

### Paiements

- Tous les montants sont stockés en entiers, jamais en float.
- Le solde est calculé côté serveur.
- Les paiements partiels doivent être supportés.
- Un paiement annulé, échoué ou remboursé doit rester traçable.
- Les paiements en espèces et Mobile Money doivent pouvoir être enregistrés manuellement au MVP.

### Documents

- Les documents doivent avoir une numérotation lisible et unique par organisation.
- Devis, bon de commande, reçu, facture et bon de livraison sont distincts.
- Une facture validée ne doit pas être silencieusement modifiée ou supprimée.
- Les liens publics vers un document doivent être sécurisés, révocables et limités à une ressource précise.

### Messagerie

- WhatsApp est un canal d'action, pas une simple décoration.
- Les messages préremplis doivent rester modifiables avant envoi.
- Les variables doivent être résolues uniquement avec les données du client et de la commande ciblés.
- Les actions d'envoi doivent être journalisées.
- Ne jamais envoyer de communication marketing sans consentement explicite.

---

## 7. Sécurité et données

### Règles non négociables

- Toutes les tables métier possèdent `organization_id`.
- Row Level Security est activé sur les tables exposées.
- Les politiques RLS couvrent séparément `SELECT`, `INSERT`, `UPDATE` et `DELETE`.
- Toute action serveur valide la session, l'organisation, le rôle et le payload avec Zod.
- La clé Supabase `service_role` est strictement serveur.
- Les fichiers sont privés par défaut.
- Les URLs publiques sont signées ou protégées par token à haute entropie.
- Les données sensibles ne sont jamais incluses dans les logs, analytics ou URLs.
- Les webhooks de paiement sont signés, vérifiés et idempotents.
- Les actions sensibles alimentent les `audit_logs`.

### Données sensibles

Protéger particulièrement :

- Numéros de téléphone.
- Adresses.
- Mesures corporelles.
- Photos clients.
- Pièces jointes de commande.
- Preuves de paiement.
- Factures et reçus.
- Notes internes d'atelier.

---

## 8. Tests et stratégie de correction

### Definition of Done

Une tâche est terminée seulement si :

- Le parcours concerné fonctionne sur mobile et desktop.
- Les états loading, empty, error et success existent.
- Les validations formulaire et serveur sont présentes.
- Les permissions applicables sont testées.
- Les tests nécessaires sont ajoutés ou mis à jour.
- Les régressions connues sont vérifiées.
- Le code est lisible, typé et conforme à ce document.
- La documentation pertinente est mise à jour.

### Catégories de test

| Niveau | Objectif |
|---|---|
| Unitaire | Calculs financiers, validation, statuts, formatting, permissions |
| Composant | Formulaires, boutons, filtres, erreurs, états visuels |
| Intégration | Actions serveur, requêtes, génération documents, paiements |
| RLS | Isolation entre organisations et rôles |
| E2E | Parcours complets : client → commande → paiement → document → livraison |
| Visuel | Régression responsive et cohérence design system |
| UAT | Validation avec ateliers pilotes |

### Stratégie de correction

```text
Détection
→ Reproduction
→ Qualification P0 à P4
→ Analyse de cause racine
→ Branche fix/ ou hotfix/
→ Correctif minimal et sûr
→ Test de non-régression
→ Pull Request
→ Preview Vercel
→ QA
→ Déploiement
→ Monitoring
→ Fermeture documentée
```

#### Sévérité

| Niveau | Signification | Exemple |
|---|---|---|
| P0 | Incident critique | Fuite de données, paiement faux, application indisponible |
| P1 | Fonction métier bloquée | Impossible de créer une commande ou d'enregistrer un paiement |
| P2 | Fonction dégradée | Recherche client ou facture inexacte |
| P3 | Bug mineur | Alignement, libellé ou comportement non bloquant |
| P4 | Amélioration | Optimisation ou nouvelle idée |

Tout bug P0 ou P1 doit produire une analyse de cause racine et un test de non-régression.

---

## 9. Prompt court obligatoire pour Claude Code

```text
Tu travailles sur Fildor, un SaaS mobile-first de gestion d'ateliers de couture africains.

Respecte strictement le fichier PROJECT_RULES.md et le design system Fildor.

Avant de coder :
1. Analyse la tâche et le code existant.
2. Propose un plan.
3. Liste les fichiers concernés.
4. Indique les impacts UI, données, sécurité, tests et documentation.
5. Attends validation si une décision métier importante est ambiguë.

Règles non négociables :
- TypeScript strict.
- Mobile-first, vérifié à 375 px.
- Français clair, sans jargon.
- Aucune logique métier sensible uniquement côté frontend.
- Toutes les données métier sont isolées par organization_id.
- RLS et permissions pour toute donnée connectée à Supabase.
- Montants en entiers et solde calculé côté serveur.
- Fichiers privés par défaut.
- Tests et états loading/empty/error/success obligatoires.
- Ne pas utiliser les éléments interdits de la matrice d'exclusion.

Interdictions design absolues : pas de dark mode à halos violets/cyans, pas de sphères 3D brillantes, pas d'étincelles à 4 branches, pas de texte en dégradé, pas de typewriter effect, pas de glassmorphism, pas de mockup isométrique flottant, pas de bento grids uniformes rounded-3xl, pas de bordures néon animées.
```

---

## 10. Checklist finale avant validation

### Produit

- [ ] La tâche sert une douleur réelle de l'atelier.
- [ ] La priorité est cohérente avec MVP, V1, V2 ou V3.
- [ ] Le parcours métier reste simple.
- [ ] L'utilisateur sait quelle est sa prochaine action.

### Design

- [ ] Mobile 375 px vérifié.
- [ ] Hiérarchie claire.
- [ ] Une action primaire maximum par section.
- [ ] États UX complets.
- [ ] Aucun élément de la matrice d'exclusion n'est présent.
- [ ] Couleurs, rayons, ombres, icônes et textes respectent le design system.

### Technique

- [ ] TypeScript strict sans contournement inutile.
- [ ] Validation Zod si entrée utilisateur.
- [ ] Permissions et RLS si données métier.
- [ ] Aucun secret exposé.
- [ ] Tests ajoutés ou adaptés.
- [ ] Pas de régression sur les parcours existants.

### Livraison

- [ ] Pull Request claire.
- [ ] Preview Vercel vérifiée.
- [ ] Tests réussis.
- [ ] Documentation mise à jour.
- [ ] Risques et limites signalés.
