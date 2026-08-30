# RÈGLES DE DÉVELOPPEMENT FILDOR (Antigravity & Claude Code)

Ce fichier applique l'ensemble des règles du **Document Directeur Fildor** et de `PROJECT_RULES.md`.

## 1. Principes Fondamentaux et Métier
- **Mission** : Fildor est le copilote opérationnel des couturiers, stylistes et ateliers de mode africains (Bénin, Togo, Côte d'Ivoire, Sénégal, etc.).
- **Objet central** : La Commande relie Client -> Mesures -> Modèle -> Tissu -> Paiement -> Production -> Messages WhatsApp -> Facture -> Livraison -> Solde.
- **Mobile-first absolu** : Toute interface est d'abord conçue et validée pour une largeur de 360-390px (cible 375px) avec zones tactiles >= 44x44px.
- **Devise & Monnaie** : Montants entiers uniquement (XOF/FCFA), jamais de float. Calcul de solde centralisé via `computeBalance()` dans `lib/money/balance.ts`.
- **Téléphone & WhatsApp** : Normalisation béninoise/internationale (`+229...`) et liens `https://wa.me/...`.
- **Langue & Ton** : Français simple, chaleureux, orienté action et sans jargon technique (ex: « Solde restant », « Commande prête », « Enregistrer un acompte »).

## 2. Architecture & Code
- **Next.js App Router** : Pages fines dans `app/`, composants UI réutilisables dans `components/ui/`, composants de layout dans `components/layout/`.
- **Features modulaires** : Toute la logique métier (schémas Zod, actions serveur, types, sélecteurs, composants métier) est groupée dans `features/<module>/`.
- **Mock Data (Pré-MVP)** : Repository pattern avec singleton mémoire `globalThis.__FILDOR_DB__` dans `lib/mock-data/store.ts`. Accès asynchrones réalistes.
- **Sécurité Multi-Tenant** : Toute donnée métier est liée à un `organization_id` / `workshopId`. Aucune fuite d'information entre ateliers.
- **Gestion des états** : Les 4 états UX (`loading` avec Skeleton, `empty` avec action, `error` explicite avec réessai, `success`) doivent être gérés sur chaque vue.

## 3. Matrice d'Exclusion Stricte (DO NOT USE)
- INTERDIT : Arrière-plans sombres à halos néon / violets / cyans.
- INTERDIT : Sphères 3D brillantes ou objets flottants décoratifs.
- INTERDIT : Icônes étincelles ✨ / ✦ (utiliser des icônes Lucide métier : ciseaux, mètre, aiguille, document, argent).
- INTERDIT : Titres en dégradés ou effets machine à écrire.
- INTERDIT : Glassmorphism / backdrop-blur transparent givré générique.
- INTERDIT : Mockups 3D isométriques flottants ou Bento grids rounded-3xl décoratives.
- OBLIGATOIRE : Fonds neutres chauds (canvas `#FBF7F2`, surface `#FFFFFF`), primaire brun cacao (`#855A2E`) ou vert profond, accent terracotta (`#DD7A46`), typographie lisible.

## 4. Tests et Qualité
- TypeScript strict, aucun `any`.
- Tests unitaires (Vitest) pour tous les calculs monétaires, sélecteurs et normalisations.
- Tests E2E (Playwright) pour les parcours critiques (connexion, client, mesures, commande wizard, acompte, solde).
