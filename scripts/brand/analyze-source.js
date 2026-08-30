/**
 * Analyse le logo source (public/Logo fildor.png) pour repérer la boîte
 * englobante réelle du contenu et la gouttière entre le symbole et le
 * logotype. Sert de base au découpage exact fait par build-brand-assets.js.
 *
 * Usage : node scripts/brand/analyze-source.js
 */
const sharp = require("sharp");
const path = require("node:path");

const SRC = path.join(__dirname, "..", "..", "public", "Logo fildor.png");

(async () => {
  const img = sharp(SRC);
  const meta = await img.metadata();
  console.log("source:", meta.width, "x", meta.height, "| canaux:", meta.channels);

  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const bg = [data[0], data[1], data[2]];
  console.log("fond (coin haut-gauche) rgb:", bg.join(","));

  const TOL = 26;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  const colHasInk = new Uint8Array(width);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const d =
        Math.abs(data[i] - bg[0]) +
        Math.abs(data[i + 1] - bg[1]) +
        Math.abs(data[i + 2] - bg[2]);
      if (d > TOL) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        colHasInk[x] = 1;
      }
    }
  }

  console.log("contenu:", {
    minX,
    minY,
    maxX,
    maxY,
    w: maxX - minX + 1,
    h: maxY - minY + 1,
  });

  const gaps = [];
  let runStart = -1;
  for (let x = minX; x <= maxX; x++) {
    if (!colHasInk[x]) {
      if (runStart === -1) runStart = x;
    } else if (runStart !== -1) {
      if (x - runStart > 20) gaps.push({ from: runStart, to: x - 1, len: x - runStart });
      runStart = -1;
    }
  }
  console.log("gouttières (>20px):", gaps);
})();
