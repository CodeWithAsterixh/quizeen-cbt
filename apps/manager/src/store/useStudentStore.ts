import { useState, useEffect } from 'react';
import { Student, LocalStore, apiClient, socketClient, getNextClassInfo, getPreviousClassInfo } from '@cbt/shared';
import { generateSingleCode, generateBatchCodes } from './studentCodeGen';

const studentStore = new LocalStore<Student>('students');

export function useStudentStore() {
  const [students, setStudents] = useState<Student[]>([]);

  const refresh = async () => {
    try {
      if (await apiClient.isAvailable()) {
        const remote = await apiClient.getStudents();
        const local = await studentStore.getAll();
        const map = new Map<string, Student>();
        local.forEach((s) => map.set(s.id, s));
        (remote || []).forEach((s) => map.set(s.id, s));
        const merged = Array.from(map.values());
        if (merged.length > 0) await studentStore.saveBatch(merged);
        setStudents(merged);
        return;
      }
    } catch {}
    setStudents(await studentStore.getAll());
  };

  useEffect(() => {
    refresh();
    const unsubStudents = socketClient.on('students:changed', refresh);
    const unsubConn = socketClient.onConnectionChange((c) => { if (c) refresh(); });
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      unsubStudents(); unsubConn();
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('cbt:server-changed', refresh);
    };
  }, []);

  const saveStudent = async (data: Partial<Student> & { name: string; educationLevel: any; classGroup: string; department?: any }) => {
    const existing = data.id ? students.find((s) => s.id === data.id) : null;
    const item: Student = {
      id: data.id || `stu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      code: existing?.code ?? data.code,
      name: data.name.trim(),
      educationLevel: data.educationLevel,
      classGroup: data.classGroup,
      department: data.department,
      createdAt: existing?.createdAt || data.createdAt || new Date().toISOString(),
    };
    let saved = item;
    try { if (await apiClient.isAvailable()) saved = await apiClient.saveStudent(item); } catch {}
    await studentStore.save(saved);
    setStudents(await studentStore.getAll());
    return { success: true, message: existing ? 'Student details updated.' : 'Student registered.', student: saved };
  };

  const moveStudentsClass = async (ids: string[], direction: 'next' | 'prev') => {
    const list = await studentStore.getAll();
    const updated = list.map((s) => {
      if (!ids.includes(s.id)) return s;
      const info = direction === 'next' ? getNextClassInfo(s.classGroup) : getPreviousClassInfo(s.classGroup);
      return { ...s, classGroup: info.nextClass, educationLevel: info.educationLevel };
    });
    await studentStore.saveBatch(updated);
    setStudents(updated);
    try {
      if (await apiClient.isAvailable()) {
        for (const s of updated.filter((st) => ids.includes(st.id))) await apiClient.saveStudent(s);
      }
    } catch {}
    return { success: true, message: `Moved ${ids.length} student(s) to ${direction === 'next' ? 'next' : 'previous'} class.` };
  };

  const generateCodeForStudent = async (id: string) => {
    const res = await generateSingleCode(id, students, studentStore);
    setStudents(res.updatedStudents);
    try { const s = res.updatedStudents.find((st) => st.id === id); if (s && (await apiClient.isAvailable())) await apiClient.saveStudent(s); } catch {}
    return res.code;
  };

  const generateCodesForStudents = async (ids: string[]) => {
    const res = await generateBatchCodes(ids, students, studentStore);
    setStudents(res.updatedStudents);
    try { if (await apiClient.isAvailable()) for (const t of res.updatedStudents.filter((s) => ids.includes(s.id))) await apiClient.saveStudent(t); } catch {}
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

  return { students, refresh, saveStudent, moveStudentsClass, generateCodeForStudent, generateCodesForStudents, generateAllCodes, deleteStudent };
}
