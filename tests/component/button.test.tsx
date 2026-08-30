import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("affiche son libellé", () => {
    render(<Button>Créer la commande</Button>);
    expect(screen.getByRole("button", { name: "Créer la commande" })).toBeInTheDocument();
  });

  it("déclenche onClick au clic", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Enregistrer un acompte</Button>);

    await user.click(screen.getByRole("button", { name: "Enregistrer un acompte" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("se désactive et ignore les clics pendant le chargement", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Enregistrer
      </Button>
    );

    const button = screen.getByRole("button", { name: "Enregistrer" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("respecte la prop disabled explicite", () => {
    render(<Button disabled>Indisponible</Button>);
    expect(screen.getByRole("button", { name: "Indisponible" })).toBeDisabled();
  });
});
