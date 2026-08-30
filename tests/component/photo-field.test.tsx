import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhotoField, MAX_PHOTO_BYTES } from "@/components/ui/photo-field";

/**
 * jsdom ne décode pas d'image et n'a pas de canvas : on simule les deux briques
 * que le navigateur fournit, pour tester ce qui nous appartient — le
 * redimensionnement demandé, le plafond de poids et les messages d'erreur.
 */
class FakeImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  /** Format d'une photo prise au téléphone. */
  width = 3000;
  height = 4000;
  set src(_value: string) {
    queueMicrotask(() => this.onload?.());
  }
}

let drawnSize: { width: number; height: number } | null = null;
let encodedPhoto = "data:image/jpeg;base64,AAAA";

function photoFile(type = "image/jpeg"): File {
  return new File(["photo-brute"], "modele.jpg", { type });
}

beforeEach(() => {
  drawnSize = null;
  encodedPhoto = "data:image/jpeg;base64,AAAA";
  vi.stubGlobal("Image", FakeImage);

  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    drawImage: vi.fn(),
  })) as unknown as HTMLCanvasElement["getContext"];

  HTMLCanvasElement.prototype.toDataURL = vi.fn(function (this: HTMLCanvasElement) {
    drawnSize = { width: this.width, height: this.height };
    return encodedPhoto;
  }) as unknown as HTMLCanvasElement["toDataURL"];
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function fileInput(container: HTMLElement): HTMLInputElement {
  return container.querySelector('input[type="file"]') as HTMLInputElement;
}

describe("PhotoField", () => {
  it("ne propose aucune photo de banque d'images", () => {
    // Un atelier ne doit jamais voir dans son catalogue des photos qu'il n'a pas
    // prises : le formulaire en proposait quatre, dont une nommée « Pngtree ».
    render(<PhotoField value="" onChange={vi.fn()} />);

    expect(screen.getByText("Aucune photo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ajouter une photo/ })).toBeInTheDocument();
    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });

  it("redimensionne la photo à 1280 px sur son côté le plus long", async () => {
    const onChange = vi.fn();
    const { container } = render(<PhotoField value="" onChange={onChange} />);

    await userEvent.upload(fileInput(container), photoFile());

    await waitFor(() => expect(onChange).toHaveBeenCalledWith("data:image/jpeg;base64,AAAA"));
    // 3000 × 4000 → le plus long côté ramené à 1280, proportions gardées.
    expect(drawnSize).toEqual({ width: 960, height: 1280 });
  });

  it("refuse une photo qui reste trop lourde, au lieu de l'envoyer quand même", async () => {
    encodedPhoto = `data:image/jpeg;base64,${"A".repeat(MAX_PHOTO_BYTES)}`;
    const onChange = vi.fn();
    const { container } = render(<PhotoField value="" onChange={onChange} />);

    await userEvent.upload(fileInput(container), photoFile());

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/reste trop lourde/i)
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("refuse un fichier qui n'est pas une image, en français", async () => {
    const onChange = vi.fn();
    const { container } = render(<PhotoField value="" onChange={onChange} />);

    // `accept="image/*"` n'est qu'une suggestion : sur Android comme sur bureau,
    // « Tous les fichiers » laisse choisir un PDF. On passe donc par l'événement
    // brut, ce que `userEvent.upload` refuserait de simuler.
    fireEvent.change(fileInput(container), {
      target: { files: [new File(["%PDF"], "devis.pdf", { type: "application/pdf" })] },
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Choisissez une photo (JPG, PNG ou HEIC)."
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("affiche l'aperçu et permet de retirer la photo", async () => {
    const onChange = vi.fn();
    render(<PhotoField value="data:image/jpeg;base64,AAAA" onChange={onChange} />);

    expect(screen.getByAltText("Aperçu de la photo")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Retirer la photo/ }));
    expect(onChange).toHaveBeenCalledWith("");
  });
});
