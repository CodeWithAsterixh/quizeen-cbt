import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Assessment, Submission } from '@cbt/shared';

export function buildAssessmentResultPdf(assessment: Assessment, submissions: Submission[], schoolName?: string): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const total = submissions.length;
  const passingScore = assessment.passingScore || 50;
  const passedCount = submissions.filter((s) => (s.percentage ?? 0) >= passingScore).length;
  const avg = total > 0 ? Math.round(submissions.reduce((acc, s) => acc + (s.percentage ?? 0), 0) / total) : 0;
  const highest = total > 0 ? Math.max(...submissions.map((s) => s.percentage ?? 0)) : 0;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text((schoolName || 'CBT Assessment System').toUpperCase(), 14, 18);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);
  doc.text(`Official Result Sheet: ${assessment.title}`, 14, 25);
  doc.text(`Subject: ${assessment.subject} | Classes: ${assessment.targetClasses.join(', ')} | Session: ${assessment.session || 'Current'}`, 14, 31);
  doc.text(`Total Candidates: ${total} | Passed: ${passedCount} | Failed: ${total - passedCount} | Average: ${avg}% | High: ${highest}%`, 14, 37);

  const sorted = [...submissions].sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0));
  const rows = sorted.map((s, idx) => {
    const pct = s.percentage ?? 0;
    const isPass = pct >= passingScore;
    return [
      String(idx + 1),
      s.studentName,
      s.classGroup || '-',
      `${s.score ?? 0} / ${s.totalPoints ?? assessment.questions?.length ?? 0}`,
      `${pct}%`,
      isPass ? 'Passed' : 'Failed',
      s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '-',
    ];
  });

  autoTable(doc, {
    startY: 43,
    head: [['Rank', 'Candidate Name', 'Class', 'Score', 'Percentage', 'Status', 'Date']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [5, 150, 105], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'center', cellWidth: 24 },
      4: { halign: 'center', cellWidth: 24 },
      5: { halign: 'center', cellWidth: 20 },
      6: { halign: 'center', cellWidth: 24 },
    },
  });

  return doc;
}

export function downloadAssessmentResultPdf(assessment: Assessment, submissions: Submission[], schoolName?: string): void {
  const doc = buildAssessmentResultPdf(assessment, submissions, schoolName);
  const cleanName = assessment.subject.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${cleanName}_Results.pdf`);
}
