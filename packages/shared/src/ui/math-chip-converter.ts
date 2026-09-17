import katex from 'katex';
import { parseMarkdownTables } from './table-parser.js';
import { decodeMathEntities } from './equation-parser.js';

export function formatToCanvas(text: string): string {
  if (!text) return '';
  let out = parseMarkdownTables(text);
  out = out.replace(/<div class="cbt-table-wrapper"/g, '<div class="cbt-table-wrapper" contenteditable="false"');
  return out.replace(/\$([^\$\n\r]+?)\$/g, (match, math) => {
    try {
      const decoded = decodeMathEntities(math).trim();
      const rendered = katex.renderToString(decoded, { throwOnError: false, displayMode: false });
      const enc = encodeURIComponent(decoded);
      return `<span class="cbt-formula-chip" contenteditable="false" data-latex="${enc}" title="Click to edit formula" style="display:inline-flex;align-items:center;padding:1px 6px;margin:0 2px;background:var(--color-surface-hover);border:1px solid var(--color-border);border-radius:4px;cursor:pointer;vertical-align:middle;">${rendered}</span>`;
    } catch {
      return match;
    }
  });
}

export function canvasToValue(html: string): string {
  if (!html) return '';
  if (typeof document === 'undefined') return html;
  const div = document.createElement('div');
  div.innerHTML = html;
  div.querySelectorAll('.cbt-formula-chip').forEach((chip) => {
    const latex = decodeURIComponent(chip.getAttribute('data-latex') || '');
    chip.replaceWith(document.createTextNode(`$${latex}$`));
  });
  div.querySelectorAll('.cbt-table-wrapper[data-table-markdown]').forEach((wrapper) => {
    const md = decodeURIComponent(wrapper.getAttribute('data-table-markdown') || '');
    wrapper.replaceWith(document.createTextNode(`\n\n${md.trim()}\n\n`));
  });
  let res = div.innerHTML;
  res = res.replace(/\$([^\$\n\r]+?)\$/g, (_, math) => `$${decodeMathEntities(math)}$`);
  res = res.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => `$$${decodeMathEntities(math)}$$`);
  return res;
}
