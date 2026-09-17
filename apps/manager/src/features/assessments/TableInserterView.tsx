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
    const next = [...tbl.headers];
    next[i] = val;
    setTbl({ ...tbl, headers: next });
  };

  const updateCell = (ri: number, ci: number, val: string) => {
    const next = tbl.data.map((r) => [...r]);
    next[ri][ci] = val;
    setTbl({ ...tbl, data: next });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            Cols:
            <input
              type="number" min={1} max={12} value={totalCols}
              onChange={(e) => setTbl(resizeTable(tbl, parseInt(e.target.value, 10) || 1, totalRows))}
              style={{ width: 44, padding: '3px 6px', borderRadius: 4, border: '1px solid var(--color-border)', textAlign: 'center' }}
            />
          </label>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            Rows:
            <input
              type="number" min={2} max={30} value={totalRows}
              onChange={(e) => setTbl(resizeTable(tbl, totalCols, parseInt(e.target.value, 10) || 2))}
              style={{ width: 44, padding: '3px 6px', borderRadius: 4, border: '1px solid var(--color-border)', textAlign: 'center' }}
            />
          </label>
          <Button variant="outline" size="sm" onClick={() => setTbl(addRow(tbl))}>+ Add Row</Button>
          <Button variant="outline" size="sm" onClick={() => setTbl(addColumn(tbl))}>+ Add Column</Button>
        </div>
        <Button variant="primary" size="sm" onClick={() => onInsert(tableToMarkdown(tbl))}>Insert Table</Button>
      </div>

      <div style={{ border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'auto', maxHeight: 280, background: 'var(--color-surface)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: totalCols > 4 ? totalCols * 100 : '100%' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface-hover)' }}>
              <th style={{ width: 34, padding: '6px 4px', borderBottom: '2px solid var(--color-border)', borderRight: '1px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '0.75rem' }}>#</th>
              {tbl.headers.map((h, ci) => (
                <th key={ci} style={{ padding: 4, borderBottom: '2px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input
                      value={h} onChange={(e) => updateHeader(ci, e.target.value)}
                      style={{ flex: 1, minWidth: 50, fontWeight: 700, padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: 4, background: 'var(--color-bg)', fontSize: '0.82rem' }}
                    />
                    {totalCols > 1 && (
                      <button type="button" title="Delete Column" onClick={() => setTbl(removeColumn(tbl, ci))} style={{ border: 'none', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '2px 4px', fontSize: 13, lineHeight: 1 }}>x</button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tbl.data.map((row, ri) => (
              <tr key={ri} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ width: 34, padding: '4px 2px', textAlign: 'center', background: 'var(--color-surface-hover)', borderRight: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{ri + 1}</span>
                    {tbl.data.length > 1 && (
                      <button type="button" title="Delete Row" onClick={() => setTbl(removeRow(tbl, ri))} style={{ border: 'none', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0, fontSize: 11, lineHeight: 1 }}>x</button>
                    )}
                  </div>
                </td>
                {row.map((val, ci) => (
                  <td key={ci} style={{ padding: 2, borderRight: '1px solid var(--color-border)' }}>
                    <input
                      value={val} onChange={(e) => updateCell(ri, ci, e.target.value)}
                      style={{ width: '100%', minWidth: 50, padding: '5px 8px', border: '1px solid transparent', borderRadius: 3, background: 'transparent', fontSize: '0.85rem' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'var(--color-bg)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
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
