import { useState, useEffect } from 'react';
import { Student, LocalStore, apiClient, generateStudentCode } from '@cbt/shared';

import { generateSingleCode, generateBatchCodes } from './studentCodeGen';

const studentStore = new LocalStore<Student>('students');

export function useStudentStore() {
  const [students, setStudents] = useState<Student[]>([]);

  const refresh = async () => {
    try {
      if (await apiClient.isAvailable()) {
        const remote = await apiClient.getStudents();
        setStudents(remote);
        await studentStore.clear();
        if (remote.length > 0) await studentStore.saveBatch(remote);
        return;
      }
    } catch {}
    setStudents(await studentStore.getAll());
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    const onFocus = () => { refresh(); };
    window.addEventListener('focus', onFocus);
    window.addEventListener('cbt:server-changed', refresh);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('cbt:server-changed', refresh);
    };
  }, []);

  const saveStudent = async (data: { name: string; educationLevel: any; classGroup: string; department?: any }) => {
    let saved: Student;
    const item = { ...data, id: `stu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, createdAt: new Date().toISOString() };
    try {
      saved = (await apiClient.isAvailable()) ? await apiClient.saveStudent(item) : (item as Student);
    } catch { saved = item as Student; }
    await studentStore.save(saved);
    setStudents(await studentStore.getAll());
    return { success: true, message: 'Student registered successfully.', student: saved };
  };

  const generateCodeForStudent = async (studentId: string): Promise<string> => {
    const res = await generateSingleCode(studentId, students, studentStore);
    setStudents(res.updatedStudents);
    return res.code;
  };

  const generateCodesForStudents = async (studentIds: string[]): Promise<{ success: boolean; message: string }> => {
    const res = await generateBatchCodes(studentIds, students, studentStore);
    setStudents(res.updatedStudents);
    return { success: res.success, message: res.message };
  };

  const generateAllCodes = (filterClass?: string) =>
    generateCodesForStudents((filterClass ? students.filter((s) => s.classGroup === filterClass) : students).map((s) => s.id));

  const deleteStudent = async (id: string) => {
    try { if (await apiClient.isAvailable()) await apiClient.deleteStudent(id); } catch {}
    await studentStore.delete(id);
    setStudents(await studentStore.getAll());
    return { success: true, message: 'Student record removed.' };
  };

  return { students, refresh, saveStudent, generateCodeForStudent, generateCodesForStudents, generateAllCodes, deleteStudent };
}
