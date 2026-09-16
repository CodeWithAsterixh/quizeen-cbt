export function parseMarkdownTables(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let inTable = false;
  let tableRows: string[] = [];

  const flushTable = () => {
    if (tableRows.length < 2) {
      result.push(...tableRows);
      tableRows = [];
      inTable = false;
      return;
    }

    const headerLine = tableRows[0];
    const dataLines = tableRows.slice(2);
    const headers = headerLine.split('|').map((s) => s.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1 || arr.length <= 2);
    const cleanHeaders = headers.length > 0 ? headers : headerLine.split('|').map((s) => s.trim()).filter(Boolean);

    let html = '<div class="cbt-table-wrapper"><table class="cbt-table"><thead><tr>';
    for (const h of cleanHeaders) {
      html += `<th>${h}</th>`;
    }
    html += '</tr></thead><tbody>';

    for (const row of dataLines) {
      const cells = row.split('|').map((s) => s.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1 || arr.length <= 2);
      const cleanCells = cells.length > 0 ? cells : row.split('|').map((s) => s.trim()).filter(Boolean);
      html += '<tr>';
      for (const c of cleanCells) {
        html += `<td>${c}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table></div>';
    result.push(html);
    tableRows = [];
    inTable = false;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const isTableRow = trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2;
    if (isTableRow) {
      inTable = true;
      tableRows.push(trimmed);
    } else {
      if (inTable) flushTable();
      result.push(line);
    }
  }
  if (inTable) flushTable();

  return result.join('\n');
}
