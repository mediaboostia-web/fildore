/**
 * Injecte le logo réellement vectorisé (public/brand/logo/*.svg) dans le
 * gabarit de la charte graphique, puis écrit le fichier prêt à publier.
 *
 * Passer par un script plutôt que recopier les tracés à la main évite toute
 * dérive entre la charte et les fichiers livrés : la charte montre exactement
 * l'artwork du kit.
 *
 * Usage : node scripts/brand/build-brand-book.js <gabarit.html> <sortie.html>
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..", "..");
const LOGO_DIR = path.join(ROOT, "public", "brand", "logo");

const [, , templateArg, outArg] = process.argv;
if (!templateArg || !outArg) {
  console.error("Usage : node scripts/brand/build-brand-book.js <gabarit.html> <sortie.html>");
  process.exit(1);
}

/** Extrait viewBox + les deux tracés (encre, fil) d'un SVG généré. */
function readSvg(file) {
  const svg = fs.readFileSync(path.join(LOGO_DIR, file), "utf8");
  const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1];
  const paths = [...svg.matchAll(/<path[^>]*fill="([^"]+)"[^>]*d="([^"]+)"/g)].map((m) => ({
    fill: m[1],
    d: m[2],
  }));
  if (!viewBox || paths.length === 0) throw new Error(`SVG illisible : ${file}`);
  return { viewBox, paths };
}

const mark = readSvg("fildor-mark.svg");
const lockup = readSvg("fildor-logo.svg");

/** Rend un <symbol> dont les couleurs sont pilotables en CSS. */
const symbol = (id, { viewBox, paths }) => {
  const body = paths
    .map((p, i) => {
      const cls = i === 0 ? "mk-ink" : "mk-thread";
      return `<path class="${cls}" fill-rule="evenodd" d="${p.d}"/>`;
    })
    .join("");
  return `<symbol id="${id}" viewBox="${viewBox}">${body}</symbol>`;
};

const symbols =
  `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">` +
  symbol("mark", mark) +
  symbol("lockup", lockup) +
  `</svg>`;

const ratios =
  `:root{--mark-ratio:${(
    Number(mark.viewBox.split(" ")[2]) / Number(mark.viewBox.split(" ")[3])
  ).toFixed(4)};` +
  `--lockup-ratio:${(
    Number(lockup.viewBox.split(" ")[2]) / Number(lockup.viewBox.split(" ")[3])
  ).toFixed(4)};}`;

const template = fs.readFileSync(path.resolve(templateArg), "utf8");
if (!template.includes("<!--SYMBOLS-->")) throw new Error("Le gabarit ne contient pas <!--SYMBOLS-->");

const out = template.replace("<!--SYMBOLS-->", `<style>${ratios}</style>\n${symbols}`);
fs.writeFileSync(path.resolve(outArg), out);
console.log(
  `Charte écrite : ${outArg} (${(fs.statSync(path.resolve(outArg)).size / 1024).toFixed(1)} Ko)`
);
