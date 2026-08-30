"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SearchInput } from "@/components/ui/search-input";

const DEBOUNCE_MS = 300;

export interface ClientSearchBarProps {
  /** Valeur initiale — reflète le `?q=` déjà présent dans l'URL (rendu serveur). */
  defaultValue: string;
}

/**
 * Barre de recherche client (nom ou téléphone) : met à jour `?q=` dans l'URL,
 * ce qui déclenche un nouveau rendu serveur de `ClientsPage` via `searchClients`
 * — pas de filtrage côté client, une seule source de vérité pour la recherche.
 */
export function ClientSearchBar({ defaultValue }: ClientSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(defaultValue);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      const query = value.trim();
      router.replace(query ? `${pathname}?q=${encodeURIComponent(query)}` : pathname);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ne réagit qu'à `value`, pas à `router`/`pathname`
  }, [value]);

  return (
    <SearchInput
      value={value}
      onChange={setValue}
      label="Rechercher un client"
      placeholder="Nom ou numéro de téléphone"
    />
  );
}
