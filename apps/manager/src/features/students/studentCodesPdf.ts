import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, SchoolBrandingConfig } from '@cbt/shared';

function hexToRgb(hex = '#059669'): [number, number, number] {
  const c = hex.replace('#', '');
  if (c.length === 6) {
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  }
  return [5, 150, 105];
}

export function buildStudentCodesPdf(
  students: Student[],
  classFilter?: string,
  branding?: SchoolBrandingConfig,
  primaryColor = '#059669'
): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const rgb = hexToRgb(primaryColor);
  const schoolName = (branding?.schoolName || 'CBT Assessment Portal').toUpperCase();
  const title = classFilter ? `Candidate Exam Login Slips: ${classFilter}` : 'Candidate Exam Login Slips: All Classes';
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  let textLeft = 14;
  const logo = branding?.logoUrl || branding?.appIconUrl;
  if (logo && (logo.startsWith('data:image/') || logo.startsWith('http') || logo.startsWith('/'))) {
    try {
      doc.addImage(logo, 14, 10, 16, 16);
      textLeft = 34;
    } catch {}
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  doc.text(schoolName, textLeft, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 90, 100);
  if (branding?.motto) doc.text(`"${branding.motto}"`, textLeft, 21);

  const metaY = branding?.motto ? 26 : 22;
  doc.text(`${title} | Total Candidates: ${students.length} | Generated: ${dateStr}`, textLeft, metaY);

  const rows = students.map((s, idx) => [
    String(idx + 1),
    s.name,
    s.classGroup || '-',
    s.department || '-',
    s.code || 'NO CODE',
    '',
  ]);

  autoTable(doc, {
    startY: Math.max(metaY + 6, 32),
    head: [['S/N', 'Candidate Name', 'Class', 'Department', 'Exam Login ID', 'Signature']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: rgb, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { fontStyle: 'bold' },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'center', cellWidth: 26 },
      4: { halign: 'center', cellWidth: 32, font: 'courier', fontStyle: 'bold', textColor: rgb },
      5: { cellWidth: 34 },
    },
  });

  return doc;
}

export function downloadStudentCodesPdf(
  students: Student[],
  classFilter?: string,
  branding?: SchoolBrandingConfig,
  primaryColor?: string
): void {
  const doc = buildStudentCodesPdf(students, classFilter, branding, primaryColor);
  const cleanSchool = (branding?.schoolName || 'Students').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanFilter = (classFilter || 'All').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${cleanSchool}_Exam_Codes_${cleanFilter}.pdf`);
}
