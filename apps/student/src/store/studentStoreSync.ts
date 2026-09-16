import { Assessment, Submission, LocalStore, apiClient } from '@cbt/shared';

async function pushOfflineSubmissions(
  localSubs: Submission[],
  remoteIds: Set<string>
): Promise<void> {
  const pending = localSubs.filter((s) => !remoteIds.has(s.id) && s.status !== 'in_progress');
  for (const sub of pending) {
    try {
      const answersRecord: Record<string, string> = {};
      Object.values(sub.answers || {}).forEach((a) => {
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
    } catch {}
  }
}

export async function fetchAndSyncStudentData(
  assessmentStore: LocalStore<Assessment>,
  submissionStore: LocalStore<Submission>
): Promise<{ assessments: Assessment[]; submissions: Submission[] }> {
  try {
    if (await apiClient.isAvailable()) {
      const [remoteAssessments, remoteSubs] = await Promise.all([
        apiClient.getAssessments(),
        apiClient.getSubmissions(),
      ]);

      const safeAssessments = remoteAssessments || [];
      const safeSubs = remoteSubs || [];
      const currentExamIds = new Set(safeAssessments.map((a) => a.id));

      // Push only offline submissions that actually belong to an assessment on this server
      const localSubs = await submissionStore.getAll();
      const relevantOfflineSubs = localSubs.filter((s) => currentExamIds.has(s.examId));
      const remoteIds = new Set(safeSubs.map((s) => s.id));
      if (relevantOfflineSubs.length > 0) {
        await pushOfflineSubmissions(relevantOfflineSubs, remoteIds);
      }

      // Overwrite local store to mirror current active server only
      await assessmentStore.clear();
      if (safeAssessments.length > 0) await assessmentStore.saveBatch(safeAssessments);

      await submissionStore.clear();
      if (safeSubs.length > 0) await submissionStore.saveBatch(safeSubs);

      return { assessments: safeAssessments, submissions: safeSubs };
    }
  } catch {}

  // Offline fallback: only use local storage if server is unreachable
  const [stored, storedSubs] = await Promise.all([
    assessmentStore.getAll(),
    submissionStore.getAll(),
  ]);
  return { assessments: stored, submissions: storedSubs };
}
