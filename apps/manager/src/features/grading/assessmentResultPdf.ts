import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Assessment, Submission, SchoolBrandingConfig, getGradeAndRemark } from '@cbt/shared';
import { preparePdfLogo } from './pdfLogoHelper';

function hexToRgb(hex = '#059669'): [number, number, number] {
  const c = hex.replace('#', '');
  return c.length === 6 ? [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)] : [5, 150, 105];
}

export function buildAssessmentResultPdf(
  assessment: Assessment, submissions: Submission[], brandingOrName?: string | SchoolBrandingConfig,
  primaryColor = '#059669', preparedLogo?: string
): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const b = typeof brandingOrName === 'object' ? brandingOrName : (brandingOrName ? { schoolName: brandingOrName } as SchoolBrandingConfig : undefined);
  const rgb = hexToRgb(primaryColor), school = (b?.schoolName || 'CBT Assessment System').toUpperCase();
  const total = submissions.length, passScore = assessment.passingScore || 50;
  const passed = submissions.filter((s) => (s.percentage ?? 0) >= passScore).length;
  const avg = total > 0 ? Math.round(submissions.reduce((a, s) => a + (s.percentage ?? 0), 0) / total) : 0;
  const high = total > 0 ? Math.max(...submissions.map((s) => s.percentage ?? 0)) : 0;
  const logo = preparedLogo || b?.logoUrl || b?.appIconUrl;
  let textLeft = 14;

  if (logo) {
    try {
      doc.setFillColor(255, 255, 255); doc.roundedRect(13, 9, 20, 20, 1, 1, 'F');
      doc.addImage(logo, logo.startsWith('data:image/png') ? 'PNG' : 'JPEG', 14, 10, 18, 18); textLeft = 36;
    } catch {}
  }
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(rgb[0], rgb[1], rgb[2]); doc.text(school, textLeft, 15);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(71, 85, 105);
  doc.text(`Results: ${assessment.title}`, textLeft, 20);
  if (b?.motto) { doc.setFont('helvetica', 'italic'); doc.setFontSize(7.5); doc.setTextColor(100, 116, 139); doc.text(`"${b.motto}"`, textLeft, 24.5); }

  const cardY = b?.motto ? 38 : 34;
  doc.setFillColor(248, 250, 252); doc.setDrawColor(226, 232, 240); doc.roundedRect(14, cardY, 182, 11, 1.5, 1.5, 'FD');
  const meta = [['SUBJECT', assessment.subject || '-'], ['CLASS', assessment.targetClasses.join(', ') || 'All Classes'], ['SESSION', assessment.session || 'Current Term'], ['PASS MARK', `${passScore}%`]];
  meta.forEach(([lbl, val], i) => {
    const x = 18 + i * 46;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(100, 116, 139); doc.text(lbl, x, cardY + 4);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(15, 23, 42); doc.text(val, x, cardY + 8.5);
  });

  const statsY = cardY + 15;
  const stats: [string, string, [number, number, number]][] = [['STUDENTS', String(total), [15, 23, 42]], ['PASSED', String(passed), [16, 185, 129]], ['FAILED', String(total - passed), [239, 68, 68]], ['AVERAGE', `${avg}%`, [15, 23, 42]], ['HIGHEST', `${high}%`, rgb]];
  stats.forEach(([lbl, val, col], i) => {
    const bx = 14 + i * 37;
    doc.setFillColor(248, 250, 252); doc.setDrawColor(226, 232, 240); doc.roundedRect(bx, statsY, 34, 11, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(100, 116, 139); doc.text(lbl, bx + 17, statsY + 3.8, { align: 'center' });
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(col[0], col[1], col[2]); doc.text(val, bx + 17, statsY + 8.5, { align: 'center' });
  });

  const rows = [...submissions].sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0)).map((s, idx) => {
    const pct = s.percentage ?? 0;
    const { grade, remark } = getGradeAndRemark(pct, s.classGroup || assessment.targetClasses.join(' '));
    return [String(idx + 1), s.studentName, s.classGroup || '-', `${s.score ?? 0} / ${s.totalPoints ?? assessment.questions?.length ?? 0}`, `${pct}%`, grade, remark, pct >= passScore ? 'Passed' : 'Failed'];
  });

  autoTable(doc, {
    startY: statsY + 15, head: [['#', 'Student Name', 'Class', 'Score', '%', 'Grade', 'Remark', 'Status']], body: rows,
    theme: 'grid', headStyles: { fillColor: rgb, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] }, alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 0: { halign: 'center', cellWidth: 12 }, 2: { halign: 'center', cellWidth: 18 }, 3: { halign: 'center', cellWidth: 22 }, 4: { halign: 'center', cellWidth: 18, fontStyle: 'bold' }, 5: { halign: 'center', cellWidth: 16, fontStyle: 'bold' }, 6: { cellWidth: 28 }, 7: { halign: 'center', cellWidth: 22 } },
    didParseCell: (d) => {
      if (d.section === 'body' && d.column.index === 5) {
        const r = String(d.cell.raw);
        d.cell.styles.textColor = r.startsWith('A') ? [16, 185, 129] : (r.startsWith('B') || r.startsWith('C') ? [37, 99, 235] : (r.startsWith('D') || r.startsWith('E') ? [217, 119, 6] : [225, 29, 72]));
      }
      if (d.section === 'body' && d.column.index === 7) {
        d.cell.styles.textColor = d.cell.raw === 'Passed' ? [16, 185, 129] : [239, 68, 68]; d.cell.styles.fontStyle = 'bold';
      }
    },
    didDrawPage: (data) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(148, 163, 184);
      doc.text('Powered by Queez CBT', 14, 290);
      doc.text(`Page ${data.pageNumber} of ${doc.getNumberOfPages()}`, 196, 290, { align: 'right' });
    },
  });
  return doc;
}

export async function downloadAssessmentResultPdf(
  assessment: Assessment, submissions: Submission[], brandingOrName?: string | SchoolBrandingConfig,
  customFilename?: string, primaryColor?: string
): Promise<void> {
  const b = typeof brandingOrName === 'object' ? brandingOrName : undefined;
  const logo = await preparePdfLogo(b?.logoUrl || b?.appIconUrl);
  const doc = buildAssessmentResultPdf(assessment, submissions, brandingOrName, primaryColor, logo || undefined);
  const cleanName = (customFilename || assessment.subject).replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${cleanName}_Results.pdf`);
}
