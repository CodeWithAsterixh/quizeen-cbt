import { EducationLevel } from './education.js';

export interface ClassProgressionInfo {
  nextClass: string;
  educationLevel: EducationLevel;
  isGraduated: boolean;
}

export const CLASS_SEQUENCE: Array<{ name: string; level: EducationLevel }> = [
  { name: 'Primary 1', level: 'primary' },
  { name: 'Primary 2', level: 'primary' },
  { name: 'Primary 3', level: 'primary' },
  { name: 'Primary 4', level: 'primary' },
  { name: 'Primary 5', level: 'primary' },
  { name: 'Primary 6', level: 'primary' },
  { name: 'JSS 1', level: 'junior_secondary' },
  { name: 'JSS 2', level: 'junior_secondary' },
  { name: 'JSS 3', level: 'junior_secondary' },
  { name: 'SSS 1', level: 'senior_secondary' },
  { name: 'SSS 2', level: 'senior_secondary' },
  { name: 'SSS 3', level: 'senior_secondary' },
];

export const ALL_CLASSES = [
  ...CLASS_SEQUENCE.map((c) => c.name),
  'Graduated',
];

export function getNextClassInfo(currentClass: string): ClassProgressionInfo {
  const norm = currentClass.trim().toLowerCase();
  const idx = CLASS_SEQUENCE.findIndex((c) => c.name.toLowerCase() === norm);
  if (idx >= 0 && idx < CLASS_SEQUENCE.length - 1) {
    const nxt = CLASS_SEQUENCE[idx + 1];
    return { nextClass: nxt.name, educationLevel: nxt.level, isGraduated: false };
  }
  if (idx === CLASS_SEQUENCE.length - 1) {
    return { nextClass: 'Graduated', educationLevel: 'senior_secondary', isGraduated: true };
  }
  return { nextClass: currentClass, educationLevel: 'junior_secondary', isGraduated: false };
}

export function getPreviousClassInfo(currentClass: string): ClassProgressionInfo {
  const norm = currentClass.trim().toLowerCase();
  if (norm === 'graduated') {
    return { nextClass: 'SSS 3', educationLevel: 'senior_secondary', isGraduated: false };
  }
  const idx = CLASS_SEQUENCE.findIndex((c) => c.name.toLowerCase() === norm);
  if (idx > 0) {
    const prev = CLASS_SEQUENCE[idx - 1];
    return { nextClass: prev.name, educationLevel: prev.level, isGraduated: false };
  }
  return { nextClass: currentClass, educationLevel: 'primary', isGraduated: false };
}
