import { useState, useEffect } from 'react';
import { Assessment, Submission, LocalStore, apiClient } from '@cbt/shared';

const assessmentStore = new LocalStore<Assessment>('exams');
const submissionStore = new LocalStore<Submission>('submissions');

export function useStudentAppStore() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        if (await apiClient.isAvailable()) {
          const remote = await apiClient.getAssessments();
          setAssessments(remote || []);
          await assessmentStore.clear();
          if (remote && remote.length > 0) {
            await assessmentStore.saveBatch(remote);
          }
          const remoteSubs = await apiClient.getSubmissions();
          setSubmissions(remoteSubs || []);
          await submissionStore.clear();
          if (remoteSubs && remoteSubs.length > 0) {
            await submissionStore.saveBatch(remoteSubs);
          }
          return;
        }
      } catch {
        // fallback to local storage
      }
      const stored = await assessmentStore.getAll();
      setAssessments(stored);
      setSubmissions(await submissionStore.getAll());
    };
    init();
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
          infractionCount: sub.infractionCount,
          totalElapsedSeconds: 0,
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
    setAssessments(await assessmentStore.getAll());
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
    assessments, exams: assessments,
    submissions,
    saveSubmission,
    importAssessments, importExams: importAssessments,
    resetToDefaults,
    clearAllAssessments, clearAllExams: clearAllAssessments,
  };
}

