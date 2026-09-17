export type GradeType = 'A' | 'B' | 'C' | 'D' | 'F' | 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9';

export interface GradeResult {
  grade: GradeType;
  remark: string;
  badgeColor: 'emerald' | 'blue' | 'amber' | 'rose';
}

export function _basicGrades(pct: number): GradeResult {
  if (pct >= 75) return { grade: 'A', remark: 'Distinction', badgeColor: 'emerald' };
  if (pct >= 65) return { grade: 'B', remark: 'Very Good', badgeColor: 'blue' };
  if (pct >= 50) return { grade: 'C', remark: 'Credit', badgeColor: 'blue' };
  if (pct >= 40) return { grade: 'D', remark: 'Pass', badgeColor: 'amber' };
  return { grade: 'F', remark: 'Fail', badgeColor: 'rose' };
}

export function _higherGrades(pct: number): GradeResult {
  if (pct >= 75) return { grade: 'A1', remark: 'Distinction', badgeColor: 'emerald' };
  if (pct >= 70) return { grade: 'B2', remark: 'Very Good', badgeColor: 'blue' };
  if (pct >= 65) return { grade: 'B3', remark: 'Good', badgeColor: 'blue' };
  if (pct >= 60) return { grade: 'C4', remark: 'Credit', badgeColor: 'blue' };
  if (pct >= 55) return { grade: 'C5', remark: 'Credit', badgeColor: 'blue' };
  if (pct >= 50) return { grade: 'C6', remark: 'Credit', badgeColor: 'blue' };
  if (pct >= 45) return { grade: 'D7', remark: 'Pass', badgeColor: 'amber' };
  if (pct >= 40) return { grade: 'E8', remark: 'Pass', badgeColor: 'amber' };
  return { grade: 'F9', remark: 'Fail', badgeColor: 'rose' };
}

export function isSeniorOrExternal(levelOrClass?: string): boolean {
  if (!levelOrClass) return false;
  const s = levelOrClass.trim().toLowerCase();
  if (s.includes('senior') || s.includes('sss') || s.includes('ss ') || s.includes('external') || s.includes('jamb') || s.includes('waec') || s.includes('neco') || s.includes('gce')) {
    return true;
  }
  return false;
}

export function getGradeAndRemark(pct: number, levelOrClass?: string): GradeResult {
  if (isSeniorOrExternal(levelOrClass)) {
    return _higherGrades(pct);
  }
  return _basicGrades(pct);
}
