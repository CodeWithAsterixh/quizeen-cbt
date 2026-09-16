import katex from 'katex';
import { parseMarkdownTables } from './table-parser.js';

function renderMath(math: string, displayMode: boolean): string {
  try {
    return katex.renderToString(math.trim(), {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
      strict: false,
    });
  } catch {
    return `<span class="cbt-math-fallback">${math}</span>`;
  }
}

export function parseComplexWriting(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';

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
