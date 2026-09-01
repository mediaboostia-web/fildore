import { test, expect, type Page } from "@playwright/test";

/**
 * Parcours complets ajoutés au MVP : créer des documents, modifier une commande
 * et annuler un paiement. Chacun couvre un chemin qui, avant ce lot, soit
 * n'existait pas, soit perdait silencieusement les données saisies.
 */

async function seConnecterCommeProprietaire(page: Page) {
  await page.goto("/connexion");
  await page.getByRole("button", { name: /Amina Chabi/ }).click();
  await expect(page).toHaveURL(/\/tableau-de-bord/);
}

/** Crée une commande via le wizard et renvoie l'URL de sa fiche. */
async function creerCommande(page: Page, titre: string, montant: string) {
  await page.goto("/commandes/nouveau/client");
  const premierClient = page.getByTestId(/client-select-/).first();
  await expect(premierClient).toBeVisible({ timeout: 15000 });
  await premierClient.click();
  await page.getByTestId("wizard-continuer").click();

  await expect(page).toHaveURL(/\/commandes\/nouveau\/details/);
  await page.getByPlaceholder(/Robe sirène/i).fill(titre);
  await page.getByRole("button", { name: /Continuer vers Mesures/i }).click();

  await expect(page).toHaveURL(/\/commandes\/nouveau\/mesures/);
  const versPrix = page.getByRole("button", { name: /Continuer vers Prix/i });
  await expect(versPrix).toBeEnabled({ timeout: 15000 });
  await versPrix.click();

  await expect(page).toHaveURL(/\/commandes\/nouveau\/prix/);
  await page.getByLabel(/Montant total/i).fill(montant);
  await page.getByRole("button", { name: /Continuer vers Vérification/i }).click();

  await expect(page).toHaveURL(/\/commandes\/nouveau\/verification/);
  await page.getByRole("button", { name: /Confirmer et créer la commande/i }).click();
  await expect(page).toHaveURL(/\/commandes\/order_/, { timeout: 15000 });

  return page.url();
}

test.describe("Cycle de vie d'une commande", () => {
  test.beforeEach(async ({ page }) => {
    await seConnecterCommeProprietaire(page);
  });

  test("l'étape Prix refuse un montant vide plutôt que d'inventer un tarif", async ({ page }) => {
    await page.goto("/commandes/nouveau/client");
    const premierClient = page.getByTestId(/client-select-/).first();
    await expect(premierClient).toBeVisible({ timeout: 15000 });
    await premierClient.click();
    await page.getByTestId("wizard-continuer").click();

    await page.getByPlaceholder(/Robe sirène/i).fill("Commande sans prix");
    await page.getByRole("button", { name: /Continuer vers Mesures/i }).click();

    const versPrix = page.getByRole("button", { name: /Continuer vers Prix/i });
    await expect(versPrix).toBeEnabled({ timeout: 15000 });
    await versPrix.click();

    await expect(page).toHaveURL(/\/commandes\/nouveau\/prix/);
    await page.getByRole("button", { name: /Continuer vers Vérification/i }).click();

    // On reste sur l'étape Prix, avec un message explicite.
    // (`getByRole("alert")` attraperait aussi l'annonceur de route de Next.js.)
    await expect(page).toHaveURL(/\/commandes\/nouveau\/prix/);
    await expect(page.getByText(/doit être supérieur à 0/i)).toBeVisible();
  });

  test("créer un devis puis un bon de livraison depuis la fiche commande", async ({ page }) => {
    await creerCommande(page, "Boubou test documents", "40000");

    // Une facture est déjà émise à la création de la commande.
    await expect(page.getByText(/Factures & Documents \(1\)/)).toBeVisible();

    await page.getByRole("button", { name: /Créer un document/i }).click();
    await Promise.all([
      page.waitForURL(/\/factures\//, { timeout: 15000 }),
      page.getByRole("menuitem", { name: "Devis" }).click(),
    ]);
    await expect(page.getByText(/DEV-\d{4}-\d{6}/).first()).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/commandes\/order_/);

    await page.getByRole("button", { name: /Créer un document/i }).click();
    await Promise.all([
      page.waitForURL(/\/factures\//, { timeout: 15000 }),
      page.getByRole("menuitem", { name: "Bon de livraison" }).click(),
    ]);
    await expect(page.getByText(/BL-\d{4}-\d{6}/).first()).toBeVisible();
  });

  test("une facture déjà émise ne peut pas être générée deux fois", async ({ page }) => {
    await creerCommande(page, "Robe test facture unique", "25000");

    await page.getByRole("button", { name: /Créer un document/i }).click();
    const entreeFacture = page.getByRole("menuitem", { name: /^Facture/ });
    await expect(entreeFacture).toBeVisible();
    // Grisée, et le motif est écrit à côté : pas de clic dans le vide.
    await expect(entreeFacture).toHaveAttribute("aria-disabled", "true");
    await expect(entreeFacture).toContainText("déjà émise");
  });

  test("modifier une commande enregistre vraiment le nouveau montant", async ({ page }) => {
    await creerCommande(page, "Costume test modification", "50000");

    // On passe par le lien de la fiche plutôt qu'un goto direct : c'est le
    // chemin réel de l'utilisateur, et cela évite une course de navigation.
    // `toHaveURL` sonde l'URL ; `waitForURL` attendrait un événement `load` qui
    // ne survient pas lors d'une navigation côté client de l'App Router.
    await page.getByRole("link", { name: /Modifier la commande/i }).click();
    await expect(page).toHaveURL(/\/modifier$/, { timeout: 15000 });

    await page.getByLabel(/Titre de la commande/i).fill("Costume trois pièces revu");
    await page.getByLabel(/^Montant total/i).fill("62000");
    await page.getByRole("button", { name: /Enregistrer les modifications/i }).click();

    await expect(page).toHaveURL(/\/commandes\/order_[^/]+$/, { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: /Costume trois pièces revu/i })
    ).toBeVisible();
    // Le montant doit avoir survécu au rechargement : c'est précisément ce qui
    // était perdu quand le formulaire écrivait dans une copie navigateur.
    await page.reload();
    await expect(page.getByText("62 000 FCFA").first()).toBeVisible({ timeout: 15000 });
  });

  test("annuler un paiement le retire du solde sans effacer sa trace", async ({ page }) => {
    await creerCommande(page, "Robe test annulation paiement", "30000");

    await page.getByRole("button", { name: /Encaisser un paiement/i }).click();
    await expect(page.getByText("Enregistrer un paiement")).toBeVisible();
    await page.getByRole("button", { name: /Valider le paiement/i }).click();

    await expect(page.getByText(/Règlements reçus \(1\)/)).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: /Annuler ce paiement/i }).click();
    await expect(page.getByRole("heading", { name: /Annuler ce paiement/i })).toBeVisible();
    await page.getByLabel(/Motif de l'annulation/i).fill("Montant saisi en double");
    await page.getByRole("button", { name: /Confirmer l'annulation/i }).click();

    // Plus aucun règlement compté…
    await expect(page.getByText(/Règlements reçus \(0\)/)).toBeVisible({ timeout: 15000 });
    // …mais la ligne et son motif restent visibles.
    await expect(page.getByText("Montant saisi en double")).toBeVisible();
  });
});
