import { test, expect } from "@playwright/test";

test("un visiteur non connecté est redirigé vers la connexion", async ({ page }) => {
  await page.goto("/tableau-de-bord");
  await expect(page).toHaveURL(/\/connexion/);
});

test("se connecter comme Amina donne accès au tableau de bord", async ({ page }) => {
  await page.goto("/connexion");
  // « Amina Chabi » figure aussi dans le témoignage de la colonne de droite :
  // on vise le bouton d'accès rapide, pas le texte brut.
  const accesRapideAmina = page.getByRole("button", { name: /Amina Chabi/ });
  await expect(accesRapideAmina).toBeVisible();

  await accesRapideAmina.click();

  // Délai large : en `next dev`, la première visite du tableau de bord le
  // compile à la demande. C'est du temps de compilation, pas de la lenteur
  // applicative — en production la page est déjà construite.
  await expect(page).toHaveURL(/\/tableau-de-bord/, { timeout: 30000 });
  await expect(page.getByText("Bienvenue, Amina.")).toBeVisible({ timeout: 15000 });
});

test("se déconnecter ramène à la page de connexion", async ({ page }) => {
  await page.goto("/connexion");
  await page.getByRole("button", { name: /Amina Chabi/ }).click();
  await expect(page).toHaveURL(/\/tableau-de-bord/);

  await page.getByRole("button", { name: /Amina Chabi/ }).click();
  // « Se déconnecter » existe aussi en bas de la barre latérale : on cible
  // explicitement l'entrée du menu utilisateur qu'on vient d'ouvrir.
  await page.getByRole("menuitem", { name: "Se déconnecter" }).click();

  await expect(page).toHaveURL(/\/connexion/);
});
