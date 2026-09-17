import katex from 'katex';
import { parseMarkdownTables } from './table-parser.js';

const mathCache = new Map<string, string>();

export function decodeMathEntities(text: string): string {
  if (!text || !text.includes('&')) return text;
  let decoded = text;
  let prev = '';
  while (decoded !== prev && decoded.includes('&')) {
    prev = decoded;
    decoded = decoded
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
      .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  }
  return decoded;
}

function renderMath(math: string, displayMode: boolean): string {
  const trimmed = decodeMathEntities(math).trim();
  const key = `${displayMode ? 'D' : 'I'}:${trimmed}`;
  const cached = mathCache.get(key);
  if (cached !== undefined) return cached;

  try {
    const res = katex.renderToString(trimmed, {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
      strict: false,
    });
    if (mathCache.size > 2000) mathCache.clear();
    mathCache.set(key, res);
    return res;
  } catch {
    return `<span class="cbt-math-fallback">${trimmed}</span>`;
  }
}

export function parseComplexWriting(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  if (!/[\|\$\\\^~=]/.test(raw)) return raw;

  let out = raw;

  out = parseMarkdownTables(out);

  out = out.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => renderMath(math, true));
  out = out.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => renderMath(math, true));

  out = out.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => renderMath(math, false));
  out = out.replace(/\$([^\$\n\r]+?)\$/g, (match, math) => {
    if (/^\s*\d+([.,]\d+)?\s*$/.test(math)) return match;
    return renderMath(math, false);
  });

  out = out.replace(/\^([a-zA-Z0-9+\-._]+)\^/g, '<sup>$1</sup>');
  out = out.replace(/~([a-zA-Z0-9+\-._]+)~/g, '<sub>$1</sub>');

  out = out.replace(/==([^=\n]+)==/g, '<span class="cbt-double-underline">$1</span>');

  return out;
}
