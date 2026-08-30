"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Download, Link2, MessageCircle, Printer, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { RoleGate } from "@/components/shared/role-gate";
import { toast } from "@/components/ui/toast";
import {
  createDocumentShareLinkAction,
  revokeDocumentShareLinkAction,
} from "@/features/invoices/actions";
import { buildShareLinkPath } from "@/features/invoices/types";
import type { Role } from "@/features/auth/types";

export interface DocumentActionsProps {
  documentId: string;
  docNumber: string;
  workshopName: string;
  /** Numéro WhatsApp du client, déjà normalisé côté serveur. */
  clientPhone?: string;
  /** Jeton du lien public s'il est actif, sinon `null`. */
  shareToken: string | null;
  currentUserRole: Role | null | undefined;
}

/**
 * Actions d'un document : télécharger, imprimer, partager.
 *
 * « Partager » copiait auparavant l'adresse du tableau de bord : le client
 * recevait un lien qui le renvoyait vers l'écran de connexion. Le lien envoyé
 * ici est public, limité à ce document et révocable.
 */
export function DocumentActions({
  documentId,
  docNumber,
  workshopName,
  clientPhone,
  shareToken,
  currentUserRole,
}: DocumentActionsProps) {
  const router = useRouter();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const shareUrl =
    shareToken && typeof window !== "undefined"
      ? `${window.location.origin}${buildShareLinkPath(shareToken)}`
      : "";

  /**
   * Le navigateur produit le PDF : « Enregistrer en PDF » existe dans la boîte
   * d'impression d'Android, d'iOS et des navigateurs de bureau. Le titre du
   * document devient le nom du fichier proposé, d'où le renommage temporaire.
   */
  const handleDownload = () => {
    const previousTitle = document.title;
    document.title = docNumber;
    window.print();
    window.setTimeout(() => {
      document.title = previousTitle;
    }, 1000);
  };

  const openShare = () => {
    setIsShareOpen(true);
    if (shareToken) return;

    startTransition(async () => {
      const res = await createDocumentShareLinkAction({ documentId });
      if (res.success) {
        router.refresh();
        return;
      }
      toast.error(res.error ?? "Le lien de partage n'a pas pu être créé. Réessayez.");
      setIsShareOpen(false);
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Lien copié. Collez-le dans WhatsApp ou un SMS.");
    } catch {
      toast.error("Le lien n'a pas pu être copié. Sélectionnez-le à la main.");
    }
  };

  const handleWhatsApp = () => {
    const message = `Bonjour, voici votre document ${docNumber} de ${workshopName} :\n${shareUrl}`;
    const digits = clientPhone ? clientPhone.replace(/\D/g, "") : "";
    const url = digits
      ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleRevoke = () => {
    startTransition(async () => {
      const res = await revokeDocumentShareLinkAction({ documentId });
      if (res.success) {
        toast.success("Le lien a été désactivé. Il ne s'ouvre plus.");
        setIsShareOpen(false);
        router.refresh();
        return;
      }
      toast.error(res.error ?? "Le lien n'a pas pu être désactivé. Réessayez.");
    });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2 no-print sm:flex sm:flex-wrap sm:items-center">
        <RoleGate require="document:generer" role={currentUserRole}>
          <Button
            variant="whatsapp"
            size="sm"
            onClick={openShare}
            icon={<Link2 className="size-4" />}
          >
            Partager au client
          </Button>
        </RoleGate>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => window.print()}
          icon={<Printer className="size-4" />}
        >
          Imprimer
        </Button>

        <Button
          size="sm"
          className="col-span-2 sm:col-span-1"
          onClick={handleDownload}
          icon={<Download className="size-4" />}
        >
          Télécharger le PDF
        </Button>
      </div>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Partager {docNumber}</DialogTitle>
            <DialogDescription>
              Ce lien s&apos;ouvre sans compte. Votre client y voit uniquement ce document et peut
              le télécharger. Il ne donne accès à rien d&apos;autre de votre atelier.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-3">
            <div className="rounded-[var(--radius-md)] border border-border bg-surface-muted p-3">
              <p className="break-all font-mono text-xs text-text">
                {shareUrl || "Préparation du lien…"}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                fullWidth="mobile"
                disabled={!shareUrl || isPending}
                onClick={handleCopy}
                icon={<Copy className="size-4" />}
              >
                Copier le lien
              </Button>
              <Button
                variant="whatsapp"
                fullWidth="mobile"
                disabled={!shareUrl || isPending}
                onClick={handleWhatsApp}
                icon={<MessageCircle className="size-4" />}
              >
                Envoyer sur WhatsApp
              </Button>
            </div>

            {shareToken ? (
              <Button
                variant="tertiary"
                fullWidth
                disabled={isPending}
                onClick={() => setIsRevokeOpen(true)}
                icon={<ShieldOff className="size-4" />}
                className="text-text-muted hover:text-danger"
              >
                Désactiver ce lien
              </Button>
            ) : null}
          </DialogBody>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsShareOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isRevokeOpen}
        onOpenChange={setIsRevokeOpen}
        tone="danger"
        title="Désactiver ce lien ?"
        description="Le lien déjà envoyé cessera de fonctionner immédiatement. Le document, lui, reste dans votre atelier."
        confirmLabel="Désactiver le lien"
        cancelLabel="Garder le lien actif"
        onConfirm={handleRevoke}
      />
    </>
  );
}
