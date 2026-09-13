import { Student } from '@cbt/shared';

export function printStudentCodesPdf(students: Student[], classFilter?: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const title = classFilter ? `Student Exam Login Slips - ${classFilter}` : 'Student Exam Login Slips - All Classes';
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  const rows = students
    .map(
      (s, idx) => `
      <tr>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-weight: 600;">${s.name}</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${s.classGroup}</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${s.department || '-'}</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-size: 1.1rem; font-weight: 700; letter-spacing: 2px; color: #1e3a8a;">
          ${s.code || 'NO CODE'}
        </td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; min-width: 120px;"></td>
      </tr>`
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 12px; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 18px; font-weight: 800; text-transform: uppercase; margin: 0; }
          .meta { font-size: 11px; color: #475569; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #f1f5f9; padding: 8px 10px; border: 1px solid #94a3b8; text-align: left; font-size: 11px; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">Candidate Examination Login Slips</div>
            <div class="meta">${title} | Total Candidates: ${students.length}</div>
          </div>
          <div class="meta">Generated: ${dateStr}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 36px; text-align: center;">S/N</th>
              <th>Candidate Name</th>
              <th style="width: 80px; text-align: center;">Class</th>
              <th style="width: 100px; text-align: center;">Department</th>
              <th style="width: 130px; text-align: center;">Login ID (OTP)</th>
              <th style="width: 130px;">Signature</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}
