"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Le seul bouton de la page publique.
 *
 * Le PDF est produit par le navigateur : « Enregistrer en PDF » existe dans la
 * boîte d'impression d'Android, d'iOS et des navigateurs de bureau. Le titre de
 * la page devient le nom du fichier proposé, d'où le renommage temporaire.
 */
export function PublicDocumentDownload({ docNumber }: { docNumber: string }) {
  const handleDownload = () => {
    const previousTitle = document.title;
    document.title = docNumber;
    window.print();
    window.setTimeout(() => {
      document.title = previousTitle;
    }, 1000);
  };

  return (
    <Button fullWidth="mobile" onClick={handleDownload} icon={<Download className="size-4" />}>
      Télécharger mon document
    </Button>
  );
}
