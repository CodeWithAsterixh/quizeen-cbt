export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export function parseHex(hex: string): RgbColor {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  const num = parseInt(full || '000000', 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function toHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const hex = [clamp(r), clamp(g), clamp(b)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
  return `#${hex}`;
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === nr) {
      h = ((ng - nb) / delta + (ng < nb ? 6 : 0)) / 6;
    } else if (max === ng) {
      h = ((nb - nr) / delta + 2) / 6;
    } else {
      h = ((nr - ng) / delta + 4) / 6;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const nh = (h % 360) / 360;
  const ns = Math.max(0, Math.min(100, s)) / 100;
  const nl = Math.max(0, Math.min(100, l)) / 100;

  if (ns === 0) {
    const v = Math.round(nl * 255);
    return [v, v, v];
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = nl < 0.5 ? nl * (1 + ns) : nl + ns - nl * ns;
  const p = 2 * nl - q;
  const r = Math.round(hue2rgb(p, q, nh + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, nh) * 255);
  const b = Math.round(hue2rgb(p, q, nh - 1 / 3) * 255);
  return [r, g, b];
}

export function getRelativeLuminance(r: number, g: number, b: number): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function getContrastRatio(hexA: string, hexB: string): number {
  const rgbA = parseHex(hexA);
  const rgbB = parseHex(hexB);
  const l1 = getRelativeLuminance(rgbA.r, rgbA.g, rgbA.b);
  const l2 = getRelativeLuminance(rgbB.r, rgbB.g, rgbB.b);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (brighter + 0.05) / (darker + 0.05);
}

export function getContrastText(bgHex: string): string {
  const whiteRatio = getContrastRatio(bgHex, '#ffffff');
  const darkRatio = getContrastRatio(bgHex, '#0f172a');
  return whiteRatio >= darkRatio ? '#ffffff' : '#0f172a';
}
