import { useState, useEffect } from 'react';
import { Assessment, Submission, LocalStore, apiClient, socketClient } from '@cbt/shared';

import { fetchAndSyncStudentData } from './studentStoreSync';

const assessmentStore = new LocalStore<Assessment>('exams');
const submissionStore = new LocalStore<Submission>('submissions');

export function useStudentAppStore() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const refresh = async () => {
    const data = await fetchAndSyncStudentData(assessmentStore, submissionStore);
    setAssessments(data.assessments);
    setSubmissions(data.submissions);
  };

  useEffect(() => {
    refresh();
    const unsubAss = socketClient.on('assessments:changed', refresh);
    const unsubSub = socketClient.on('submissions:changed', refresh);
    const unsubConn = socketClient.onConnectionChange((connected) => { if (connected) refresh(); });
    const onFocus = () => { refresh(); };
    window.addEventListener('focus', onFocus);
    window.addEventListener('cbt:server-changed', refresh);
    return () => {
      unsubAss();
      unsubSub();
      unsubConn();
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('cbt:server-changed', refresh);
    };
  }, []);

  const saveSubmission = async (sub: Submission) => {
    try {
      if (await apiClient.isAvailable()) {
        const answersRecord: Record<string, string> = {};
        Object.values(sub.answers).forEach((a) => {
          answersRecord[a.questionId] = a.selectedAnswer;
        });
        await apiClient.submitAnswers({
          studentName: sub.studentName,
          examId: sub.examId,
          classGroup: sub.classGroup,
          department: sub.department,
          answers: answersRecord,
          totalElapsedSeconds: sub.timeSpentSeconds ?? 0,
        });
      }
    } catch {
      // offline save fallback
    }
    await submissionStore.save(sub);
    setSubmissions(await submissionStore.getAll());
  };

  const importAssessments = async (items: Assessment[]) => {
    await assessmentStore.saveBatch(items);
    try {
      if (await apiClient.isAvailable()) {
        for (const item of items) {
          try { await apiClient.createAssessment(item); } catch {}
        }
      }
    } catch {}
    const all = await assessmentStore.getAll();
    setAssessments(all);
  };

  const resetToDefaults = async () => {
    await assessmentStore.clear();
    setAssessments([]);
  };

  const clearAllAssessments = async () => {
    await assessmentStore.clear();
    setAssessments([]);
  };

  return {
    assessments, exams: assessments, submissions, refresh,
    saveSubmission, importAssessments, importExams: importAssessments,
    resetToDefaults, clearAllAssessments, clearAllExams: clearAllAssessments,
  };
}

