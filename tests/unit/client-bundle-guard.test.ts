import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..", "..");
const SCANNED_DIRS = ["app", "components", "features"];
const IGNORED_DIRS = new Set(["node_modules", ".next", "_next"]);

function collectSourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (IGNORED_DIRS.has(entry)) continue;
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
    } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

/** `"use client"` en tout début de fichier, quelles que soient les quotes. */
function isClientComponent(source: string): boolean {
  return /^\s*(["'])use client\1/.test(source);
}

/** Un `"use server"` autorise l'accès au dépôt : le code s'exécute côté serveur. */
function isServerModule(source: string): boolean {
  return /^\s*(["'])use server\1/.test(source);
}

/**
 * Couvre les deux formes rencontrées :
 *   import … from "@/lib/mock-data/clients"   (import statique)
 *   await import("@/lib/mock-data/store")     (import dynamique)
 * La seconde est celle qui s'était glissée dans le formulaire d'édition de
 * commande — un test qui ne verrait que la première ne protégerait de rien.
 */
const MOCK_DATA_IMPORT = /(?:from\s*|import\s*\(\s*)["'](?:@\/lib\/mock-data|\.{1,2}\/[^"']*mock-data)/;

/**
 * Types d'entités complètes reçus en props par un Client Component.
 *
 * L'import n'est pas la seule façon de faire fuiter le dépôt : un Server
 * Component peut très bien passer `clients` et `orders` **entiers** en props.
 * C'est ce qui se passait dans l'écran de relances — le bundle contenait les
 * adresses et, via `Order.measurementSnapshot`, les mesures corporelles de tous
 * les clients de l'atelier. Un Client Component reçoit un DTO restreint
 * (`WizardClient`, `MessagingOrder`…), jamais l'entité brute.
 */
const ENTITY_PROP_TYPES = [
  { type: "Client", from: "@/features/clients/types" },
  { type: "Order", from: "@/features/orders/types" },
  { type: "MeasurementProfile", from: "@/features/measurements/types" },
] as const;

/** Vrai si le fichier importe ce type ET l'utilise comme tableau de props. */
function importsEntityAsProps(source: string, type: string, from: string): boolean {
  const importsType = new RegExp(
    `import\\s+type\\s*\\{[^}]*\\b${type}\\b[^}]*\\}\\s*from\\s*["']${from.replace("/", "\\/")}["']`
  ).test(source);
  if (!importsType) return false;

  // `Client[]` / `Array<Client>` dans une signature de props.
  return new RegExp(`:\\s*${type}\\[\\]|Array<\\s*${type}\\s*>`).test(source);
}

describe("étanchéité du dépôt mocké", () => {
  /**
   * `lib/mock-data/*` lit le singleton `globalThis.__FILDOR_DB__`, qui n'existe
   * que côté serveur. Importer ces modules depuis un Client Component en envoie
   * une copie complète dans le bundle JS du navigateur : téléphones, adresses et
   * mesures corporelles de TOUS les clients de l'atelier deviennent lisibles par
   * qui ouvre les outils de développement (PROJECT_RULES.md §7).
   *
   * Le bug a réellement existé dans le wizard de commande. Ce test l'empêche de
   * revenir : un Client Component passe par une Server Action, jamais par le dépôt.
   */
  it("aucun Client Component n'importe lib/mock-data", () => {
    const offenders: string[] = [];

    for (const dir of SCANNED_DIRS) {
      for (const file of collectSourceFiles(join(ROOT, dir))) {
        const source = readFileSync(file, "utf8");
        if (!isClientComponent(source) || isServerModule(source)) continue;
        if (MOCK_DATA_IMPORT.test(source)) {
          offenders.push(file.replace(ROOT, "").replace(/\\/g, "/"));
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  /**
   * Deuxième forme de la même fuite, celle que le test ci-dessus ne voyait pas :
   * l'entité complète arrive par les props au lieu d'un import.
   */
  it("aucun Client Component ne reçoit une liste d'entités complètes en props", () => {
    const offenders: string[] = [];

    for (const dir of SCANNED_DIRS) {
      for (const file of collectSourceFiles(join(ROOT, dir))) {
        const source = readFileSync(file, "utf8");
        if (!isClientComponent(source) || isServerModule(source)) continue;

        for (const { type, from } of ENTITY_PROP_TYPES) {
          if (importsEntityAsProps(source, type, from)) {
            offenders.push(`${file.replace(ROOT, "").replace(/\\/g, "/")} — ${type}[]`);
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it("la détection par props reconnaît le cas réel des relances", () => {
    // Exactement la forme qui existait dans `messages-hub-client.tsx`.
    const fuite = `"use client";
import type { Client } from "@/features/clients/types";
export function Hub({ clients }: { clients: Client[] }) { return null; }`;

    const dto = `"use client";
import type { MessagingClient } from "@/features/messaging/types";
export function Hub({ clients }: { clients: MessagingClient[] }) { return null; }`;

    expect(importsEntityAsProps(fuite, "Client", "@/features/clients/types")).toBe(true);
    expect(importsEntityAsProps(dto, "Client", "@/features/clients/types")).toBe(false);
  });

  it("le scan couvre bien les fichiers du projet (garde-fou du garde-fou)", () => {
    // Sans cette vérification, une erreur de chemin ferait passer le test
    // ci-dessus au vert en n'inspectant aucun fichier.
    const scanned = SCANNED_DIRS.flatMap((dir) => collectSourceFiles(join(ROOT, dir)));
    expect(scanned.length).toBeGreaterThan(50);
  });

  it("la détection reconnaît les deux formes d'import réellement rencontrées", () => {
    // Les deux cas ci-dessous sont ceux qui existaient vraiment dans le code.
    const importStatique = `"use client";\nimport { getProfilesByClient } from "@/lib/mock-data/measurement-profiles";`;
    const importDynamique = `"use client";\nconst { getDb } = await import("@/lib/mock-data/store");`;
    const serverActionLegitime = `"use server";\nimport { getClientById } from "@/lib/mock-data/clients";`;

    expect(MOCK_DATA_IMPORT.test(importStatique)).toBe(true);
    expect(MOCK_DATA_IMPORT.test(importDynamique)).toBe(true);
    // Une Server Action a le droit de lire le dépôt : elle s'exécute côté serveur.
    expect(isServerModule(serverActionLegitime)).toBe(true);
  });
});
