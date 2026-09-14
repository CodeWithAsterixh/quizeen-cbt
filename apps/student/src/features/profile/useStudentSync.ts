import { useState, useEffect, useCallback } from 'react';
import { StudentSession, apiClient } from '@cbt/shared';

export function useStudentSync(
  session: StudentSession | null,
  setSession: React.Dispatch<React.SetStateAction<StudentSession | null>>,
  refresh: () => Promise<void>
) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const syncStudent = useCallback(async () => {
    if (!session?.studentCode) return;
    try {
      if (await apiClient.isAvailable()) {
        const s = await apiClient.getStudentByCode(session.studentCode);
        if (s) {
          setSession((p) => (p ? {
            ...p,
            studentName: s.name,
            classGroup: s.classGroup,
            department: s.department,
            educationLevel: s.educationLevel,
          } : null));
        }
      }
    } catch {}
  }, [session?.studentCode, setSession]);

  useEffect(() => {
    if (!session?.studentCode) return;
    syncStudent();
    const interval = setInterval(syncStudent, 4000);
    return () => clearInterval(interval);
  }, [session?.studentCode, syncStudent]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refresh(), syncStudent()]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  return { isRefreshing, handleRefresh, syncStudent };
}
