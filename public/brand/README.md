# Kit de marque Fildor

Tous les fichiers de ce dossier sont **générés** à partir du logo source
`public/Logo fildor.png` par :

```bash
node scripts/brand/build-brand-assets.js
```

Ne les modifiez pas à la main : remplacez le logo source puis relancez la
commande. Les SVG sont obtenus en vectorisant les contours réels de l'artwork
(marching squares sur l'isoligne 0,5 + simplification), pas en le redessinant —
ils sont donc fidèles au dessin d'origine, logotype compris, et ne dépendent
d'aucune police installée.

---

## Logo — `logo/`

| Fichier | Usage |
|---|---|
| `fildor-logo.svg` | Lock-up complet (symbole + logotype). **Usage principal, web.** |
| `fildor-logo-white.svg` | Lock-up renversé, pour fond encre ou photo. |
| `fildor-logo-mono.svg` | Lock-up monochrome — hérite de `currentColor`. |
| `fildor-mark.svg` | Symbole seul : barre latérale, avatar, icône. |
| `fildor-mark-white.svg` | Symbole renversé. |
| `fildor-mark-mono.svg` | Symbole monochrome (`currentColor`). |
| `fildor-wordmark.svg` | Logotype seul. |
| `fildor-logo.png` / `@2x` | Lock-up détouré (fond transparent), 900 / 1800 px. |
| `fildor-logo-white.png` | Lock-up renversé détouré. |
| `fildor-mark.png` / `@2x` | Symbole détouré, 512 / 1024 px. |
| `fildor-mark-white.png` | Symbole renversé détouré. |
| `fildor-wordmark.png` | Logotype détouré, 700 px. |

Préférez toujours le **SVG** sur le web. Les PNG servent aux contextes qui
n'acceptent pas le vectoriel : WhatsApp, réseaux sociaux, bureautique, impression.

## Favicons & icônes d'application — `favicon/`

| Fichier | Usage |
|---|---|
| `favicon.svg` | Favicon vectoriel moderne (carré, symbole centré). |
| `favicon-16x16.png` · `-32x32` · `-48x48` | Favicons matriciels de repli. |
| `apple-touch-icon.png` | 180 px — écran d'accueil iOS. |
| `icon-192.png` · `icon-512.png` | Icônes PWA / Android. |
| `icon-512-maskable.png` | Variante *maskable* (marge de sécurité Android). |
| `site.webmanifest` | Manifeste PWA, déjà référencé par `app/layout.tsx`. |

> Ces fichiers sont déjà branchés dans l'application via les conventions
> Next.js `app/icon.svg`, `app/apple-icon.png`, `app/opengraph-image.png` et
> `app/twitter-image.png`. Si vous régénérez le kit, recopiez-les :
>
> ```bash
> cp public/brand/favicon/favicon.svg        app/icon.svg
> cp public/brand/favicon/apple-touch-icon.png app/apple-icon.png
> cp public/brand/social/og-image.png        app/opengraph-image.png
> cp public/brand/social/og-image.png        app/twitter-image.png
> ```

## Social — `social/`

| Fichier | Usage |
|---|---|
| `og-image.png` | 1200 × 630 — aperçu de lien (WhatsApp, Facebook, LinkedIn, X). |
| `whatsapp-profile.png` | 640 × 640 — photo de profil WhatsApp Business de l'atelier. |

## Jetons de design — `tokens/`

`fildor-tokens.css` (variables CSS prêtes à importer) et `fildor-tokens.json`
(pour Figma, Tailwind ou tout autre outil). Ils reprennent exactement la
palette, les rayons et l'échelle d'espacement de `PROJECT_RULES.md`.

---

## Règles d'usage

- **Espace de respiration** : réservez au minimum la hauteur de la boucle du
  symbole tout autour du logo. Rien n'entre dans cette zone.
- **Taille minimale** : 16 px pour le symbole seul, 90 px de large pour le
  lock-up complet (en dessous, le logotype n'est plus lisible — utilisez le
  symbole).
- **Fonds** : version couleur sur fond clair (`#FAFAF7`, `#FFFFFF`) ; version
  blanche sur encre (`#173B36`, `#102B28`) ou sur photo suffisamment sombre.
- **Interdits** : ne pas déformer les proportions, ne pas recolorer hors des
  variantes fournies, ne pas ajouter d'ombre portée, de dégradé, de contour ni
  d'effet de verre, ne pas recomposer le lock-up (écart symbole/logotype fixe),
  ne pas poser la version couleur sur un fond sombre ou chargé.

## Composant applicatif

Dans l'application, n'importez jamais un fichier de ce dossier directement :
utilisez le composant unique

```tsx
import { FildorLogo } from "@/components/brand/fildor-logo";

<FildorLogo variant="lockup" height={30} />
<FildorLogo variant="mark" height={32} />
<FildorLogo variant="lockup" tone="white" height={28} />
```
