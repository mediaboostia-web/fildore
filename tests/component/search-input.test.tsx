import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "@/components/ui/search-input";

describe("SearchInput", () => {
  it("n'affiche aucune croix tant que le champ est vide", () => {
    render(<SearchInput value="" onChange={vi.fn()} label="Rechercher une commande" />);
    expect(screen.queryByRole("button", { name: /Effacer la recherche/i })).toBeNull();
  });

  it("n'affiche qu'UNE seule croix quand le champ est rempli", () => {
    // Le champ affichait deux croix : la nôtre et celle que Chrome dessine sur
    // `type="search"`. La règle CSS `::-webkit-search-cancel-button` masque la
    // native ; ce test vérifie qu'on n'en a jamais ajouté une seconde côté React.
    render(
      <SearchInput value="Adjoavi" onChange={vi.fn()} label="Rechercher une commande" />
    );

    const clearButtons = screen.getAllByRole("button", { name: /Effacer la recherche/i });
    expect(clearButtons).toHaveLength(1);
  });

  it("masque la croix native du navigateur", () => {
    const { container } = render(<SearchInput value="Adjoavi" onChange={vi.fn()} />);
    const input = container.querySelector("input")!;

    // La règle doit rester sur le champ : sans elle, la croix native revient.
    expect(input.className).toContain("[&::-webkit-search-cancel-button]:hidden");
  });

  it("vide le champ au clic sur la croix", async () => {
    const onChange = vi.fn();
    render(<SearchInput value="Adjoavi" onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: /Effacer la recherche/i }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("porte un libellé accessible même sans label visible", () => {
    render(<SearchInput value="" onChange={vi.fn()} label="Rechercher un client" />);
    expect(screen.getByLabelText("Rechercher un client")).toBeInTheDocument();
  });

  it("offre une cible tactile confortable pour la croix (44 px)", () => {
    // PROJECT_RULES §3 : cible minimale 44 × 44 px. La croix était à 24 px.
    render(<SearchInput value="Adjoavi" onChange={vi.fn()} />);
    const clear = screen.getByRole("button", { name: /Effacer la recherche/i });
    expect(clear.className).toContain("size-11");
  });
});
