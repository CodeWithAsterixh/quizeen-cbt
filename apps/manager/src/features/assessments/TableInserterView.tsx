import React, { useState } from 'react';
import { Button } from '@cbt/shared';
import {
  TableModel, createInitialTable, addColumn, removeColumn,
  addRow, removeRow, resizeTable, tableToMarkdown,
} from './table-inserter-state';

interface Props {
  onInsert: (markdown: string) => void;
}

export const TableInserterView: React.FC<Props> = ({ onInsert }) => {
  const [tbl, setTbl] = useState<TableModel>(() => createInitialTable(3, 3));

  const totalCols = tbl.headers.length;
  const totalRows = tbl.data.length + 1;

  const updateHeader = (i: number, val: string) => {
    const copy = [...tbl.headers];
    copy[i] = val;
    setTbl({ ...tbl, headers: copy });
  };

  const updateCell = (ri: number, ci: number, val: string) => {
    const copy = tbl.data.map((r) => [...r]);
    copy[ri][ci] = val;
    setTbl({ ...tbl, data: copy });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          Columns: <input type="number" min={1} max={30} value={totalCols} onChange={(e) => setTbl(resizeTable(tbl, parseInt(e.target.value, 10) || 1, totalRows))} style={{ width: 50, padding: '3px 6px', borderRadius: 4, border: '1px solid var(--color-border)' }} />
        </label>
        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          Rows: <input type="number" min={2} max={50} value={totalRows} onChange={(e) => setTbl(resizeTable(tbl, totalCols, parseInt(e.target.value, 10) || 2))} style={{ width: 50, padding: '3px 6px', borderRadius: 4, border: '1px solid var(--color-border)' }} />
        </label>
        <Button variant="outline" size="sm" onClick={() => setTbl(addRow(tbl, 0))}>+ Row Top</Button>
        <Button variant="outline" size="sm" onClick={() => setTbl(addRow(tbl))}>+ Row Bottom</Button>
        <Button variant="outline" size="sm" onClick={() => setTbl(addColumn(tbl, 0))}>+ Col Left</Button>
        <Button variant="outline" size="sm" onClick={() => setTbl(addColumn(tbl))}>+ Col Right</Button>
        <Button variant="primary" size="sm" onClick={() => onInsert(tableToMarkdown(tbl))}>Insert Table</Button>
      </div>
      <div style={{ maxHeight: 260, overflow: 'auto', border: '1px solid var(--color-border)', borderRadius: 6, padding: 6 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: totalCols * 110 }}>
          <thead>
            <tr>
              <th style={{ width: 44 }} />
              {tbl.headers.map((h, ci) => (
                <th key={ci} style={{ padding: 3, borderBottom: '2px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <input
                      value={h} onChange={(e) => updateHeader(ci, e.target.value)}
                      style={{ flex: 1, fontWeight: 700, padding: '3px 6px', borderRadius: 3, border: '1px solid var(--color-border)' }}
                    />
                    <button type="button" title="Add column right" onClick={() => setTbl(addColumn(tbl, ci + 1))} style={{ padding: '2px 4px', fontSize: 11, cursor: 'pointer' }}>+</button>
                    {totalCols > 1 && <button type="button" title="Delete column" onClick={() => setTbl(removeColumn(tbl, ci))} style={{ padding: '2px 4px', fontSize: 11, cursor: 'pointer' }}>x</button>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tbl.data.map((row, ri) => (
              <tr key={ri}>
                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <button type="button" title="Add row below" onClick={() => setTbl(addRow(tbl, ri + 1))} style={{ padding: '1px 4px', fontSize: 10, cursor: 'pointer' }}>+</button>
                  {tbl.data.length > 1 && <button type="button" title="Delete row" onClick={() => setTbl(removeRow(tbl, ri))} style={{ padding: '1px 4px', fontSize: 10, cursor: 'pointer', marginLeft: 2 }}>x</button>}
                </td>
                {row.map((val, ci) => (
                  <td key={ci} style={{ padding: 3, borderBottom: '1px solid var(--color-border)' }}>
                    <input
                      value={val} onChange={(e) => updateCell(ri, ci, e.target.value)}
                      style={{ width: '100%', padding: '3px 6px', borderRadius: 3, border: '1px solid var(--color-border)' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
