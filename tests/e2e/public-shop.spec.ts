import { test, expect, type Page } from "@playwright/test";

/**
 * Vitrine publique → demande → acceptation → commande.
 *
 * Règle métier vérifiée de bout en bout : **une demande n'est jamais une
 * commande**. Tant que l'atelier ne l'a pas acceptée, elle ne crée ni fiche
 * client, ni commande. C'est l'atelier qui décide, et qui fixe le prix.
 */

/** Numéro unique par exécution : la limite anti-robot est de 3 demandes / 24 h. */
function uniquePhone(): string {
  const suffix = String(Math.floor(1000000 + Math.random() * 8999999));
  return `+22997${suffix}`;
}

async function signIn(page: Page) {
  await page.goto("/connexion");
  await page.getByRole("button", { name: /Amina Chabi/ }).click();
  await expect(page).toHaveURL(/\/tableau-de-bord/, { timeout: 15000 });
}

/** Ouvre la page publique de l'atelier. `check()` est idempotent : rejouable. */
async function openOnlineOrdering(page: Page) {
  await page.goto("/parametres");
  const toggle = page.getByRole("checkbox", { name: /Ouvrir mes commandes en ligne/ });
  await expect(toggle).toBeVisible({ timeout: 15000 });
  await toggle.check();
  await page.getByRole("button", { name: "Enregistrer ces règles" }).click();
  await expect(page.getByText("Vos commandes en ligne sont ouvertes")).toBeVisible({
    timeout: 15000,
  });
}

test.describe("Boutique publique et demandes en ligne", () => {
  test("un visiteur commande sans compte, l'atelier accepte, la commande existe", async ({
    page,
    browser,
  }) => {
    await signIn(page);
    await openOnlineOrdering(page);
    const origin = new URL(page.url()).origin;

    // --- Côté visiteur : aucun compte, aucune session ---
    const visitorContext = await browser.newContext({ baseURL: origin });
    const visitor = await visitorContext.newPage();
    await visitor.goto("/atelier/atelier-elegance");

    await expect(
      visitor.getByRole("heading", { name: "Commandez votre tenue sur mesure" })
    ).toBeVisible({ timeout: 15000 });
    // La vitrine ne montre que le catalogue : aucun client, aucune commande.
    await expect(visitor.getByText(/Adjoavi/)).toHaveCount(0);

    await visitor.getByRole("link", { name: "Demander ce modèle" }).first().click();
    await expect(visitor).toHaveURL(/\/commander\?modele=/, { timeout: 15000 });

    const phone = uniquePhone();
    await visitor.getByRole("textbox", { name: /Prénom/ }).fill("Christiane");
    await visitor.getByRole("textbox", { name: /^Nom/ }).fill("Dossou");
    await visitor.getByRole("textbox", { name: /Téléphone WhatsApp/ }).fill(phone);
    await visitor.getByRole("textbox", { name: /Ville/ }).fill("Cotonou");
    await visitor.getByRole("textbox", { name: /Votre message/ }).fill(
      "Tissu wax bleu, pour un baptême."
    );
    await visitor.getByRole("button", { name: "Envoyer ma demande" }).click();

    await expect(visitor).toHaveURL(/\/commander\/merci/, { timeout: 15000 });
    await visitorContext.close();

    // --- Côté atelier : la demande arrive, et n'est encore rien d'autre ---
    await page.goto(`/demandes?q=${encodeURIComponent(phone)}`);
    await expect(page.getByText("Christiane Dossou").first()).toBeVisible({ timeout: 15000 });

    const href = await page
      .getByRole("link", { name: /Christiane Dossou/ })
      .first()
      .getAttribute("href");
    expect(href).toMatch(/^\/demandes\/demande_/);
    await page.goto(href!);

    await expect(page.getByRole("heading", { name: "Christiane Dossou" })).toBeVisible();
    await expect(page.getByText("À traiter")).toBeVisible();
    await expect(page.getByText("Tissu wax bleu, pour un baptême.")).toBeVisible();

    // --- Acceptation : c'est là, et seulement là, que la commande naît ---
    await page.getByRole("button", { name: "Accepter et créer la commande" }).click();
    await expect(page).toHaveURL(/\/commandes\/order_/, { timeout: 20000 });
    await expect(page.getByText(/FIL-CTN-/).first()).toBeVisible();
    await expect(page.getByText("Christiane Dossou").first()).toBeVisible();

    // La fiche client existe désormais, avec le numéro donné en ligne.
    await page.goto(`/clients?q=${encodeURIComponent(phone)}`);
    await expect(page.getByText("Christiane Dossou").first()).toBeVisible({ timeout: 15000 });
  });

  test("refuser une demande ne crée ni client ni commande", async ({ page, browser }) => {
    await signIn(page);
    await openOnlineOrdering(page);
    const origin = new URL(page.url()).origin;

    const visitorContext = await browser.newContext({ baseURL: origin });
    const visitor = await visitorContext.newPage();
    await visitor.goto("/atelier/atelier-elegance/commander");

    const phone = uniquePhone();
    await visitor.getByRole("textbox", { name: /Prénom/ }).fill("Sylvain");
    await visitor.getByRole("textbox", { name: /^Nom/ }).fill("Agbodjan");
    await visitor.getByRole("textbox", { name: /Téléphone WhatsApp/ }).fill(phone);
    await visitor.getByRole("textbox", { name: /Ville/ }).fill("Porto-Novo");
    await visitor.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(visitor).toHaveURL(/\/commander\/merci/, { timeout: 15000 });
    await visitorContext.close();

    await page.goto(`/demandes?q=${encodeURIComponent(phone)}`);
    const href = await page
      .getByRole("link", { name: /Sylvain Agbodjan/ })
      .first()
      .getAttribute("href");
    await page.goto(href!);

    await page.getByRole("button", { name: "Refuser", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Refuser cette demande ?" })).toBeVisible();
    await page
      .getByRole("textbox", { name: /Motif du refus/ })
      .fill("Délai trop court pour cette période.");
    await page.getByRole("button", { name: "Refuser la demande" }).click();

    await expect(page.getByText(/Aucun client ni commande n'a été créé/)).toBeVisible({
      timeout: 15000,
    });

    // Le fichier client reste propre.
    await page.goto(`/clients?q=${encodeURIComponent(phone)}`);
    await expect(page.getByText("Sylvain Agbodjan")).toHaveCount(0);
  });

  test("commandes fermées : la page publique le dit, sans catalogue", async ({
    page,
    browser,
  }) => {
    await signIn(page);
    await page.goto("/parametres");
    const toggle = page.getByRole("checkbox", { name: /Ouvrir mes commandes en ligne/ });
    await expect(toggle).toBeVisible({ timeout: 15000 });
    await toggle.uncheck();
    await page.getByRole("button", { name: "Enregistrer ces règles" }).click();
    await expect(page.getByText("Vos commandes en ligne sont fermées")).toBeVisible({
      timeout: 15000,
    });

    const origin = new URL(page.url()).origin;
    const visitorContext = await browser.newContext({ baseURL: origin });
    const visitor = await visitorContext.newPage();
    await visitor.goto("/atelier/atelier-elegance");

    await expect(
      visitor.getByRole("heading", { name: "Commandes en ligne fermées" })
    ).toBeVisible({ timeout: 15000 });
    await expect(visitor.getByRole("link", { name: "Demander ce modèle" })).toHaveCount(0);

    await visitorContext.close();
  });
});
