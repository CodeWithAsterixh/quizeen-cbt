import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, SchoolBrandingConfig } from '@cbt/shared';
import { preparePdfLogo } from '../grading/pdfLogoHelper';

function hexToRgb(hex = '#059669'): [number, number, number] {
  const c = hex.replace('#', '');
  return c.length === 6 ? [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)] : [5, 150, 105];
}

export function buildStudentCodesPdf(
  students: Student[], classFilter?: string, branding?: SchoolBrandingConfig,
  primaryColor = '#059669', preparedLogo?: string
): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const rgb = hexToRgb(primaryColor), school = (branding?.schoolName || 'CBT Assessment Portal').toUpperCase();
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const logo = preparedLogo || branding?.logoUrl || branding?.appIconUrl;
  let textLeft = 14;

  if (logo) {
    try {
      doc.setFillColor(255, 255, 255); doc.roundedRect(13, 9, 20, 20, 1, 1, 'F');
      doc.addImage(logo, logo.startsWith('data:image/png') ? 'PNG' : 'JPEG', 14, 10, 18, 18); textLeft = 36;
    } catch {}
  }

  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(rgb[0], rgb[1], rgb[2]); doc.text(school, textLeft, 15);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(71, 85, 105);
  doc.text('Official Candidate Examination Login Slips', textLeft, 20);
  if (branding?.motto) { doc.setFont('helvetica', 'italic'); doc.setFontSize(7.5); doc.setTextColor(100, 116, 139); doc.text(`"${branding.motto}"`, textLeft, 24.5); }

  const cardY = branding?.motto ? 38 : 34;
  doc.setFillColor(248, 250, 252); doc.setDrawColor(226, 232, 240); doc.roundedRect(14, cardY, 182, 11, 1.5, 1.5, 'FD');
  const meta = [['TARGET CLASS', classFilter || 'All Classes'], ['TOTAL CANDIDATES', String(students.length)], ['STATUS', 'Verified Active'], ['DATE GENERATED', dateStr]];
  meta.forEach(([lbl, val], i) => {
    const x = 18 + i * 46;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(100, 116, 139); doc.text(lbl, x, cardY + 4);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(15, 23, 42); doc.text(val, x, cardY + 8.5);
  });

  const rows = students.map((s, idx) => [String(idx + 1), s.name, s.classGroup || '-', s.department || '-', s.code || 'NO CODE', '']);

  autoTable(doc, {
    startY: cardY + 15, head: [['S/N', 'Candidate Name', 'Class', 'Department', 'Exam Login ID', 'Signature']], body: rows,
    theme: 'grid', headStyles: { fillColor: rgb, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] }, alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 }, 1: { fontStyle: 'bold' }, 2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'center', cellWidth: 26 }, 4: { halign: 'center', cellWidth: 32, font: 'courier', fontStyle: 'bold', textColor: rgb },
      5: { cellWidth: 34 },
    },
    didDrawPage: (data) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(148, 163, 184);
      doc.text('Official Examination Slips - Powered by Queez CBT', 14, 290);
      doc.text(`Page ${data.pageNumber} of ${doc.getNumberOfPages()}`, 196, 290, { align: 'right' });
    },
  });
  return doc;
}

export async function downloadStudentCodesPdf(
  students: Student[], classFilter?: string, branding?: SchoolBrandingConfig, primaryColor?: string
): Promise<void> {
  const logo = await preparePdfLogo(branding?.logoUrl || branding?.appIconUrl);
  const doc = buildStudentCodesPdf(students, classFilter, branding, primaryColor, logo || undefined);
  const cleanSchool = (branding?.schoolName || 'Students').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanFilter = (classFilter || 'All').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${cleanSchool}_Exam_Codes_${cleanFilter}.pdf`);
}
