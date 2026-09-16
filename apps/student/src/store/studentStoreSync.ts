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

      const localSubs = await submissionStore.getAll();
      const remoteIds = new Set((remoteSubs || []).map((s) => s.id));
      await pushOfflineSubmissions(localSubs, remoteIds);

      const subMap = new Map<string, Submission>();
      localSubs.forEach((s) => subMap.set(s.id, s));
      (remoteSubs || []).forEach((s) => subMap.set(s.id, s));
      const mergedSubs = Array.from(subMap.values());
      if (mergedSubs.length > 0) await submissionStore.saveBatch(mergedSubs);

      const localAssessments = await assessmentStore.getAll();
      const assMap = new Map<string, Assessment>();
      localAssessments.forEach((a) => assMap.set(a.id, a));
      (remoteAssessments || []).forEach((a) => assMap.set(a.id, a));
      const mergedAssessments = Array.from(assMap.values());
      if (mergedAssessments.length > 0) await assessmentStore.saveBatch(mergedAssessments);

      return { assessments: mergedAssessments, submissions: mergedSubs };
    }
  } catch {}

  const [stored, storedSubs] = await Promise.all([
    assessmentStore.getAll(),
    submissionStore.getAll(),
  ]);
  return { assessments: stored, submissions: storedSubs };
}
