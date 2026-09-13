import { useState, useEffect } from 'react';
import { Student, LocalStore, apiClient, generateStudentCode } from '@cbt/shared';

const studentStore = new LocalStore<Student>('students');

export function useStudentStore() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        if (await apiClient.isAvailable()) {
          const remote = await apiClient.getStudents();
          setStudents(remote);
          await studentStore.clear();
          if (remote.length > 0) await studentStore.saveBatch(remote);
          return;
        }
      } catch { /* fallback */ }
      setStudents(await studentStore.getAll());
    };
    init();
  }, []);

  const saveStudent = async (data: { name: string; educationLevel: any; classGroup: string; department?: any }) => {
    let saved: Student;
    const item = { ...data, id: `stu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, createdAt: new Date().toISOString() };
    try {
      saved = (await apiClient.isAvailable()) ? await apiClient.saveStudent(item) : (item as Student);
    } catch { saved = item as Student; }
    await studentStore.save(saved);
    setStudents(await studentStore.getAll());
    return saved;
  };

  const generateCodeForStudent = async (studentId: string): Promise<string> => {
    let newCode = '';
    try {
      if (await apiClient.isAvailable()) {
        const res = await apiClient.generateStudentCode(studentId);
        if (res?.code) newCode = res.code;
      }
    } catch { /* offline */ }
    if (!newCode) {
      const existing = new Set(students.filter((s) => s.code).map((s) => s.code!.toUpperCase()));
      newCode = generateStudentCode(existing);
    }
    const student = students.find((s) => s.id === studentId);
    if (student) {
      await studentStore.save({ ...student, code: newCode });
      setStudents(await studentStore.getAll());
    }
    return newCode;
  };

  const generateCodesForStudents = async (studentIds: string[]): Promise<void> => {
    try {
      if (await apiClient.isAvailable()) {
        const updated = await apiClient.generateAllStudentCodes(undefined, studentIds);
        if (updated?.length > 0) { setStudents(updated); await studentStore.saveBatch(updated); return; }
      }
    } catch { /* offline */ }
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
    setStudents(updated);
  };

  const generateAllCodes = (filterClass?: string) =>
    generateCodesForStudents((filterClass ? students.filter((s) => s.classGroup === filterClass) : students).map((s) => s.id));

  const deleteStudent = async (id: string) => {
    try { if (await apiClient.isAvailable()) await apiClient.deleteStudent(id); } catch { /* offline */ }
    await studentStore.delete(id);
    setStudents(await studentStore.getAll());
  };

  return { students, saveStudent, generateCodeForStudent, generateCodesForStudents, generateAllCodes, deleteStudent };
}
