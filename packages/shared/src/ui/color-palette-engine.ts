import { parseHex, toHex, rgbToHsl, hslToRgb, getContrastText } from './color-math.js';

export interface GeneratedColorSystem {
  primary: Record<number, string>;
  primaryContrast: string;
  secondary: Record<number, string>;
  secondaryContrast: string;
  surfaces: { bg: string; surface: string; hover: string; subtle: string };
  borders: { subtle: string; default: string; strong: string };
  semantic: { success: string; warning: string; danger: string; info: string };
}

function makeTonalScale(baseHex: string): Record<number, string> {
  const rgb = parseHex(baseHex);
  const [h, s] = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const scale: Record<number, string> = {};
  const lightnessMap: Record<number, number> = {
    50: 96, 100: 92, 200: 84, 300: 72, 400: 60,
    500: 50, 600: 40, 700: 30, 800: 20, 900: 12,
  };
  for (const [step, targetL] of Object.entries(lightnessMap)) {
    const [r, g, b] = hslToRgb(h, Math.max(15, Math.min(95, s)), targetL);
    scale[Number(step)] = toHex(r, g, b);
  }
  scale[500] = baseHex;
  return scale;
}

export function generateColorPalette(primaryHex: string, secondaryHex: string): GeneratedColorSystem {
  const primary = makeTonalScale(primaryHex);
  const secondary = makeTonalScale(secondaryHex);
  const [pHue] = rgbToHsl(parseHex(primaryHex).r, parseHex(primaryHex).g, parseHex(primaryHex).b);

  const makeTint = (h: number, s: number, l: number) => {
    const [r, g, b] = hslToRgb(h, s, l);
    return toHex(r, g, b);
  };

  const surfaces = {
    bg: makeTint(pHue, 12, 98),
    surface: '#ffffff',
    hover: makeTint(pHue, 16, 95),
    subtle: makeTint(pHue, 20, 92),
  };

  const borders = {
    subtle: makeTint(pHue, 14, 90),
    default: makeTint(pHue, 18, 82),
    strong: makeTint(pHue, 22, 65),
  };

  const semantic = {
    success: makeTint(142, 70, 40),
    warning: makeTint(38, 92, 48),
    danger: makeTint(0, 78, 52),
    info: makeTint(210, 85, 50),
  };

  return {
    primary,
    primaryContrast: getContrastText(primaryHex),
    secondary,
    secondaryContrast: getContrastText(secondaryHex),
    surfaces,
    borders,
    semantic,
  };
}

export function applyColorPalette(primaryHex: string, secondaryHex: string): void {
  if (typeof document === 'undefined') return;
  const sys = generateColorPalette(primaryHex, secondaryHex);
  const root = document.documentElement;

  root.style.setProperty('--color-primary', primaryHex);
  root.style.setProperty('--color-primary-hover', sys.primary[600]);
  root.style.setProperty('--color-primary-subtle', sys.primary[100]);
  root.style.setProperty('--color-primary-contrast', sys.primaryContrast);

  root.style.setProperty('--color-accent', secondaryHex);
  root.style.setProperty('--color-accent-contrast', sys.secondaryContrast);

  root.style.setProperty('--color-bg', sys.surfaces.bg);
  root.style.setProperty('--color-surface', sys.surfaces.surface);
  root.style.setProperty('--color-surface-hover', sys.surfaces.hover);
  root.style.setProperty('--color-surface-subtle', sys.surfaces.subtle);

  root.style.setProperty('--color-border', sys.borders.default);
  root.style.setProperty('--color-border-subtle', sys.borders.subtle);

  root.style.setProperty('--color-success', sys.semantic.success);
  root.style.setProperty('--color-warning', sys.semantic.warning);
  root.style.setProperty('--color-danger', sys.semantic.danger);
  root.style.setProperty('--color-info', sys.semantic.info);
}
