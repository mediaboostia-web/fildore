import { create } from "zustand";
import type { OrderFormValues } from "./schemas";

/**
 * Brouillon du wizard de création de commande (5 étapes : client, détails,
 * mesures, prix, vérification). Synchronisé avec sessionStorage de façon synchrone
 * pour une réactivité instantanée et une préservation parfaite entre étapes.
 */
interface OrderWizardState {
  draft: Partial<OrderFormValues>;
  setStepData: (data: Partial<OrderFormValues>) => void;
  reset: () => void;
}

function loadInitialDraft(): Partial<OrderFormValues> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem("fildor-order-wizard-draft");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const useOrderWizardStore = create<OrderWizardState>((set) => ({
  draft: loadInitialDraft(),
  setStepData: (data) =>
    set((state) => {
      const nextDraft = { ...state.draft, ...data };
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("fildor-order-wizard-draft", JSON.stringify(nextDraft));
        } catch {}
      }
      return { draft: nextDraft };
    }),
  reset: () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("fildor-order-wizard-draft");
      } catch {}
    }
    set({ draft: {} });
  },
}));
