# Fildor

SaaS mobile-first de gestion pour ateliers de couture et stylistes africains. Centralise clients, mesures, commandes, production, paiements, factures, catalogue et communication WhatsApp.

Cette passe construit le **frontend Pré-MVP** : parcours complets et testables sans backend réel, avec des données mockées réalistes (atelier "Atelier Élégance", Cotonou). Le branchement Supabase (auth, base de données, RLS) viendra dans une passe ultérieure — voir `PROJECT_RULES.md` pour les règles de gouvernance du projet.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). La page d'accueil redirige vers `/connexion`, où vous pouvez vous connecter comme l'un des 5 utilisateurs de test de l'atelier (Owner, Manager, Couturière, Réception, Comptable).

`/styleguide` présente tous les composants du design system.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind CSS v4 · React Hook Form + Zod · Zustand · Radix UI · Vitest + Testing Library · Playwright.

## Scripts

```bash
npm run dev            # Serveur de développement
npm run build           # Build de production
npm run lint             # ESLint
npm run typecheck        # Vérification TypeScript
npm run test              # Tests unitaires
npm run test:component    # Tests de composants
npm run test:e2e          # Tests end-to-end (Playwright)
```

## Documents de référence

- `PROJECT_RULES.md` — règles de gouvernance, design system, ton, matrice d'exclusion stricte. Chargé automatiquement par Claude Code via `CLAUDE.md`.
- `AGENTS.md` — spécificités Next.js 16 pour les agents de code (pointe vers `node_modules/next/dist/docs/`).

## Données mockées

Aucune base de données réelle dans cette passe. Toutes les données vivent en mémoire (`lib/mock-data/`), réinitialisées au redémarrage du serveur.
