const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Render flat, smooth "qz" icon with 4x4 subpixel anti-aliasing
function renderSmoothIcon(size, bgRgb, qRgb = [255, 255, 255], zRgb = [179, 216, 156]) {
  const s = size / 256;
  const raw = Buffer.alloc(size * (size * 4 + 1));
  const cx = 128 * s;
  const cy = 128 * s;
  const radius = 118 * s;
  const sub = [-0.375, -0.125, 0.125, 0.375];

  // Precise clean Z polygon
  const zPoly = [
    [134 * s, 86 * s],
    [188 * s, 86 * s],
    [188 * s, 102 * s],
    [153 * s, 138 * s],
    [188 * s, 138 * s],
    [188 * s, 154 * s],
    [134 * s, 154 * s],
    [134 * s, 138 * s],
    [169 * s, 102 * s],
    [134 * s, 102 * s],
  ];

  function inPoly(px, py, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1];
      const xj = poly[j][0], yj = poly[j][1];
      const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  for (let y = 0; y < size; y++) {
    const rowOffset = y * (size * 4 + 1);
    raw[rowOffset] = 0;
    for (let x = 0; x < size; x++) {
      const px = rowOffset + 1 + x * 4;
      let accR = 0, accG = 0, accB = 0, accA = 0;

      for (let sy = 0; sy < 4; sy++) {
        const py = y + 0.5 + sub[sy];
        for (let sx = 0; sx < 4; sx++) {
          const pxSub = x + 0.5 + sub[sx];
          const dist = Math.hypot(pxSub - cx, py - cy);

          if (dist > radius) continue;

          // Flat solid background color (no gradients)
          let r = bgRgb[0], g = bgRgb[1], b = bgRgb[2];

          // Q loop
          const qcx = 90 * s, qcy = 120 * s;
          const qDist = Math.hypot((pxSub - qcx) / (38 * s), (py - qcy) / (44 * s));
          const qInDist = Math.hypot((pxSub - qcx) / (22 * s), (py - qcy) / (28 * s));
          let isQ = qDist <= 1.0 && qInDist >= 1.0;

          // Q tail pill
          const p1x = 92 * s, p1y = 134 * s;
          const p2x = 126 * s, p2y = 168 * s;
          const vLen = Math.hypot(p2x - p1x, p2y - p1y);
          const u = Math.max(0, Math.min(1, ((pxSub - p1x) * (p2x - p1x) + (py - p1y) * (p2y - p1y)) / (vLen * vLen)));
          const tailDist = Math.hypot(pxSub - (p1x + u * (p2x - p1x)), py - (p1y + u * (p2y - p1y)));
          if (tailDist <= 8.5 * s) isQ = true;

          // Z polygon
          const isZ = inPoly(pxSub, py, zPoly);

          if (isQ) {
            r = qRgb[0]; g = qRgb[1]; b = qRgb[2];
          } else if (isZ) {
            r = zRgb[0]; g = zRgb[1]; b = zRgb[2];
          }

          accR += r; accG += g; accB += b; accA += 255;
        }
      }

      if (accA > 0) {
        raw[px] = Math.round(accR / 16);
        raw[px + 1] = Math.round(accG / 16);
        raw[px + 2] = Math.round(accB / 16);
        raw[px + 3] = Math.round(accA / 16);
      } else {
        raw[px + 3] = 0;
      }
    }
  }

  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const t = Buffer.from(type);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(Buffer.concat([t, data])));
    return Buffer.concat([len, t, data, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function makeIco(pngBuf) {
  const header = Buffer.from([0, 0, 1, 0, 1, 0]);
  const entry = Buffer.alloc(16);
  entry[0] = 0; entry[1] = 0; entry[2] = 0; entry[3] = 0;
  entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuf.length, 8); entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, pngBuf]);
}

function makeSvg(bgHex, qHex = '#ffffff', zHex = '#b3d89c') {
  return `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="128" cy="128" r="118" fill="${bgHex}"/>
  <g fill="${qHex}">
    <ellipse cx="90" cy="120" rx="38" ry="44"/>
    <ellipse cx="90" cy="120" rx="22" ry="28" fill="${bgHex}"/>
    <path d="M 92 134 L 126 168" stroke="${qHex}" stroke-width="17" stroke-linecap="round"/>
  </g>
  <polygon points="134,86 188,86 188,102 153,138 188,138 188,154 134,154 134,138 169,102 134,102" fill="${zHex}"/>
</svg>
`;
}

function saveAppIcons(appDir, bgRgb, bgHex) {
  const resDir = path.join(appDir, 'resources');
  fs.mkdirSync(resDir, { recursive: true });
  const png = renderSmoothIcon(256, bgRgb);
  const ico = makeIco(png);
  const svg = makeSvg(bgHex);
  fs.writeFileSync(path.join(resDir, 'icon.png'), png);
  fs.writeFileSync(path.join(resDir, 'icon.ico'), ico);
  fs.writeFileSync(path.join(resDir, 'icon.svg'), svg, 'utf8');
  console.log(`Generated icons in ${resDir}`);
}

const root = path.resolve(__dirname, '..');
// Rich Cerulean #4d7298 for Manager, Deep Navy #233748 for Student
saveAppIcons(path.join(root, 'apps', 'manager'), [77, 114, 152], '#4d7298');
saveAppIcons(path.join(root, 'apps', 'student'), [35, 55, 72], '#233748');
console.log('App icons successfully generated.');
