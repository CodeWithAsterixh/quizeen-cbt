import crypto from 'node:crypto';
import JSZip from 'jszip';
import { ExamPackageManifest, Exam } from '@cbt/shared';
import { db } from '../../core/db/database.js';
import { CompilePackagePayload } from '../../core/types/contracts.js';

export class PackageService {
  public async compilePackage(payload: CompilePackagePayload): Promise<{ buffer: Buffer; filename: string }> {
    const zip = new JSZip();
    const exams = payload.examIds.map((id) => db.getExamById(id)).filter(Boolean) as Exam[];
    const examsContent = JSON.stringify(exams);
    const checksum = crypto.createHash('sha256').update(examsContent).digest('hex');

    const manifest: ExamPackageManifest = {
      packageId: `pkg_${Date.now()}`,
      packageName: payload.packageName,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      compiledBy: payload.compiledBy || { id: 'admin', name: 'Exam Administrator' },
      examCount: exams.length,
      targetClasses: Array.from(new Set(exams.flatMap((e) => e.targetClasses))),
      schedules: payload.schedules,
      checksum,
    };

    const examsFolder = zip.folder('exams');
    if (!examsFolder) throw new Error('Failed to create exams folder in ZIP');

    for (const exam of exams) {
      examsFolder.file(`${exam.id}.json`, JSON.stringify(exam, null, 2));
    }

    zip.file('manifest.json', JSON.stringify(manifest, null, 2));
    const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    const filename = `${payload.packageName.replace(/\s+/g, '_')}.zip`;

    return { buffer, filename };
  }

  public async unpackPackage(zipBuffer: Buffer): Promise<{ importedCount: number; packageId: string }> {
    const zip = await JSZip.loadAsync(zipBuffer);
    const manifestFile = zip.file('manifest.json');
    if (!manifestFile) throw new Error('Invalid package: manifest.json missing');

    const manifestText = await manifestFile.async('text');
    const manifest: ExamPackageManifest = JSON.parse(manifestText);

    let importedCount = 0;
    const examsFolder = zip.folder('exams');
    if (examsFolder) {
      for (const [filename, fileObj] of Object.entries(examsFolder.files)) {
        if (filename.endsWith('.json') && !fileObj.dir) {
          const content = await fileObj.async('text');
          const exam = JSON.parse(content) as Exam;
          db.saveExam(exam);
          importedCount++;
        }
      }
    }

    return { importedCount, packageId: manifest.packageId };
  }
}

export const packageService = new PackageService();
