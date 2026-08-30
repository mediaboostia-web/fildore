import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CurrencyInput, formatThousands, formatXof } from "@/components/ui/currency-input";

/** CurrencyInput est entièrement contrôlé : ce wrapper reboucle value/onChange comme en usage réel. */
function ControlledCurrencyInput({ onChangeSpy }: { onChangeSpy: (value: number) => void }) {
  const [value, setValue] = useState(0);
  return (
    <CurrencyInput
      value={value}
      label="Montant"
      onChange={(next) => {
        setValue(next);
        onChangeSpy(next);
      }}
    />
  );
}

describe("formatThousands / formatXof", () => {
  it("insère un espace comme séparateur de milliers", () => {
    expect(formatThousands(35000)).toBe("35 000");
    expect(formatThousands(1250000)).toBe("1 250 000");
    expect(formatThousands(0)).toBe("0");
  });

  it("affiche le format local avec devise", () => {
    expect(formatXof(35000)).toBe("35 000 FCFA");
  });
});

describe("CurrencyInput", () => {
  it("affiche le montant formaté avec séparateur de milliers", () => {
    render(<CurrencyInput value={35000} onChange={vi.fn()} label="Montant total" />);
    expect(screen.getByLabelText("Montant total")).toHaveValue("35 000");
  });

  it("ignore toute virgule ou point saisi — parse toujours en entier, jamais parseFloat", async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();
    render(<ControlledCurrencyInput onChangeSpy={onChangeSpy} />);

    const input = screen.getByLabelText("Montant");
    await user.type(input, "12,50");

    // La virgule est filtrée à chaque frappe : seuls les chiffres "1250" sont
    // retenus, jamais un nombre décimal du type 12.5.
    for (const call of onChangeSpy.mock.calls) {
      expect(Number.isInteger(call[0])).toBe(true);
    }
    expect(onChangeSpy.mock.calls.at(-1)?.[0]).toBe(1250);
    expect(input).toHaveValue("1 250");
  });

  it("affiche un champ vide plutôt que 0 tant qu'aucun chiffre n'est saisi", () => {
    render(<CurrencyInput value={0} onChange={vi.fn()} label="Acompte" />);
    expect(screen.getByLabelText("Acompte")).toHaveValue("");
  });
});
