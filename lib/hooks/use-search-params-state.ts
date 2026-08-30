"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Recherche et filtres de liste : une seule implémentation pour les cinq listes
 * (commandes, clients, modèles, factures, paiements).
 *
 * Trois règles apprises des versions précédentes, à ne pas défaire :
 * 1. **Anti-rebond obligatoire.** La barre de recherche des commandes déclenchait
 *    un rendu serveur complet à CHAQUE caractère tapé — c'est ce qui donnait
 *    l'impression que l'application ramait.
 * 2. **Conserver les autres paramètres.** La barre client réécrivait l'URL
 *    entière, ce qui effaçait silencieusement le filtre en cours.
 * 3. **`scroll: false`.** Sans ça, la page remonte en haut à chaque frappe et le
 *    doigt perd la liste qu'il était en train de lire.
 */

const DEFAULT_DELAY_MS = 250;

/** Applique la mise à jour à l'URL courante sans toucher aux autres paramètres. */
function buildUrl(pathname: string, search: string, updates: Record<string, string | null>): string {
  const params = new URLSearchParams(search);
  for (const [name, value] of Object.entries(updates)) {
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export interface SearchParamInput {
  value: string;
  setValue: (next: string) => void;
  /** Vrai pendant que le rendu serveur de la liste est en cours. */
  isPending: boolean;
}

/**
 * Champ de recherche relié à un paramètre d'URL, avec anti-rebond.
 * `initialValue` vient du rendu serveur (`searchParams`), pas d'un état local.
 */
export function useSearchParamInput(
  paramName: string,
  initialValue: string,
  delayMs: number = DEFAULT_DELAY_MS
): SearchParamInput {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Au montage, l'URL porte déjà `initialValue` : ne pas la réécrire.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      // `window.location.search` est lu au moment où le délai expire, donc
      // toujours à jour — y compris si un filtre a changé entre-temps.
      const url = buildUrl(pathname, window.location.search, {
        [paramName]: value.trim() || null,
      });
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [value, paramName, delayMs, pathname, router]);

  return { value, setValue, isPending };
}

export interface SearchParamSetter {
  /** Lit la valeur courante d'un paramètre d'URL. */
  get: (name: string) => string;
  /** Écrit (ou efface avec `null`) un ou plusieurs paramètres, immédiatement. */
  set: (updates: Record<string, string | null>) => void;
  isPending: boolean;
}

/** Puces de filtre : mise à jour immédiate, sans anti-rebond. */
export function useSearchParamSetter(): SearchParamSetter {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const set = useCallback(
    (updates: Record<string, string | null>) => {
      const url = buildUrl(pathname, searchParams.toString(), updates);
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const get = useCallback((name: string) => searchParams.get(name) ?? "", [searchParams]);

  return { get, set, isPending };
}
