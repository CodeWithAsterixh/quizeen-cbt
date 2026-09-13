import { Assessment, Submission, EDUCATION_LEVELS } from '@cbt/shared';
import { ClassSummary, ClassSubjectSummary, StudentClassSummary } from './analytics-types';
import { getGradeAndRemark } from './grade-utils';

export function buildClassSummaries(exams: Assessment[], submissions: Submission[]): ClassSummary[] {
  const allClassNames = new Set<string>();
  EDUCATION_LEVELS.forEach((lvl) => lvl.classes.forEach((c) => allClassNames.add(c)));
  exams.forEach((e) => e.targetClasses?.forEach((c) => c !== 'All' && allClassNames.add(c)));
  submissions.forEach((s) => s.classGroup && allClassNames.add(s.classGroup));

  const list: ClassSummary[] = Array.from(allClassNames).map((cName) => {
    const classSubs = submissions.filter((s) => s.classGroup === cName);
    const uniqueStudents = new Set(classSubs.map((s) => s.studentName.trim().toLowerCase())).size;
    const classExams = exams.filter((e) => e.targetClasses?.includes(cName) || e.targetClasses?.includes('All'));
    const totalSub = classSubs.length;
    const avg = totalSub > 0 ? Math.round(classSubs.reduce((acc, s) => acc + s.percentage, 0) / totalSub) : 0;
    const passed = classSubs.filter((s) => s.percentage >= 50).length;
    const passRate = totalSub > 0 ? Math.round((passed / totalSub) * 100) : 0;
    const lvl = EDUCATION_LEVELS.find((l) => l.classes.includes(cName));

    return {
      id: cName, className: cName, educationLevel: lvl?.name,
      studentsCount: uniqueStudents, subjectsCount: classExams.length,
      totalSubmissions: totalSub, averageScore: avg, passRate,
    };
  });

  return list.sort((a, b) => b.totalSubmissions - a.totalSubmissions || a.className.localeCompare(b.className));
}

export function buildClassSubjectSummaries(cName: string, exams: Assessment[], submissions: Submission[]): ClassSubjectSummary[] {
  const classExams = exams.filter((e) => e.targetClasses?.includes(cName) || e.targetClasses?.includes('All'));
  return classExams.map((exam) => {
    const subs = submissions.filter((s) => s.examId === exam.id && (s.classGroup === cName || !s.classGroup));
    const total = subs.length;
    const avg = total > 0 ? Math.round(subs.reduce((a, s) => a + s.percentage, 0) / total) : 0;
    const passed = subs.filter((s) => s.percentage >= (exam.passingScore || 50)).length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    const highest = total > 0 ? Math.max(...subs.map((s) => s.percentage)) : 0;
    const lowest = total > 0 ? Math.min(...subs.map((s) => s.percentage)) : 0;

    return {
      subjectId: exam.id, subjectName: exam.subject, assessmentType: exam.assessmentType ?? 'test',
      totalPoints: exam.totalPoints, passingScore: exam.passingScore || 50,
      submissionsCount: total, averageScore: avg, passRate, highestScore: highest, lowestScore: lowest,
    };
  });
}

export function buildStudentSummaries(cName: string, submissions: Submission[]): StudentClassSummary[] {
  const classSubs = submissions.filter((s) => s.classGroup === cName);
  const byStudent = new Map<string, Submission[]>();
  classSubs.forEach((s) => {
    const key = s.studentName.trim();
    if (!byStudent.has(key)) byStudent.set(key, []);
    byStudent.get(key)!.push(s);
  });

  return Array.from(byStudent.entries()).map(([name, subs]) => {
    const avg = Math.round(subs.reduce((a, s) => a + s.percentage, 0) / subs.length);
    const { grade, remark, badgeColor } = getGradeAndRemark(avg);
    const passed = subs.filter((s) => s.percentage >= 50).length;
    const infractions = subs.reduce((a, s) => a + (s.infractionCount || 0), 0);
    return {
      studentName: name, classGroup: cName, department: subs[0]?.department,
      submissionsCount: subs.length, averagePercentage: avg,
      grade, remark, badgeColor, infractions,
      passedCount: passed, failedCount: subs.length - passed,
    };
  }).sort((a, b) => b.averagePercentage - a.averagePercentage);
}

