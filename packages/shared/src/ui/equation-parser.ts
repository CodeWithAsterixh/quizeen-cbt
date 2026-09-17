import katex from 'katex';
import { parseMarkdownTables } from './table-parser.js';

const mathCache = new Map<string, string>();

function renderMath(math: string, displayMode: boolean): string {
  const trimmed = math.trim();
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
    return `<span class="cbt-math-fallback">${math}</span>`;
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
