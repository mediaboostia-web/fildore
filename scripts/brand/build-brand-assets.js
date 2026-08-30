/**
 * Génère tout le kit de marque Fildor dans public/brand/ à partir du logo
 * source (public/Logo fildor.png).
 *
 * - SVG : contours vectorisés depuis l'artwork réel (voir trace.js), donc
 *   fidèles au dessin d'origine et sans dépendance à une police.
 * - PNG : exports détourés (fond crème rendu transparent) aux tailles utiles.
 * - Favicons, icônes d'app, images sociales, jetons de design.
 *
 * Usage : node scripts/brand/build-brand-assets.js
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");
const { traceContours, rdpClosed, loopToPath } = require("./trace");

const ROOT = path.join(__dirname, "..", "..");
const SRC = path.join(ROOT, "public", "Logo fildor.png");
const OUT = path.join(ROOT, "public", "brand");

const INK = "#173B36";
const INK_DEEP = "#102B28";
const THREAD = "#C45A32";
const THREAD_LIGHT = "#D97945";
const CANVAS = "#FAFAF7";

const EPSILON = 0.4; // simplification RDP, en pixels source

const dir = (...p) => {
  const target = path.join(OUT, ...p);
  fs.mkdirSync(target, { recursive: true });
  return target;
};
const write = (file, contents) => {
  fs.writeFileSync(file, contents);
  const kb = (fs.statSync(file).size / 1024).toFixed(1);
  console.log(`  ✓ ${path.relative(ROOT, file).replace(/\\/g, "/")}  (${kb} Ko)`);
};

(async () => {
  console.log("Lecture du logo source…");
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const px = (x, y) => {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2]];
  };

  const bg = px(0, 0);

  // Références d'encre : moyenne des pixels franchement sombres (vert) et
  // franchement rouges (terracotta). Une moyenne plutôt qu'un pixel extrême,
  // sinon un seul pixel aberrant du PNG sert de référence à tout le tri.
  const acc = { g: [0, 0, 0, 0], t: [0, 0, 0, 0] };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = px(x, y);
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const redness = r - (g + b) / 2;
      if (redness > 45 && lum > 60) {
        acc.t[0] += r; acc.t[1] += g; acc.t[2] += b; acc.t[3]++;
      } else if (lum < 90) {
        acc.g[0] += r; acc.g[1] += g; acc.g[2] += b; acc.g[3]++;
      }
    }
  }
  const mean = (a) => (a[3] ? [a[0] / a[3], a[1] / a[3], a[2] / a[3]].map(Math.round) : [0, 0, 0]);
  const greenRef = mean(acc.g);
  const threadRef = mean(acc.t);
  console.log(`  fond rgb(${bg}) · vert rgb(${greenRef}) · terracotta rgb(${threadRef})`);

  const d2 = (c, ref) =>
    (c[0] - ref[0]) ** 2 + (c[1] - ref[1]) ** 2 + (c[2] - ref[2]) ** 2;

  // Champs de couverture antialiasés (0 → 1) par encre. On garde la couverture
  // réelle plutôt qu'un masque binaire : le tracé interpole ensuite l'isoligne
  // 0,5 au sous-pixel, ce qui supprime les marches d'escalier.
  const greenField = new Float32Array(width * height);
  const threadField = new Float32Array(width * height);
  const fullGreen = Math.sqrt(d2(greenRef, bg));
  const fullThread = Math.sqrt(d2(threadRef, bg));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const c = px(x, y);
      const dg = d2(c, greenRef);
      const dt = d2(c, threadRef);
      const dist = Math.sqrt(d2(c, bg));
      const idx = y * width + x;
      if (dg <= dt) {
        greenField[idx] = Math.max(0, Math.min(1, dist / fullGreen));
      } else {
        threadField[idx] = Math.max(0, Math.min(1, dist / fullThread));
      }
    }
  }
  // Masques binaires dérivés, utilisés pour les boîtes englobantes.
  const greenMask = new Uint8Array(width * height);
  const threadMask = new Uint8Array(width * height);
  for (let i = 0; i < greenField.length; i++) {
    if (greenField[i] >= 0.5) greenMask[i] = 1;
    if (threadField[i] >= 0.5) threadMask[i] = 1;
  }

  // Boîtes englobantes et gouttière principale (symbole | logotype).
  const colInk = new Uint8Array(width);
  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (greenMask[idx] || threadMask[idx]) {
        colInk[x] = 1;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  let widestGap = null;
  let runStart = -1;
  for (let x = minX; x <= maxX; x++) {
    if (!colInk[x]) {
      if (runStart === -1) runStart = x;
    } else if (runStart !== -1) {
      const len = x - runStart;
      if (!widestGap || len > widestGap.len) widestGap = { from: runStart, to: x - 1, len };
      runStart = -1;
    }
  }
  const splitFrom = widestGap.from;
  const splitTo = widestGap.to;
  console.log(`  gouttière principale : x ${splitFrom} → ${splitTo}`);

  /** bbox de l'encre restreinte à une plage horizontale. */
  const bboxIn = (x0, x1) => {
    let a = width;
    let b = -1;
    let c = height;
    let dd = -1;
    for (let y = 0; y < height; y++) {
      for (let x = x0; x <= x1; x++) {
        const idx = y * width + x;
        if (greenMask[idx] || threadMask[idx]) {
          if (x < a) a = x;
          if (x > b) b = x;
          if (y < c) c = y;
          if (y > dd) dd = y;
        }
      }
    }
    return { x0: a, x1: b, y0: c, y1: dd, w: b - a + 1, h: dd - c + 1 };
  };

  const MARK = bboxIn(minX, splitFrom - 1);
  const WORD = bboxIn(splitTo + 1, maxX);
  const FULL = { x0: minX, x1: maxX, y0: minY, y1: maxY, w: maxX - minX + 1, h: maxY - minY + 1 };
  console.log(`  symbole ${MARK.w}×${MARK.h} · logotype ${WORD.w}×${WORD.h} · complet ${FULL.w}×${FULL.h}`);

  /** Découpe un champ de couverture sur une bbox. */
  const sub = (field, box) => {
    const m = new Float32Array(box.w * box.h);
    for (let y = 0; y < box.h; y++) {
      for (let x = 0; x < box.w; x++) {
        m[y * box.w + x] = field[(y + box.y0) * width + (x + box.x0)];
      }
    }
    return m;
  };

  /** Vectorise un champ de couverture en attribut `d`. */
  const maskToPath = (mask, box, scale) => {
    const loops = traceContours(mask, box.w, box.h);
    const parts = [];
    for (const loop of loops) {
      const simplified = rdpClosed(loop, EPSILON);
      if (simplified.length < 4) continue;
      const d = loopToPath(simplified, (p) => [p[0] * scale, p[1] * scale]);
      if (d) parts.push(d);
    }
    return parts.join("");
  };

  /** Construit un SVG complet pour une bbox donnée. */
  const buildSvg = (box, { greenColor, threadColor, viewH = 512, extra = "", pad = 0 }) => {
    const scale = viewH / box.h;
    const w = +(box.w * scale).toFixed(2);
    const h = +(box.h * scale).toFixed(2);
    const gPath = maskToPath(sub(greenField, box), box, scale);
    const tPath = maskToPath(sub(threadField, box), box, scale);
    const vb = pad
      ? `${-pad} ${-pad} ${(w + pad * 2).toFixed(2)} ${(h + pad * 2).toFixed(2)}`
      : `0 0 ${w} ${h}`;
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="Fildor">`,
      extra,
      gPath ? `<path fill="${greenColor}" fill-rule="evenodd" d="${gPath}"/>` : "",
      tPath ? `<path fill="${threadColor}" fill-rule="evenodd" d="${tPath}"/>` : "",
      `</svg>`,
      "",
    ].join("\n");
  };

  console.log("\nSVG vectorisés…");
  const logoDir = dir("logo");

  write(
    path.join(logoDir, "fildor-logo.svg"),
    buildSvg(FULL, { greenColor: INK, threadColor: THREAD, viewH: 240 })
  );
  write(
    path.join(logoDir, "fildor-logo-white.svg"),
    buildSvg(FULL, { greenColor: CANVAS, threadColor: THREAD_LIGHT, viewH: 240 })
  );
  write(
    path.join(logoDir, "fildor-logo-mono.svg"),
    buildSvg(FULL, { greenColor: "currentColor", threadColor: "currentColor", viewH: 240 })
  );
  write(
    path.join(logoDir, "fildor-mark.svg"),
    buildSvg(MARK, { greenColor: INK, threadColor: THREAD, viewH: 512 })
  );
  write(
    path.join(logoDir, "fildor-mark-white.svg"),
    buildSvg(MARK, { greenColor: CANVAS, threadColor: THREAD_LIGHT, viewH: 512 })
  );
  write(
    path.join(logoDir, "fildor-mark-mono.svg"),
    buildSvg(MARK, { greenColor: "currentColor", threadColor: "currentColor", viewH: 512 })
  );
  write(
    path.join(logoDir, "fildor-wordmark.svg"),
    buildSvg(WORD, { greenColor: INK, threadColor: THREAD, viewH: 160 })
  );

  // ---------------------------------------------------------------- rasters
  console.log("\nPNG détourés…");

  /** Détourage : le fond crème devient transparent, l'antialiasing est conservé. */
  const cutout = (box, recolor) => {
    const out = Buffer.alloc(box.w * box.h * 4);
    const LO = 12;
    const HI = 75;
    for (let y = 0; y < box.h; y++) {
      for (let x = 0; x < box.w; x++) {
        const sx = x + box.x0;
        const sy = y + box.y0;
        const [r, g, b] = px(sx, sy);
        const dist = Math.sqrt(d2([r, g, b], bg));
        let alpha = (dist - LO) / (HI - LO);
        alpha = Math.max(0, Math.min(1, alpha));
        const o = (y * box.w + x) * 4;
        let rgb = [r, g, b];
        if (recolor) {
          rgb = d2([r, g, b], threadRef) < d2([r, g, b], greenRef) ? recolor.thread : recolor.green;
        }
        out[o] = rgb[0];
        out[o + 1] = rgb[1];
        out[o + 2] = rgb[2];
        out[o + 3] = Math.round(alpha * 255);
      }
    }
    return sharp(out, { raw: { width: box.w, height: box.h, channels: 4 } });
  };

  const hex = (h) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];

  const exportPng = async (box, file, targetW, recolor) => {
    await cutout(box, recolor).resize({ width: targetW, kernel: "lanczos3" }).png({ compressionLevel: 9 }).toFile(file);
    const kb = (fs.statSync(file).size / 1024).toFixed(1);
    console.log(`  ✓ ${path.relative(ROOT, file).replace(/\\/g, "/")}  (${kb} Ko)`);
  };

  await exportPng(FULL, path.join(logoDir, "fildor-logo.png"), 900);
  await exportPng(FULL, path.join(logoDir, "fildor-logo@2x.png"), 1800);
  await exportPng(FULL, path.join(logoDir, "fildor-logo-white.png"), 900, {
    green: hex(CANVAS),
    thread: hex(THREAD_LIGHT),
  });
  await exportPng(MARK, path.join(logoDir, "fildor-mark.png"), 512);
  await exportPng(MARK, path.join(logoDir, "fildor-mark@2x.png"), 1024);
  await exportPng(MARK, path.join(logoDir, "fildor-mark-white.png"), 512, {
    green: hex(CANVAS),
    thread: hex(THREAD_LIGHT),
  });
  await exportPng(WORD, path.join(logoDir, "fildor-wordmark.png"), 700);

  // ------------------------------------------------------------- favicons
  console.log("\nFavicons & icônes d'application…");
  const favDir = dir("favicon");

  // Symbole centré sur un carré, avec marge de respiration.
  const squareMark = async (size, { background, inset = 0.72, recolor }) => {
    const inner = Math.round(size * inset);
    const markPng = await cutout(MARK, recolor)
      .resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: "lanczos3" })
      .png()
      .toBuffer();
    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: markPng, gravity: "center" }])
      .png({ compressionLevel: 9 });
  };

  const inkBg = { ...(() => { const [r, g, b] = hex(INK); return { r, g, b }; })(), alpha: 1 };
  const whiteRecolor = { green: hex(CANVAS), thread: hex(THREAD_LIGHT) };

  for (const size of [16, 32, 48]) {
    const file = path.join(favDir, `favicon-${size}x${size}.png`);
    await (await squareMark(size, { inset: 0.86 })).toFile(file);
    console.log(`  ✓ ${path.relative(ROOT, file).replace(/\\/g, "/")}`);
  }
  for (const [size, name] of [
    [180, "apple-touch-icon.png"],
    [192, "icon-192.png"],
    [512, "icon-512.png"],
  ]) {
    const file = path.join(favDir, name);
    await (await squareMark(size, { background: inkBg, inset: 0.62, recolor: whiteRecolor })).toFile(file);
    console.log(`  ✓ ${path.relative(ROOT, file).replace(/\\/g, "/")}`);
  }
  // Version « maskable » (zone sûre Android : 60 % centraux).
  {
    const file = path.join(favDir, "icon-512-maskable.png");
    await (await squareMark(512, { background: inkBg, inset: 0.46, recolor: whiteRecolor })).toFile(file);
    console.log(`  ✓ ${path.relative(ROOT, file).replace(/\\/g, "/")}`);
  }

  // favicon.svg carré (symbole centré avec padding)
  {
    const scale = 512 / MARK.h;
    const w = MARK.w * scale;
    const padX = (560 - w) / 2;
    const padY = (560 - 512) / 2;
    const gPath = maskToPath(sub(greenField, MARK), MARK, scale);
    const tPath = maskToPath(sub(threadField, MARK), MARK, scale);
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 560" role="img" aria-label="Fildor">\n` +
      `<g transform="translate(${padX.toFixed(2)} ${padY.toFixed(2)})">\n` +
      `<path fill="${INK}" fill-rule="evenodd" d="${gPath}"/>\n` +
      `<path fill="${THREAD}" fill-rule="evenodd" d="${tPath}"/>\n` +
      `</g>\n</svg>\n`;
    write(path.join(favDir, "favicon.svg"), svg);
  }

  write(
    path.join(favDir, "site.webmanifest"),
    `${JSON.stringify(
      {
        name: "Fildor",
        short_name: "Fildor",
        description: "Le copilote opérationnel des ateliers de couture africains.",
        lang: "fr",
        start_url: "/tableau-de-bord",
        display: "standalone",
        background_color: CANVAS,
        theme_color: INK,
        icons: [
          { src: "/brand/favicon/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/brand/favicon/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/brand/favicon/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      null,
      2
    )}\n`
  );

  // --------------------------------------------------------------- social
  console.log("\nImages sociales & profil WhatsApp…");
  const socialDir = dir("social");

  // Photo de profil WhatsApp : symbole blanc sur encre, format carré.
  {
    const file = path.join(socialDir, "whatsapp-profile.png");
    await (await squareMark(640, { background: inkBg, inset: 0.6, recolor: whiteRecolor })).toFile(file);
    console.log(`  ✓ ${path.relative(ROOT, file).replace(/\\/g, "/")}`);
  }

  // Bannière Open Graph 1200×630 : lockup blanc sur encre + baseline.
  {
    const logoBuf = await cutout(FULL, whiteRecolor)
      .resize({ width: 620, kernel: "lanczos3" })
      .png()
      .toBuffer();
    const [ir, ig, ib] = hex(INK_DEEP);
    const caption = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <text x="600" y="455" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif"
            font-size="30" fill="#DCECE6">Ne perdez plus une commande, une mesure, un paiement.</text>
      <rect x="527" y="500" width="146" height="3" rx="1.5" fill="${THREAD_LIGHT}"/>
    </svg>`;
    const file = path.join(socialDir, "og-image.png");
    await sharp({ create: { width: 1200, height: 630, channels: 4, background: { r: ir, g: ig, b: ib, alpha: 1 } } })
      .composite([
        { input: logoBuf, top: 225, left: 290 },
        { input: Buffer.from(caption), top: 0, left: 0 },
      ])
      .png({ compressionLevel: 9 })
      .toFile(file);
    console.log(`  ✓ ${path.relative(ROOT, file).replace(/\\/g, "/")}`);
  }

  // --------------------------------------------------------------- tokens
  console.log("\nJetons de design…");
  const tokenDir = dir("tokens");
  const tokens = {
    color: {
      "primary-950": "#102B28",
      "primary-900": "#173B36",
      "primary-800": "#215149",
      "primary-700": "#2C675C",
      "primary-600": "#3A7B6C",
      "primary-100": "#DCECE6",
      "primary-50": "#F1F8F5",
      "accent-700": "#A64B2A",
      "accent-600": "#C45A32",
      "accent-500": "#D97945",
      "accent-100": "#F8E1D5",
      "accent-50": "#FFF5F0",
      background: "#FAFAF7",
      surface: "#FFFFFF",
      "surface-muted": "#F4F6F4",
      border: "#D9E0DD",
      "border-strong": "#B8C4BF",
      text: "#1B2422",
      "text-muted": "#64716D",
      "text-subtle": "#88938F",
      success: "#237A52",
      "success-bg": "#E6F4EC",
      warning: "#A86412",
      "warning-bg": "#FFF3D6",
      danger: "#B33A3A",
      "danger-bg": "#FCE8E8",
      info: "#2F6687",
      "info-bg": "#E8F2F8",
      whatsapp: "#25D366",
    },
    radius: { sm: "6px", md: "10px", lg: "14px", xl: "18px" },
    spacing: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map((n) => `${n}px`),
  };
  write(path.join(tokenDir, "fildor-tokens.json"), `${JSON.stringify(tokens, null, 2)}\n`);
  write(
    path.join(tokenDir, "fildor-tokens.css"),
    `:root {\n${Object.entries(tokens.color)
      .map(([k, v]) => `  --color-${k}: ${v};`)
      .join("\n")}\n${Object.entries(tokens.radius)
      .map(([k, v]) => `  --radius-${k}: ${v};`)
      .join("\n")}\n}\n`
  );

  console.log("\nKit de marque généré dans public/brand/.");
})();
