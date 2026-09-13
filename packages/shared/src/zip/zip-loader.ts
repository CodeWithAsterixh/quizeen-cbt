import JSZip from 'jszip';
import { Exam, ExamPackageManifest } from '../types/index.js';
import { computeChecksum } from './zip-checksum.js';

export interface UnpackZipResult {
  success: boolean;
  message: string;
  manifest?: ExamPackageManifest;
  exams?: Exam[];
}

export async function unpackExamZip(data: ArrayBuffer | Blob): Promise<UnpackZipResult> {
  try {
    const zip = await JSZip.loadAsync(data);
    const manifestFile = zip.file('manifest.json');
    const examsFile = zip.file('exams.json');

    if (!manifestFile || !examsFile) {
      return {
        success: false,
        message: 'Invalid exam package: missing manifest.json or exams.json inside ZIP archive.',
      };
    }

    const manifestRaw = await manifestFile.async('text');
    const examsRaw = await examsFile.async('text');

    const manifest: ExamPackageManifest = JSON.parse(manifestRaw);
    const calculatedHash = await computeChecksum(examsRaw);

    if (calculatedHash !== manifest.checksum) {
      return {
        success: false,
        message: 'Security validation failed: package contents have been tampered with or corrupted.',
      };
    }

    const exams: Exam[] = JSON.parse(examsRaw);
    if (!Array.isArray(exams) || exams.length === 0) {
      return {
        success: false,
        message: 'The package was verified but contains no valid exams.',
      };
    }

    return {
      success: true,
      message: `Successfully verified and unpacked ${exams.length} exam(s) from "${manifest.packageName}".`,
      manifest,
      exams,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown ZIP extraction error';
    return { success: false, message: `Failed to unpack package: ${msg}` };
  }
}

export const unpackAssessmentPackage = unpackExamZip;
export type UnpackPackageResult = UnpackZipResult;
