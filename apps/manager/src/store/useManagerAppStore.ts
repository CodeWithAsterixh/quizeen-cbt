import { useState, useEffect, useCallback } from 'react';
import { Assessment, Submission, LocalStore, apiClient } from '@cbt/shared';
import { fetchAndSyncManagerData } from './managerStoreSync';

const assessmentStore = new LocalStore<Assessment>('exams');
const submissionStore = new LocalStore<Submission>('submissions');

export function useManagerAppStore() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const refresh = useCallback(async () => {
    setIsSyncing(true);
    const data = await fetchAndSyncManagerData(assessmentStore, submissionStore);
    setAssessments(data.assessments);
    setSubmissions(data.submissions);
    setIsSyncing(false);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    const onFocus = () => { refresh(); };
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [refresh]);

  const saveAssessment = async (assessment: Assessment): Promise<{ success: boolean; message: string }> => {
    let message = 'Assessment updates saved successfully.';
    try {
      if (await apiClient.isAvailable()) {
        const existing = assessments.find((e) => e.id === assessment.id);
        const res = existing ? await apiClient.updateAssessment(assessment.id, assessment) : await apiClient.createAssessment(assessment);
        if (res?.message) message = res.message;
      }
    } catch {}
    await assessmentStore.save(assessment);
    setAssessments(await assessmentStore.getAll());
    return { success: true, message };
  };

  const deleteAssessment = async (id: string): Promise<{ success: boolean; message: string }> => {
    let message = 'Assessment was removed successfully.';
    try {
      if (await apiClient.isAvailable()) {
        const res = await apiClient.deleteAssessment(id);
        if (res?.message) message = res.message;
      }
    } catch {}
    await assessmentStore.delete(id);
    setAssessments(await assessmentStore.getAll());
    return { success: true, message };
  };

  const duplicateAssessment = async (assessment: Assessment) => {
    const copy = { ...assessment, id: `assessment_${Date.now()}`, title: `${assessment.title} (Copy)`, createdAt: new Date().toISOString() };
    await saveAssessment(copy);
  };

  const updateSubmission = async (sub: Submission): Promise<{ success: boolean; message: string }> => {
    let message = 'Grades and review updated successfully.';
    try {
      if (await apiClient.isAvailable()) {
        const answersRecord: Record<string, { awardedPoints: number }> = {};
        Object.values(sub.answers).forEach((a) => { answersRecord[a.questionId] = { awardedPoints: a.awardedPoints ?? 0 }; });
        const res = await apiClient.gradeSubmission(sub.id, answersRecord);
        if (res?.message) message = res.message;
      }
    } catch {}
    await submissionStore.save(sub);
    setSubmissions(await submissionStore.getAll());
    return { success: true, message };
  };

  return {
    assessments, exams: assessments, submissions, isSyncing, refresh,
    saveAssessment, saveExam: saveAssessment,
    deleteAssessment, deleteExam: deleteAssessment,
    duplicateAssessment, duplicateExam: duplicateAssessment,
    updateSubmission,
  };
}
