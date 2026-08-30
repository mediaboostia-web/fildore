import { test, expect } from "@playwright/test";

test("un visiteur non connecté est redirigé vers la connexion", async ({ page }) => {
  await page.goto("/tableau-de-bord");
  await expect(page).toHaveURL(/\/connexion/);
});

test("se connecter comme Amina donne accès au tableau de bord", async ({ page }) => {
  await page.goto("/connexion");
  await expect(page.getByText("Amina Chabi")).toBeVisible();

  await page.getByRole("button", { name: /Amina Chabi/ }).click();

  await expect(page).toHaveURL(/\/tableau-de-bord/);
  await expect(page.getByText("Bienvenue, Amina.")).toBeVisible();
});

test("se déconnecter ramène à la page de connexion", async ({ page }) => {
  await page.goto("/connexion");
  await page.getByRole("button", { name: /Amina Chabi/ }).click();
  await expect(page).toHaveURL(/\/tableau-de-bord/);

  await page.getByRole("button", { name: /Amina Chabi/ }).click();
  await page.getByText("Se déconnecter").click();

  await expect(page).toHaveURL(/\/connexion/);
});
