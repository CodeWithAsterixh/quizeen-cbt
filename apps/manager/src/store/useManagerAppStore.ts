import { useState, useEffect } from 'react';
import { Assessment, Submission, LocalStore, apiClient } from '@cbt/shared';

const assessmentStore = new LocalStore<Assessment>('exams');
const submissionStore = new LocalStore<Submission>('submissions');

export function useManagerAppStore() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        if (await apiClient.isAvailable()) {
          const [remoteAssessments, remoteSubs] = await Promise.all([
            apiClient.getAssessments(),
            apiClient.getSubmissions(),
          ]);
          setAssessments(remoteAssessments);
          setSubmissions(remoteSubs);
          await assessmentStore.clear();
          if (remoteAssessments.length > 0) {
            await assessmentStore.saveBatch(remoteAssessments);
          }
          await submissionStore.clear();
          if (remoteSubs.length > 0) {
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

  const saveAssessment = async (assessment: Assessment) => {
    try {
      if (await apiClient.isAvailable()) {
        const existing = assessments.find((e) => e.id === assessment.id);
        if (existing) {
          await apiClient.updateAssessment(assessment.id, assessment);
        } else {
          await apiClient.createAssessment(assessment);
        }
      }
    } catch {
      // offline save
    }
    await assessmentStore.save(assessment);
    setAssessments(await assessmentStore.getAll());
  };

  const deleteAssessment = async (id: string) => {
    try {
      if (await apiClient.isAvailable()) await apiClient.deleteAssessment(id);
    } catch {
      // offline delete
    }
    await assessmentStore.delete(id);
    setAssessments(await assessmentStore.getAll());
  };

  const duplicateAssessment = async (assessment: Assessment) => {
    const copy = { ...assessment, id: `assessment_${Date.now()}`, title: `${assessment.title} (Copy)`, createdAt: new Date().toISOString() };
    await saveAssessment(copy);
  };

  const updateSubmission = async (sub: Submission) => {
    try {
      if (await apiClient.isAvailable()) {
        const answersRecord: Record<string, { awardedPoints: number }> = {};
        Object.values(sub.answers).forEach((a) => {
          answersRecord[a.questionId] = { awardedPoints: a.awardedPoints ?? 0 };
        });
        await apiClient.gradeSubmission(sub.id, answersRecord);
      }
    } catch {
      // offline grade save
    }
    await submissionStore.save(sub);
    setSubmissions(await submissionStore.getAll());
  };

  return {
    assessments, exams: assessments,
    submissions,
    saveAssessment, saveExam: saveAssessment,
    deleteAssessment, deleteExam: deleteAssessment,
    duplicateAssessment, duplicateExam: duplicateAssessment,
    updateSubmission,
  };
}
