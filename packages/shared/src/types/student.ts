import { EducationLevel, Department } from './education.js';

export interface Student {
  id: string;
  code?: string;
  name: string;
  educationLevel: EducationLevel;
  classGroup: string;
  department?: Department;
  createdAt: string;
}

const CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateStudentCode(existingCodes?: Set<string>): string {
  let code = '';
  for (let attempt = 0; attempt < 50; attempt++) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    if (!existingCodes || !existingCodes.has(code.toUpperCase())) {
      return code;
    }
  }
  return code;
}
