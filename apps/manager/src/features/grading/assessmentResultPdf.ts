import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Assessment, Submission, SchoolBrandingConfig } from '@cbt/shared';

function hexToRgb(hex = '#059669'): [number, number, number] {
  const c = hex.replace('#', '');
  if (c.length === 6) {
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  }
  return [5, 150, 105];
}

export function buildAssessmentResultPdf(
  assessment: Assessment,
  submissions: Submission[],
  brandingOrName?: string | SchoolBrandingConfig,
  primaryColor = '#059669'
): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const b = typeof brandingOrName === 'object' ? brandingOrName : (brandingOrName ? { schoolName: brandingOrName } as SchoolBrandingConfig : undefined);
  const rgb = hexToRgb(primaryColor);
  const schoolName = (b?.schoolName || 'CBT Assessment System').toUpperCase();
  const total = submissions.length;
  const passingScore = assessment.passingScore || 50;
  const passedCount = submissions.filter((s) => (s.percentage ?? 0) >= passingScore).length;
  const avg = total > 0 ? Math.round(submissions.reduce((acc, s) => acc + (s.percentage ?? 0), 0) / total) : 0;
  const highest = total > 0 ? Math.max(...submissions.map((s) => s.percentage ?? 0)) : 0;

  let textLeft = 14;
  const logo = b?.logoUrl || b?.appIconUrl;
  if (logo && (logo.startsWith('data:image/') || logo.startsWith('http') || logo.startsWith('/'))) {
    try { doc.addImage(logo, 14, 10, 16, 16); textLeft = 34; } catch {}
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  doc.text(schoolName, textLeft, 16);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 90, 100);
  if (b?.motto) doc.text(`"${b.motto}"`, textLeft, 21);

  const startMetaY = b?.motto ? 26 : 22;
  doc.text(`Official Result Sheet: ${assessment.title}`, textLeft, startMetaY);
  doc.text(`Subject: ${assessment.subject} | Classes: ${assessment.targetClasses.join(', ')} | Session: ${assessment.session || 'Current'}`, textLeft, startMetaY + 5);
  doc.text(`Total: ${total} | Passed: ${passedCount} | Failed: ${total - passedCount} | Average: ${avg}% | High: ${highest}%`, textLeft, startMetaY + 10);

  const sorted = [...submissions].sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0));
  const rows = sorted.map((s, idx) => {
    const pct = s.percentage ?? 0;
    return [
      String(idx + 1), s.studentName, s.classGroup || '-',
      `${s.score ?? 0} / ${s.totalPoints ?? assessment.questions?.length ?? 0}`,
      `${pct}%`, pct >= passingScore ? 'Passed' : 'Failed',
      s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '-',
    ];
  });

  autoTable(doc, {
    startY: Math.max(startMetaY + 15, 34),
    head: [['Rank', 'Candidate Name', 'Class', 'Score', 'Percentage', 'Status', 'Date']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: rgb, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'center', cellWidth: 24 },
      4: { halign: 'center', cellWidth: 24, fontStyle: 'bold' },
      5: { halign: 'center', cellWidth: 20 },
      6: { halign: 'center', cellWidth: 24 },
    },
  });

  return doc;
}

export function downloadAssessmentResultPdf(
  assessment: Assessment,
  submissions: Submission[],
  brandingOrName?: string | SchoolBrandingConfig,
  customFilename?: string,
  primaryColor?: string
): void {
  const doc = buildAssessmentResultPdf(assessment, submissions, brandingOrName, primaryColor);
  const cleanName = (customFilename || assessment.subject).replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${cleanName}_Results.pdf`);
}
