import { Student, LocalStore, apiClient, generateStudentCode } from '@cbt/shared';

export async function generateSingleCode(
  studentId: string,
  students: Student[],
  studentStore: LocalStore<Student>
): Promise<{ code: string; updatedStudents: Student[] }> {
  let newCode = '';
  const student = students.find((s) => s.id === studentId);
  try {
    if (await apiClient.isAvailable()) {
      const res = await apiClient.generateStudentCode(studentId, student);
      if (res?.code) newCode = res.code;
    }
  } catch {}
  if (!newCode) {
    const existing = new Set(students.filter((s) => s.code).map((s) => s.code!.toUpperCase()));
    newCode = generateStudentCode(existing);
  }
  if (student) {
    await studentStore.save({ ...student, code: newCode });
    const all = await studentStore.getAll();
    return { code: newCode, updatedStudents: all };
  }
  return { code: newCode, updatedStudents: students };
}

export async function generateBatchCodes(
  studentIds: string[],
  students: Student[],
  studentStore: LocalStore<Student>
): Promise<{ success: boolean; message: string; updatedStudents: Student[] }> {
  try {
    if (await apiClient.isAvailable()) {
      const updated = await apiClient.generateAllStudentCodes(undefined, studentIds);
      if (updated?.length > 0) {
        await studentStore.saveBatch(updated);
        return { success: true, message: 'Access codes generated for all selected students.', updatedStudents: updated };
      }
    }
  } catch {}
  const existing = new Set(students.filter((s) => s.code).map((s) => s.code!.toUpperCase()));
  const targetSet = new Set(studentIds);
  const updated = students.map((s) => {
    if (targetSet.has(s.id)) {
      const c = generateStudentCode(existing);
      existing.add(c);
      return { ...s, code: c };
    }
    return s;
  });
  await studentStore.saveBatch(updated);
  return { success: true, message: 'Access codes generated for all selected students.', updatedStudents: updated };
}
