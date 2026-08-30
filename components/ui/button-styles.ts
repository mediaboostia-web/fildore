/**
 * Styles partagés par `Button` (client) et `LinkButton` (utilisable côté
 * serveur).
 *
 * Ce fichier n'a **pas** de `"use client"`, et c'est délibéré : une fonction
 * exportée depuis un module client ne peut pas être appelée depuis un Server
 * Component — Next.js la transforme en référence client et le build échoue au
 * prérendu. Les constantes seules passaient ; `widthClass()` non.
 */

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger" | "whatsapp";

export type ButtonSize = "sm" | "md" | "lg";

/** Vert WhatsApp officiel — exception sanctionnée par PROJECT_RULES.md §4. */
export const WHATSAPP_GREEN = "#25D366";

/**
 * Variantes : finitions sobres avec micro-relief et retour tactile.
 * Une seule définition — les appels ne doivent pas les redéfinir par `className`,
 * sinon les boutons cessent de se ressembler d'un écran à l'autre.
 */
export const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-900 text-white shadow-sm shadow-primary-950/20 border border-primary-800/80 hover:bg-primary-800 hover:shadow-md hover:border-primary-700 active:bg-primary-950 active:scale-[0.98] disabled:bg-primary-100 disabled:text-text-subtle disabled:border-transparent disabled:shadow-none disabled:active:scale-100",
  secondary:
    "bg-surface text-text border border-border/90 shadow-xs hover:bg-surface-muted hover:text-primary-950 hover:border-border-strong active:bg-canvas active:scale-[0.98] disabled:text-text-subtle disabled:border-border disabled:shadow-none disabled:active:scale-100",
  tertiary:
    "bg-transparent text-primary-900 hover:bg-surface-muted hover:text-primary-950 active:bg-primary-50 active:scale-[0.98] disabled:text-text-subtle disabled:active:scale-100",
  danger:
    "bg-danger text-white shadow-sm shadow-danger/20 border border-danger/80 hover:brightness-95 hover:shadow-md active:brightness-90 active:scale-[0.98] disabled:bg-danger-bg disabled:text-text-subtle disabled:border-transparent disabled:shadow-none disabled:active:scale-100",
  whatsapp:
    "bg-[#25D366] text-white shadow-sm shadow-[#25D366]/20 border border-[#20ba5a] hover:brightness-95 hover:shadow-md active:brightness-90 active:scale-[0.98] disabled:bg-primary-100 disabled:text-text-subtle disabled:border-transparent disabled:shadow-none disabled:active:scale-100",
};

/** Toutes les tailles dépassent 40 px de haut : le pouce doit atteindre sa cible. */
export const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-xs font-semibold gap-2 [&_svg]:size-4",
  md: "h-11 px-5 text-sm font-semibold gap-2.5 [&_svg]:size-4",
  lg: "h-12 px-6 text-base font-semibold gap-3 [&_svg]:size-5",
};

/**
 * Largeur d'un bouton. `"mobile"` est le réglage attendu pour les actions
 * principales, les pieds de formulaire et les modales : sous 640 px le bouton
 * occupe toute la largeur (facile à viser au pouce), au-dessus il reprend sa
 * largeur naturelle. Les actions internes à une carte ou à une ligne de tableau
 * gardent `false`, sinon chaque carte s'allonge de plusieurs blocs empilés.
 */
export type ButtonWidth = boolean | "mobile";

export function widthClass(fullWidth: ButtonWidth): string | undefined {
  if (fullWidth === "mobile") return "w-full sm:w-auto";
  return fullWidth ? "w-full" : undefined;
}

/** Classes communes à `Button` et `LinkButton` — un seul jeu de règles de base. */
export const BUTTON_BASE_CLASSES = [
  "inline-flex items-center justify-center rounded-xl font-medium tracking-tight select-none",
  "transition-all duration-150 ease-out cursor-pointer",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
].join(" ");
