import JSZip from 'jszip';
import { Assessment, Submission } from '@cbt/shared';
import { buildAssessmentResultPdf } from './assessmentResultPdf';

export async function exportBatchResultsZip(
  assessments: Assessment[],
  allSubmissions: Submission[],
  schoolName?: string,
  zipPrefix?: string
): Promise<void> {
  const zip = new JSZip();

  for (const assessment of assessments) {
    const examSubs = allSubmissions.filter((s) => s.examId === assessment.id);
    const pdf = buildAssessmentResultPdf(assessment, examSubs, schoolName);
    const pdfBlob = pdf.output('blob');
    const safeTitle = `${assessment.subject}_${assessment.targetClasses.join('-')}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    zip.file(`${safeTitle}_Results.pdf`, pdfBlob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  const baseName = (zipPrefix || 'Assessment').replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = `${baseName}_Results_${dateStr}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
