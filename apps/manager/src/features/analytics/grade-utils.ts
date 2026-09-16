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
  return { grade: 'F', remark: 'Fail', badgeColor: 'rose' };
}

export function _basicGrades(pct: number): GradeResult {
  if (pct >= 75) return { grade: 'A', remark: 'Distinction', badgeColor: 'emerald' };
  if (pct >= 65) return { grade: 'B', remark: 'Very Good', badgeColor: 'blue' };
  if (pct >= 50) return { grade: 'C', remark: 'Credit', badgeColor: 'blue' };
  if (pct >= 40) return { grade: 'D', remark: 'Pass', badgeColor: 'amber' };
  return { grade: 'F', remark: 'Fail', badgeColor: 'rose' };
}
// export function _higherGrades(pct: number): GradeResult {
//   if (pct >= 75) return { grade: 'A', remark: 'Distinction', badgeColor: 'emerald' };
//   if (pct >= 75) return { grade: 'B1', remark: 'Distinction', badgeColor: 'emerald' };
//   if (pct >= 65) return { grade: 'B2', remark: 'Very Good', badgeColor: 'blue' };
//   if (pct >= 50) return { grade: 'B3', remark: 'Credit', badgeColor: 'blue' };
//   if (pct >= 50) return { grade: 'C4', remark: 'Credit', badgeColor: 'blue' };
//   if (pct >= 50) return { grade: 'C5', remark: 'Credit', badgeColor: 'blue' };
//   if (pct >= 50) return { grade: 'C6', remark: 'Credit', badgeColor: 'blue' };
//   if (pct >= 40) return { grade: 'C7', remark: 'Pass', badgeColor: 'amber' };
//   if (pct >= 40) return { grade: 'D8', remark: 'Pass', badgeColor: 'amber' };
//   return { grade: 'F9', remark: 'Fail', badgeColor: 'rose' };
// }