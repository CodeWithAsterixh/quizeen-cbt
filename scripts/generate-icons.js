const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function makePng(size, [r1, g1, b1], [r2, g2, b2]) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    const rowOffset = y * (size * 4 + 1);
    raw[rowOffset] = 0;
    const ty = y / (size - 1);
    for (let x = 0; x < size; x++) {
      const px = rowOffset + 1 + x * 4;
      const tx = x / (size - 1);
      const r = Math.round(r1 * (1 - ty) + r2 * ty);
      const g = Math.round(g1 * (1 - ty) + g2 * ty);
      const b = Math.round(b1 * (1 - ty) + b2 * ty);
      const corner = Math.min(x, y, size - 1 - x, size - 1 - y);
      const alpha = corner < 12 ? Math.max(0, Math.min(255, corner * 22)) : 255;
      const dx = (x - size / 2) / (size / 3.2);
      const dy = (y - size / 2) / (size / 3.2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isLetter = (dist > 0.65 && dist < 1.0) || (x > size * 0.55 && x < size * 0.75 && y > size * 0.55 && y < size * 0.75);
      raw[px] = isLetter ? 255 : r;
      raw[px + 1] = isLetter ? 255 : g;
      raw[px + 2] = isLetter ? 255 : b;
      raw[px + 3] = alpha;
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

function saveAppIcons(appDir, color1, color2) {
  const resDir = path.join(appDir, 'resources');
  fs.mkdirSync(resDir, { recursive: true });
  const png = makePng(256, color1, color2);
  const ico = makeIco(png);
  fs.writeFileSync(path.join(resDir, 'icon.png'), png);
  fs.writeFileSync(path.join(resDir, 'icon.ico'), ico);
  console.log(`Generated icons in ${resDir}`);
}

const root = path.resolve(__dirname, '..');
saveAppIcons(path.join(root, 'apps', 'manager'), [13, 148, 136], [16, 185, 129]); // Teal / Emerald
saveAppIcons(path.join(root, 'apps', 'student'), [37, 99, 235], [99, 102, 241]);  // Blue / Indigo
console.log('App icons successfully generated.');
