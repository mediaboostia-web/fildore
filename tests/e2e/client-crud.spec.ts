import { test, expect } from "@playwright/test";

test.describe("Gestion des clients", () => {
  test.beforeEach(async ({ page }) => {
    // Connexion en tant qu'Amina
    await page.goto("/connexion");
    await page.getByRole("button", { name: /Amina Chabi/ }).click();
    await expect(page).toHaveURL(/\/tableau-de-bord/, { timeout: 15000 });
  });

  test("accéder à la liste des clients et rechercher un client", async ({ page }) => {
    await page.goto("/clients");
    await expect(page.getByRole("heading", { name: "Clients" })).toBeVisible();

    // Recherche d'un client existant
    const searchInput = page.getByPlaceholder("Nom, numéro, ville ou quartier");
    await searchInput.fill("Adjoavi");

    // Vérifie que le client recherché est présent dans la page
    await expect(page.locator('text=Adjoavi').first()).toBeAttached();
  });

  test("créer un nouveau client béninois", async ({ page }) => {
    await page.goto("/clients/nouveau");
    await expect(page.getByRole("heading", { name: /Nouveau client/i })).toBeVisible();

    await page.getByRole("textbox", { name: /Prénom/i }).fill("Gérard");
    await page.getByRole("textbox", { name: "Nom *", exact: true }).fill("Hounsou");
    const randomPhone = `97${Math.floor(100000 + Math.random() * 900000)}`;
    await page.getByPlaceholder("90 00 00 00").fill(randomPhone);
    await page.getByRole("textbox", { name: /Ville/i }).fill("Cotonou");
    await page.getByRole("textbox", { name: /Quartier/i }).fill("Cadjèhoun");

    await page.getByRole("button", { name: "Créer le client" }).click();

    // Redirection vers la fiche client
    await expect(page).toHaveURL(/\/clients\/client_/, { timeout: 15000 });
    await expect(page.getByText("Gérard Hounsou").first()).toBeVisible();
  });
});
