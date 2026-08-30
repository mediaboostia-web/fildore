import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  // Le backend mock (`lib/mock-data/store.ts`) est un singleton en mémoire
  // partagé par TOUTE requête serveur, quel que soit l'onglet/test qui
  // l'appelle (voir le commentaire `globalThis.__FILDOR_DB__` du fichier).
  // Des specs exécutées en parallèle mutent donc les mêmes données
  // (compteurs de séquence, listes) et se rendent flaky l'une l'autre.
  // Exécution strictement séquentielle tant qu'il n'y a pas de vrai backend
  // isolé par test (Supabase + transaction de test, prévu pour plus tard).
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "mobile-375",
      use: { ...devices["Pixel 5"], viewport: { width: 375, height: 812 } },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
