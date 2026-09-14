import { useState } from 'react';
import { Student, LocalStore, apiClient } from '@cbt/shared';

const localStudentStore = new LocalStore<Student>('students');

export function useStudentLookup() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);

  const reset = () => {
    setCode('');
    setError('');
    setFoundStudent(null);
    setLoading(false);
  };

  const lookup = async (inputCode: string) => {
    const clean = inputCode.trim().toUpperCase();
    if (clean.length !== 6) return;
    setLoading(true);
    setError('');
    setFoundStudent(null);

    try {
      if (await apiClient.isAvailable()) {
        const res = await apiClient.lookupStudentByCode(clean);
        if (res.success && res.data) {
          setFoundStudent(res.data);
          return;
        }
        setError(res.message || `Student ID "${clean}" was not recognized. Please check with your teacher.`);
        return;
      }
      const local = await localStudentStore.getAll();
      const student = local.find((s) => s.code?.toUpperCase() === clean) || null;
      if (student) setFoundStudent(student);
      else setError(`Student ID "${clean}" was not found in offline records.`);
    } catch {
      setError('Could not reach the examination server. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return { code, setCode, loading, error, setError, foundStudent, setFoundStudent, reset, lookup };
}
