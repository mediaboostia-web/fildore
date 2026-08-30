/**
 * Vectorisation du logo Fildor.
 *
 * Le logo source est un PNG (public/Logo fildor.png). Plutôt que de redessiner
 * la marque « à la main » — ce qui produirait une approximation —, on trace ici
 * les contours réels de l'artwork : marching squares sur les masques de couleur,
 * puis simplification Ramer–Douglas–Peucker. Le SVG obtenu est donc fidèle au
 * dessin d'origine, y compris le logotype (vectorisé en formes, sans dépendance
 * à une police).
 */

/**
 * Trace tous les contours fermés d'un champ de couverture (marching squares).
 *
 * `field` est un Float32Array de couverture 0→1 (et non un masque binaire) :
 * les points de croisement sont interpolés linéairement sur l'isoligne 0,5, ce
 * qui donne des contours au sous-pixel. Sur un masque binaire, les contours
 * suivraient les marches d'escalier de la grille et laisseraient des encoches
 * visibles dans les pleins de lettres et les traits.
 */
function traceContours(field, width, height, iso = 0.5) {
  const at = (x, y) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : field[y * width + x]);

  // Interpolation d'un croisement entre deux coins voisins.
  const lerp = (v0, v1) => {
    const d = v1 - v0;
    if (Math.abs(d) < 1e-9) return 0.5;
    return Math.max(0, Math.min(1, (iso - v0) / d));
  };
  const round = (v) => Math.round(v * 1000) / 1000;

  const key = (p) => `${p[0]},${p[1]}`;
  const segments = new Map(); // clé du point de départ -> [points d'arrivée]

  const addSegment = (from, to) => {
    const k = key(from);
    if (!segments.has(k)) segments.set(k, []);
    segments.get(k).push(to);
  };

  for (let y = -1; y < height; y++) {
    for (let x = -1; x < width; x++) {
      const vtl = at(x, y);
      const vtr = at(x + 1, y);
      const vbr = at(x + 1, y + 1);
      const vbl = at(x, y + 1);
      const code =
        (vtl >= iso ? 1 : 0) | (vtr >= iso ? 2 : 0) | (vbr >= iso ? 4 : 0) | (vbl >= iso ? 8 : 0);
      if (code === 0 || code === 15) continue;

      const T = [round(x + lerp(vtl, vtr)), y];
      const R = [x + 1, round(y + lerp(vtr, vbr))];
      const B = [round(x + lerp(vbl, vbr)), y + 1];
      const L = [x, round(y + lerp(vtl, vbl))];

      switch (code) {
        case 1: addSegment(L, T); break;
        case 2: addSegment(T, R); break;
        case 3: addSegment(L, R); break;
        case 4: addSegment(R, B); break;
        case 5: addSegment(L, T); addSegment(R, B); break;
        case 6: addSegment(T, B); break;
        case 7: addSegment(L, B); break;
        case 8: addSegment(B, L); break;
        case 9: addSegment(B, T); break;
        case 10: addSegment(T, R); addSegment(B, L); break;
        case 11: addSegment(B, R); break;
        case 12: addSegment(R, L); break;
        case 13: addSegment(R, T); break;
        case 14: addSegment(T, L); break;
        default: break;
      }
    }
  }

  // Recolle les segments en boucles fermées.
  const loops = [];
  const consume = (k) => {
    const list = segments.get(k);
    if (!list || list.length === 0) return null;
    const next = list.pop();
    if (list.length === 0) segments.delete(k);
    return next;
  };

  for (const startKey of Array.from(segments.keys())) {
    while (segments.has(startKey)) {
      const start = startKey.split(",").map(Number);
      const loop = [start];
      let current = consume(startKey);
      let guard = 0;
      while (current && guard++ < 4_000_000) {
        loop.push(current);
        const ck = key(current);
        if (ck === startKey) break;
        current = consume(ck);
      }
      if (loop.length > 3) loops.push(loop);
    }
  }

  return loops;
}

/**
 * Simplification Ramer–Douglas–Peucker d'une boucle FERMÉE.
 *
 * RDP classique s'ancre sur le premier et le dernier point ; sur un contour
 * fermé ces deux points sont confondus, la droite d'ancrage est dégénérée et
 * toutes les distances valent 0 — la boucle entière s'effondrerait sur deux
 * points. On coupe donc le contour en deux chaînes ouvertes entre deux points
 * diamétralement opposés avant de simplifier chacune.
 */
function rdpClosed(points, epsilon) {
  const pts = points.slice();
  if (pts.length > 1) {
    const [ax, ay] = pts[0];
    const [bx, by] = pts[pts.length - 1];
    if (Math.hypot(ax - bx, ay - by) < 1e-9) pts.pop();
  }
  if (pts.length < 4) return pts;

  let far = 0;
  let farDist = -1;
  for (let i = 1; i < pts.length; i++) {
    const dist = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]);
    if (dist > farDist) {
      farDist = dist;
      far = i;
    }
  }

  const chainA = pts.slice(0, far + 1);
  const chainB = pts.slice(far).concat([pts[0]]);
  const a = rdp(chainA, epsilon);
  const b = rdp(chainB, epsilon);
  return a.concat(b.slice(1, -1));
}

/** Simplification Ramer–Douglas–Peucker d'une chaîne OUVERTE (itérative). */
function rdp(points, epsilon) {
  if (points.length < 3) return points.slice();

  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];

  while (stack.length) {
    const [first, last] = stack.pop();
    if (last <= first + 1) continue;

    const [x1, y1] = points[first];
    const [x2, y2] = points[last];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const norm = Math.hypot(dx, dy) || 1;

    let maxDist = -1;
    let index = first;
    for (let i = first + 1; i < last; i++) {
      const [px, py] = points[i];
      const dist = Math.abs(dy * px - dx * py + x2 * y1 - y2 * x1) / norm;
      if (dist > maxDist) {
        maxDist = dist;
        index = i;
      }
    }

    if (maxDist > epsilon) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }

  const out = [];
  for (let i = 0; i < points.length; i++) if (keep[i]) out.push(points[i]);
  return out;
}

/**
 * Convertit une boucle en courbes de Bézier lisses, en préservant les angles
 * vifs (extrémités de traits, tirets) au-delà de `cornerAngle` degrés.
 */
function loopToPath(loop, transform, cornerAngleDeg = 42) {
  const pts = loop.map(transform);
  if (pts.length > 1) {
    const [ax, ay] = pts[0];
    const [bx, by] = pts[pts.length - 1];
    if (Math.hypot(ax - bx, ay - by) < 1e-6) pts.pop();
  }
  const n = pts.length;
  if (n < 3) return "";

  const cosLimit = Math.cos((180 - cornerAngleDeg) * (Math.PI / 180));
  const isCorner = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const p = pts[(i - 1 + n) % n];
    const c = pts[i];
    const q = pts[(i + 1) % n];
    const v1x = p[0] - c[0];
    const v1y = p[1] - c[1];
    const v2x = q[0] - c[0];
    const v2y = q[1] - c[1];
    const l1 = Math.hypot(v1x, v1y) || 1;
    const l2 = Math.hypot(v2x, v2y) || 1;
    const cos = (v1x * v2x + v1y * v2y) / (l1 * l2);
    if (cos > cosLimit) isCorner[i] = 1;
  }

  const r = (v) => Math.round(v * 10) / 10;
  const tangent = (i) => {
    if (isCorner[i]) return [0, 0];
    const p = pts[(i - 1 + n) % n];
    const q = pts[(i + 1) % n];
    return [(q[0] - p[0]) / 6, (q[1] - p[1]) / 6];
  };

  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const cur = pts[i];
    const nxt = pts[(i + 1) % n];
    const t1 = tangent(i);
    const t2 = tangent((i + 1) % n);
    if (t1[0] === 0 && t1[1] === 0 && t2[0] === 0 && t2[1] === 0) {
      d += `L${r(nxt[0])} ${r(nxt[1])}`;
    } else {
      d += `C${r(cur[0] + t1[0])} ${r(cur[1] + t1[1])} ${r(nxt[0] - t2[0])} ${r(nxt[1] - t2[1])} ${r(nxt[0])} ${r(nxt[1])}`;
    }
  }
  return `${d}Z`;
}

module.exports = { traceContours, rdp, rdpClosed, loopToPath };
