export interface TableModel {
  headers: string[];
  data: string[][];
}

export const createInitialTable = (initialCols = 3, initialRows = 3): TableModel => {
  const headers = Array.from({ length: initialCols }, (_, i) => `Col ${i + 1}`);
  const data = Array.from({ length: Math.max(1, initialRows - 1) }, (_, r) =>
    Array.from({ length: initialCols }, (_, c) => `Cell ${r * initialCols + c + 1}`)
  );
  return { headers, data };
};

export const addColumn = (tbl: TableModel, atIndex?: number): TableModel => {
  const idx = atIndex !== undefined ? atIndex : tbl.headers.length;
  const colName = `Col ${tbl.headers.length + 1}`;
  const newHeaders = [...tbl.headers.slice(0, idx), colName, ...tbl.headers.slice(idx)];
  const newData = tbl.data.map((row) => [...row.slice(0, idx), '', ...row.slice(idx)]);
  return { headers: newHeaders, data: newData };
};

export const removeColumn = (tbl: TableModel, colIdx: number): TableModel => {
  if (tbl.headers.length <= 1) return tbl;
  return {
    headers: tbl.headers.filter((_, i) => i !== colIdx),
    data: tbl.data.map((row) => row.filter((_, i) => i !== colIdx)),
  };
};

export const addRow = (tbl: TableModel, atIndex?: number): TableModel => {
  const idx = atIndex !== undefined ? atIndex : tbl.data.length;
  const emptyRow = Array.from({ length: tbl.headers.length }, () => '');
  const newData = [...tbl.data.slice(0, idx), emptyRow, ...tbl.data.slice(idx)];
  return { ...tbl, data: newData };
};

export const removeRow = (tbl: TableModel, rowIdx: number): TableModel => {
  if (tbl.data.length <= 1) return tbl;
  return { ...tbl, data: tbl.data.filter((_, i) => i !== rowIdx) };
};

export const resizeTable = (tbl: TableModel, targetCols: number, targetRows: number): TableModel => {
  const numCols = Math.max(1, targetCols);
  const numDataRows = Math.max(1, targetRows - 1);
  const headers = Array.from({ length: numCols }, (_, i) => tbl.headers[i] || `Col ${i + 1}`);
  const data = Array.from({ length: numDataRows }, (_, ri) =>
    Array.from({ length: numCols }, (_, ci) => tbl.data[ri]?.[ci] || '')
  );
  return { headers, data };
};

export const tableToMarkdown = (tbl: TableModel): string => {
  const hRow = '| ' + tbl.headers.map((h) => h.trim() || 'Col').join(' | ') + ' |';
  const sep = '| ' + tbl.headers.map(() => '---').join(' | ') + ' |';
  const bRows = tbl.data.map((row) => '| ' + row.map((c) => c.trim() || '-').join(' | ') + ' |').join('\n');
  return `\n${hRow}\n${sep}\n${bRows}\n`;
};
