export interface GradeResult {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  remark: string;
  badgeColor: 'emerald' | 'blue' | 'amber' | 'rose';
}

export function getGradeAndRemark(pct: number): GradeResult {
  if (pct >= 75) return { grade: 'A', remark: 'Distinction', badgeColor: 'emerald' };
  if (pct >= 65) return { grade: 'B', remark: 'Very Good', badgeColor: 'blue' };
  if (pct >= 50) return { grade: 'C', remark: 'Credit', badgeColor: 'blue' };
  if (pct >= 40) return { grade: 'D', remark: 'Pass', badgeColor: 'amber' };
  return { grade: 'F', remark: 'Needs Support', badgeColor: 'rose' };
}

