import React, { useState } from 'react';
import { Modal, Button, Assessment, Submission, DownloadSimple } from '@cbt/shared';
import { downloadAssessmentResultPdf } from './assessmentResultPdf';
import { exportBatchResultsZip } from './batchResultExport';

interface Props {
  isOpen: boolean;
  assessments: Assessment[];
  submissions: Submission[];
  schoolName?: string;
  title?: string;
  zipPrefix?: string;
  onClose: () => void;
}

export const ExportResultsModal: React.FC<Props> = ({
  isOpen, assessments, submissions, schoolName, title, zipPrefix, onClose,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => assessments.map((a) => a.id));
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedIds(selectedIds.length === assessments.length ? [] : assessments.map((a) => a.id));
  };

  const handleExport = async () => {
    const selected = assessments.filter((a) => selectedIds.includes(a.id));
    if (selected.length === 0) return;
    setIsExporting(true);
    try {
      if (selected.length === 1) {
        const item = selected[0];
        const subs = submissions.filter((s) => s.examId === item.id);
        downloadAssessmentResultPdf(item, subs, schoolName, zipPrefix ? `${zipPrefix}_${item.subject}` : undefined);
      } else {
        await exportBatchResultsZip(selected, submissions, schoolName, zipPrefix);
      }
      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Export Assessment Results'} maxWidth={560}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
            Select assessments to generate PDF score reports.
          </span>
          <Button variant="ghost" size="sm" onClick={toggleAll}>
            {selectedIds.length === assessments.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        <div style={{ maxHeight: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid var(--color-border)', borderRadius: 6, padding: 8 }}>
          {assessments.map((a) => {
            const count = submissions.filter((s) => s.examId === a.id).length;
            const isChecked = selectedIds.includes(a.id);
            return (
              <label key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 4, cursor: 'pointer', background: isChecked ? 'var(--color-surface-hover)' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" checked={isChecked} onChange={() => toggleSelect(a.id)} style={{ accentColor: 'var(--color-primary)' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{a.subject}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: 8 }}>({a.targetClasses.join(', ')})</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  {count} submission{count === 1 ? '' : 's'}
                </span>
              </label>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
          <Button variant="secondary" onClick={onClose} disabled={isExporting}>Cancel</Button>
          <Button variant="primary" onClick={handleExport} disabled={selectedIds.length === 0 || isExporting} icon={<DownloadSimple size={16} />}>
            {isExporting ? 'Exporting...' : selectedIds.length > 1 ? `Export ZIP (${selectedIds.length} PDFs)` : 'Export PDF'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
