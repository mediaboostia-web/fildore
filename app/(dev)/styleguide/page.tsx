"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Printer,
  Download,
  ClipboardList,
  Scissors,
  Package,
  Truck,
  Banknote,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { CurrencyInput, formatXof } from "@/components/ui/currency-input";
import { DatePicker } from "@/components/ui/date-picker";
import { Select } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, ORDER_STATUS_ORDER, type OrderStatus } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, type DataTableColumn } from "@/components/ui/table";
import { MobileCardList } from "@/components/ui/mobile-card-list";
import { SearchInput } from "@/components/ui/search-input";
import { FilterBar, type FilterChip } from "@/components/ui/filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { Stepper } from "@/components/ui/stepper";
import { Timeline } from "@/components/ui/timeline";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DocumentPreview } from "@/components/ui/document-preview";
import { OrderStatusSelector } from "@/components/ui/order-status-selector";
import { PaymentSummary } from "@/components/ui/payment-summary";
import { WhatsAppMessagePreview } from "@/components/ui/whatsapp-message-preview";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { RoleGate } from "@/components/shared/role-gate";
import type { Role } from "@/features/auth/types";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8 first:border-t-0 first:pt-0">
      <div>
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        {description ? <p className="mt-0.5 text-sm text-text-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function SubLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-subtle">{children}</p>;
}

// --- Données de démonstration (noms et montants béninois réalistes) ---------

interface DemoOrder {
  id: string;
  reference: string;
  client: string;
  status: OrderStatus;
  delivery: string;
  total: number;
  balance: number;
}

const DEMO_ORDERS: DemoOrder[] = [
  { id: "1", reference: "CMD-0142", client: "Adjoa Koudjo", status: "couture", delivery: "02/09/2026", total: 65000, balance: 20000 },
  { id: "2", reference: "CMD-0143", client: "Fabrice Houngbo", status: "acompte_attendu", delivery: "05/09/2026", total: 120000, balance: 120000 },
  { id: "3", reference: "CMD-0144", client: "Amivi Sossou", status: "prete", delivery: "30/08/2026", total: 45000, balance: 0 },
  { id: "4", reference: "CMD-0145", client: "Rachidatou Alassane", status: "essayage", delivery: "03/09/2026", total: 98000, balance: 38000 },
  { id: "5", reference: "CMD-0146", client: "Bienvenu Adjovi", status: "annulee", delivery: "01/09/2026", total: 52000, balance: 52000 },
];

const ORDER_COLUMNS: DataTableColumn<DemoOrder>[] = [
  { key: "client", label: "Client", emphasis: true, render: (o) => o.client },
  { key: "reference", label: "Référence", render: (o) => o.reference },
  { key: "status", label: "Statut", render: (o) => <StatusBadge status={o.status} /> },
  { key: "delivery", label: "Livraison", render: (o) => o.delivery },
  { key: "total", label: "Total", render: (o) => formatXof(o.total) },
  {
    key: "balance",
    label: "Solde",
    render: (o) => (
      <span className={o.balance > 0 ? "font-medium text-danger" : "font-medium text-success"}>
        {formatXof(o.balance)}
      </span>
    ),
  },
];

const DEMO_CLIENTS = [
  { value: "adjoa-koudjo", label: "Adjoa Koudjo", description: "+229 90 01 02 03" },
  { value: "fabrice-houngbo", label: "Fabrice Houngbo", description: "+229 96 11 22 33" },
  { value: "amivi-sossou", label: "Amivi Sossou", description: "+229 97 44 55 66" },
  { value: "rachidatou-alassane", label: "Rachidatou Alassane", description: "+229 61 77 88 99" },
  { value: "bienvenu-adjovi", label: "Bienvenu Adjovi", description: "+229 95 22 11 00" },
  { value: "chimene-zannou", label: "Chimène Zannou", description: "+229 66 33 44 55" },
];

export default function StyleguidePage() {
  // --- États locaux de démonstration ---------------------------------------
  const [textValue, setTextValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("90010203");
  const [countryCode, setCountryCode] = useState("+229");
  const [amount, setAmount] = useState(35000);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [fabricType, setFabricType] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterChip[]>([
    { key: "en_cours", label: "En cours", active: true },
    { key: "en_retard", label: "En retard", active: false },
    { key: "a_livrer", label: "À livrer cette semaine", active: false },
  ]);
  const [page, setPage] = useState(1);

  const [demoStatus, setDemoStatus] = useState<OrderStatus>("couture");
  const [demoRole, setDemoRole] = useState<Role>("owner");
  const [whatsappMessage, setWhatsappMessage] = useState(
    "Bonjour Adjoa, votre commande CMD-0142 est prête. Vous pouvez passer la récupérer à l'atelier. Solde restant : 20 000 FCFA."
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8 sm:px-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-accent-600">Page de développement</p>
        <h1 className="text-2xl font-semibold text-text">Design system Fildor</h1>
        <p className="mt-1 max-w-2xl text-sm text-text-muted">
          Revue visuelle de tous les composants génériques et du layout applicatif. Cette page sera
          retirée avant la mise en production.
        </p>
      </div>

      {/* --- Couleurs ---------------------------------------------------- */}
      <Section title="Palette" description="Tokens définis dans app/globals.css — jamais de hex en dur dans les composants.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {[
            { label: "primary-900", className: "bg-primary-900" },
            { label: "primary-100", className: "bg-primary-100" },
            { label: "accent-600", className: "bg-accent-600" },
            { label: "accent-100", className: "bg-accent-100" },
            { label: "success", className: "bg-success" },
            { label: "warning", className: "bg-warning" },
            { label: "danger", className: "bg-danger" },
            { label: "info", className: "bg-info" },
            { label: "background", className: "bg-background border border-border" },
            { label: "surface", className: "bg-surface border border-border" },
            { label: "surface-muted", className: "bg-surface-muted border border-border" },
            { label: "border-strong", className: "bg-border-strong" },
          ].map((swatch) => (
            <div key={swatch.label} className="flex flex-col gap-1.5">
              <div className={`h-14 rounded-[var(--radius-md)] ${swatch.className}`} />
              <span className="text-xs text-text-muted">{swatch.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* --- Boutons ------------------------------------------------------ */}
      <Section title="Boutons" description="Un seul bouton primaire dominant par vue ou section.">
        <div>
          <SubLabel>Variantes</SubLabel>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Créer la commande</Button>
            <Button variant="secondary">Enregistrer comme brouillon</Button>
            <Button variant="tertiary">Annuler</Button>
            <Button variant="danger">Supprimer la commande</Button>
            <Button variant="whatsapp" icon={<Package className="size-4" />}>
              Contacter sur WhatsApp
            </Button>
          </div>
        </div>
        <div>
          <SubLabel>Tailles &amp; états</SubLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Petit</Button>
            <Button size="md">Moyen</Button>
            <Button size="lg">Grand</Button>
            <Button isLoading>Enregistrement…</Button>
            <Button disabled>Indisponible</Button>
            <Button fullWidth className="sm:max-w-56">
              Pleine largeur
            </Button>
          </div>
        </div>
        <div>
          <SubLabel>Boutons icône</SubLabel>
          <div className="flex flex-wrap gap-3">
            <IconButton icon={<Pencil className="size-4" />} label="Modifier" variant="secondary" />
            <IconButton icon={<Trash2 className="size-4" />} label="Supprimer" variant="danger" />
            <IconButton icon={<Eye className="size-4" />} label="Aperçu" />
            <IconButton icon={<Printer className="size-4" />} label="Imprimer" isLoading />
          </div>
        </div>
      </Section>

      {/* --- Formulaires ---------------------------------------------------- */}
      <Section title="Champs de formulaire" description="Label toujours visible, erreurs rattachées au champ.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Nom du client"
            placeholder="Ex. Adjoa Koudjo"
            value={textValue}
            onChange={(event) => setTextValue(event.target.value)}
            required
          />
          <Input label="Référence commande" placeholder="CMD-0147" hint="Générée automatiquement si laissée vide" />
          <Input label="Champ en erreur" defaultValue="12" error="Merci de saisir un numéro valide à 8 chiffres." />
          <PhoneInput
            countryCode={countryCode}
            onCountryCodeChange={setCountryCode}
            number={phoneNumber}
            onNumberChange={setPhoneNumber}
          />
          <CurrencyInput label="Montant total" value={amount} onChange={setAmount} required />
          <DatePicker label="Date de livraison" value={deliveryDate} onChange={setDeliveryDate} required />
          <Select
            label="Tissu fourni par"
            placeholder="Choisir une option"
            options={[
              { value: "client", label: "Le client" },
              { value: "atelier", label: "L'atelier" },
            ]}
            value={fabricType}
            onChange={(event) => setFabricType(event.target.value)}
          />
          <Combobox
            label="Client"
            placeholder="Rechercher un client…"
            options={DEMO_CLIENTS}
            value={selectedClient}
            onChange={setSelectedClient}
          />
        </div>
        <Textarea
          label="Notes internes d'atelier"
          placeholder="Ex. Client préfère être livré après 17h."
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <FileUpload files={files} onFilesChange={setFiles} label="Preuves de paiement" />
          <ImageUploader images={images} onImagesChange={setImages} label="Photos du modèle" />
        </div>
      </Section>

      {/* --- Cartes, badges, avatars ---------------------------------------- */}
      <Section title="Cartes, badges et statuts">
        <div>
          <SubLabel>Statuts de commande (15) — mapping couleur PROJECT_RULES.md §4</SubLabel>
          <div className="flex flex-wrap gap-2">
            {ORDER_STATUS_ORDER.map((status) => (
              <StatusBadge key={status} status={status} />
            ))}
            <StatusBadge status="suspendue" />
            <StatusBadge status="annulee" />
          </div>
        </div>
        <div>
          <SubLabel>Badges génériques</SubLabel>
          <div className="flex flex-wrap gap-2">
            <Badge tone="success">Payée</Badge>
            <Badge tone="warning">Bientôt dû</Badge>
            <Badge tone="danger">En retard</Badge>
            <Badge tone="info">En cours</Badge>
            <Badge tone="neutral">Archivée</Badge>
            <Badge tone="primary">Nouveau</Badge>
            <Badge tone="accent">VIP</Badge>
          </div>
        </div>
        <div>
          <SubLabel>Avatars</SubLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Avatar name="Adjoa Koudjo" size="sm" />
            <Avatar name="Fabrice Houngbo" size="md" />
            <Avatar name="Amivi Sossou" size="lg" />
            <Avatar name="Rachidatou Alassane" size="md" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Commande CMD-0142</CardTitle>
                <CardDescription>Adjoa Koudjo · Robe de cérémonie</CardDescription>
              </div>
              <CardAction>
                <StatusBadge status="couture" />
              </CardAction>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted">Livraison prévue le 02/09/2026.</p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" size="sm">
              Voir la commande
            </Button>
          </CardFooter>
        </Card>
      </Section>

      {/* --- États obligatoires --------------------------------------------- */}
      <Section title="États loading / empty / error" description="Briques des 4 états obligatoires sur tout écran alimenté par des données.">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <SubLabel>Chargement</SubLabel>
            <SkeletonCard />
          </div>
          <div>
            <SubLabel>Vide</SubLabel>
            <EmptyState
              title="Aucune commande pour l'instant"
              description="Créez votre première commande pour commencer à suivre vos clients."
              action={<Button size="sm" icon={<Plus className="size-4" />}>Nouvelle commande</Button>}
            />
          </div>
          <div>
            <SubLabel>Erreur</SubLabel>
            <ErrorState
              description="Vérifiez votre connexion puis réessayez."
              action={
                <Button size="sm" variant="secondary" onClick={() => toast.info("Nouvelle tentative…")}>
                  Réessayer
                </Button>
              }
            />
          </div>
        </div>
        <div>
          <SubLabel>Blocs Skeleton individuels</SubLabel>
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3.5 w-1/2" />
            </div>
          </div>
        </div>
      </Section>

      {/* --- Overlays --------------------------------------------------- */}
      <Section title="Fenêtres et menus" description="Dialog (desktop), Drawer (glissement mobile), DropdownMenu, confirmation, notifications.">
        <div className="flex flex-wrap gap-3">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">Ouvrir un Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enregistrer un acompte</DialogTitle>
                <DialogDescription>Le solde restant sera recalculé automatiquement.</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <CurrencyInput label="Montant de l'acompte" value={amount} onChange={setAmount} />
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Annuler</Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    setDialogOpen(false);
                    toast.success("Acompte enregistré");
                  }}
                >
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="secondary">Ouvrir un Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Détail de la commande</DrawerTitle>
                <DrawerDescription>CMD-0142 · Adjoa Koudjo</DrawerDescription>
              </DrawerHeader>
              <PaymentSummary totalAmount={65000} paidAmount={45000} />
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="secondary">Fermer</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Menu actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Commande CMD-0142</DropdownMenuLabel>
              <DropdownMenuItem>
                <Eye className="size-4" aria-hidden="true" />
                Voir le détail
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="size-4" aria-hidden="true" />
                Télécharger la facture
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="danger" onSelect={() => setConfirmOpen(true)}>
                <Trash2 className="size-4" aria-hidden="true" />
                Annuler la commande
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
            Ouvrir une confirmation
          </Button>
        </div>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          tone="danger"
          title="Annuler cette commande ?"
          description="Cette action est irréversible. Le client sera informé de l'annulation."
          confirmLabel="Annuler la commande"
          cancelLabel="Revenir en arrière"
          onConfirm={async () => {
            await new Promise((resolve) => setTimeout(resolve, 600));
            toast.error("Commande annulée");
          }}
        />

        <div>
          <SubLabel>Notifications</SubLabel>
          <p className="mb-2 text-xs text-text-subtle">
            Le Toaster se monte une seule fois par app (voir la section « Layout applicatif » plus bas,
            qui l&apos;inclut) — les notifications déclenchées ici s&apos;y affichent.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" variant="secondary" onClick={() => toast.success("Acompte enregistré", "20 000 FCFA reçus de Adjoa Koudjo")}>
              Toast succès
            </Button>
            <Button size="sm" variant="secondary" onClick={() => toast.error("Échec de l'envoi", "Vérifiez votre connexion puis réessayez")}>
              Toast erreur
            </Button>
            <Button size="sm" variant="secondary" onClick={() => toast.info("Synchronisation en cours…")}>
              Toast info
            </Button>
          </div>
        </div>
      </Section>

      {/* --- Navigation & données --------------------------------------- */}
      <Section title="Navigation et données">
        <div>
          <SubLabel>Fil d&apos;Ariane</SubLabel>
          <Breadcrumbs
            items={[
              { label: "Commandes", href: "/commandes" },
              { label: "CMD-0142", href: "/commandes/142" },
              { label: "Modifier" },
            ]}
          />
        </div>

        <div>
          <SubLabel>PageHeader</SubLabel>
          <Card padding="sm">
            <PageHeader
              title="Commandes"
              description="12 commandes actives cette semaine"
              action={<Button size="sm" icon={<Plus className="size-4" />}>Nouvelle commande</Button>}
            />
          </Card>
        </div>

        <div>
          <SubLabel>Onglets</SubLabel>
          <Tabs defaultValue="apercu">
            <TabsList>
              <TabsTrigger value="apercu">Aperçu</TabsTrigger>
              <TabsTrigger value="mesures">Mesures</TabsTrigger>
              <TabsTrigger value="paiements">Paiements</TabsTrigger>
            </TabsList>
            <TabsContent value="apercu">
              <p className="text-sm text-text-muted">Résumé de la commande, statut et prochaine action.</p>
            </TabsContent>
            <TabsContent value="mesures">
              <p className="text-sm text-text-muted">Dernier profil de mesures daté du 12/08/2026.</p>
            </TabsContent>
            <TabsContent value="paiements">
              <p className="text-sm text-text-muted">Historique des encaissements de la commande.</p>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <SubLabel>Recherche et filtres</SubLabel>
          <div className="flex flex-col gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Rechercher une commande, un client…" />
            <FilterBar
              filters={filters}
              onToggle={(key) =>
                setFilters((prev) => prev.map((f) => (f.key === key ? { ...f, active: !f.active } : f)))
              }
              onReset={() => setFilters((prev) => prev.map((f) => ({ ...f, active: false })))}
            />
          </div>
        </div>

        <div>
          <SubLabel>Tableau (desktop) / Liste de cartes (mobile) — même config de colonnes</SubLabel>
          <div className="hidden md:block">
            <Table columns={ORDER_COLUMNS} data={DEMO_ORDERS} getRowKey={(o) => o.id} />
          </div>
          <div className="md:hidden">
            <MobileCardList columns={ORDER_COLUMNS} data={DEMO_ORDERS} getRowKey={(o) => o.id} />
          </div>
          <Pagination page={page} pageCount={6} onPageChange={setPage} className="mt-3" />
        </div>

        <div>
          <SubLabel>Étapes (Stepper)</SubLabel>
          <Stepper
            currentStep={2}
            steps={[
              { key: "client", label: "Client" },
              { key: "mesures", label: "Mesures" },
              { key: "modele", label: "Modèle" },
              { key: "paiement", label: "Paiement" },
              { key: "confirmation", label: "Confirmation" },
            ]}
          />
        </div>

        <div>
          <SubLabel>Historique (Timeline)</SubLabel>
          <Timeline
            events={[
              { id: "1", title: "Commande créée", timestamp: "20 août à 09:12", icon: <ClipboardList className="size-3.5" /> },
              { id: "2", title: "Acompte de 20 000 FCFA reçu", timestamp: "20 août à 09:20", icon: <Banknote className="size-3.5" /> },
              { id: "3", title: "Tissu et fournitures réunis", timestamp: "22 août à 15:40", icon: <Package className="size-3.5" /> },
              { id: "4", title: "Coupe terminée", timestamp: "25 août à 11:05", icon: <Scissors className="size-3.5" /> },
              { id: "5", title: "En couture", description: "Prochaine étape : essayage", timestamp: "28 août à 08:30", icon: <Truck className="size-3.5" /> },
            ]}
          />
        </div>
      </Section>

      {/* --- Composants métier ------------------------------------------- */}
      <Section title="Composants métier réutilisables" description="Dumb components — props en entrée, JSX en sortie ; branchement aux vraies données dans une passe ultérieure.">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <SubLabel>OrderStatusSelector</SubLabel>
            <OrderStatusSelector status={demoStatus} onStatusChange={setDemoStatus} />
            <p className="mt-2 text-xs text-text-subtle">Statut sélectionné : {demoStatus}</p>
          </div>
          <div>
            <SubLabel>PaymentSummary</SubLabel>
            <PaymentSummary totalAmount={98000} discountAmount={5000} paidAmount={60000} />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <SubLabel>WhatsAppMessagePreview</SubLabel>
            <WhatsAppMessagePreview
              recipientName="Adjoa Koudjo"
              message={whatsappMessage}
              onMessageChange={setWhatsappMessage}
              whatsappHref={`https://wa.me/22990010203?text=${encodeURIComponent(whatsappMessage)}`}
            />
          </div>
          <div>
            <SubLabel>DocumentPreview</SubLabel>
            <DocumentPreview
              documentType="facture"
              number="FAC-2026-0142"
              date="28/08/2026"
              organizationName="Atelier Adjovi Couture"
              clientName="Adjoa Koudjo"
              clientPhone="+229 90 01 02 03"
              lines={[
                { id: "1", label: "Façon robe de cérémonie", quantity: 1, unitAmount: 55000 },
                { id: "2", label: "Tissu wax (6 yards)", quantity: 1, unitAmount: 10000 },
              ]}
              totalAmount={65000}
              discountAmount={5000}
              paidAmount={45000}
              notes="Retrait prévu à l'atelier après 17h."
            />
          </div>
        </div>
      </Section>

      {/* --- Rôles ---------------------------------------------------- */}
      <Section title="RoleGate" description="Conditionne l'affichage selon le rôle courant — confort d'affichage, pas une garantie de sécurité.">
        <Select
          label="Rôle courant (démonstration)"
          value={demoRole}
          onChange={(event) => setDemoRole(event.target.value as Role)}
          options={[
            { value: "owner", label: "Propriétaire" },
            { value: "manager", label: "Manager" },
            { value: "couturiere", label: "Couturière" },
            { value: "reception", label: "Réception" },
            { value: "comptable", label: "Comptable" },
          ]}
        />
        <RoleGate
          allow={["owner", "manager"]}
          role={demoRole}
          fallback={<p className="text-sm text-text-subtle">Action réservée aux propriétaires et gérants.</p>}
        >
          <Button variant="danger" size="sm">
            Supprimer l&apos;atelier
          </Button>
        </RoleGate>
      </Section>

      {/* --- Layout applicatif -------------------------------------------- */}
      <Section title="Layout applicatif (AppShell)" description="Sidebar desktop, barre d'onglets mobile, topbar, menu utilisateur et menu « Plus ». Réduisez la fenêtre pour voir la bascule mobile.">
        <div
          className="overflow-auto rounded-[var(--radius-lg)] border border-border"
          style={{ contain: "layout", height: 560 }}
        >
          <AppShell
            user={{ name: "Amina Chabi", role: "Owner", email: "amina@atelier-elegance.bj" }}
            notifications={[]}
            pendingRequestCount={0}
          >
            <div className="flex flex-col gap-4">
              <PageHeader title="Tableau de bord" description="Aperçu de l'atelier aujourd'hui" />
              <Card padding="sm">
                <p className="text-sm text-text-muted">
                  Contenu de page d&apos;exemple à l&apos;intérieur de l&apos;ossature applicative. Sur
                  mobile, la barre d&apos;onglets du bas est fixée en bas de ce cadre ; sur desktop, la
                  navigation passe dans la colonne latérale.
                </p>
              </Card>
            </div>
          </AppShell>
        </div>
      </Section>
    </div>
  );
}
