import katex from 'katex';

export function formatToCanvas(text: string): string {
  if (!text) return '';
  return text.replace(/\$([^\$\n\r]+?)\$/g, (match, math) => {
    try {
      const rendered = katex.renderToString(math.trim(), { throwOnError: false, displayMode: false });
      const enc = encodeURIComponent(math.trim());
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
  return div.innerHTML;
}
