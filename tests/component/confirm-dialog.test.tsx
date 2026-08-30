import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DialogFooter } from "@/components/ui/dialog";

describe("DialogFooter", () => {
  it("étire ses boutons sous 640 px et les remet à leur largeur au-dessus", () => {
    // PROJECT_RULES §3 : au pouce, le bouton d'une modale doit être facile à
    // viser. jsdom n'applique pas les media queries de Tailwind ; on vérifie la
    // règle elle-même, qui est ce qu'on risque de supprimer par mégarde.
    const { container } = render(<DialogFooter>contenu</DialogFooter>);
    const footer = container.firstElementChild as HTMLElement;

    expect(footer.className).toContain("[&>*]:w-full");
    expect(footer.className).toContain("sm:[&>*]:w-auto");
  });

  it("place l'action de confirmation en haut de la pile sur mobile", () => {
    const { container } = render(<DialogFooter>contenu</DialogFooter>);
    const footer = container.firstElementChild as HTMLElement;
    expect(footer.className).toContain("flex-col-reverse");
  });
});

describe("ConfirmDialog", () => {
  it("remplace l'alerte du navigateur par une modale lisible", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        open
        onOpenChange={vi.fn()}
        tone="danger"
        title="Abandonner la saisie ?"
        description="Les informations saisies ne seront pas enregistrées."
        confirmLabel="Abandonner"
        cancelLabel="Continuer la saisie"
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByRole("heading", { name: "Abandonner la saisie ?" })).toBeInTheDocument();
    expect(
      screen.getByText("Les informations saisies ne seront pas enregistrées.")
    ).toBeInTheDocument();

    // Les deux issues sont nommées par leur conséquence, jamais « OK / Annuler ».
    expect(screen.getByRole("button", { name: "Continuer la saisie" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Abandonner" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("ferme sans rien faire quand on choisit de rester", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Abandonner cette commande ?"
        confirmLabel="Abandonner"
        cancelLabel="Continuer la saisie"
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByRole("button", { name: "Continuer la saisie" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
