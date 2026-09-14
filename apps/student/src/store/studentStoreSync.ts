import { Assessment, Submission, LocalStore, apiClient } from '@cbt/shared';

export async function fetchAndSyncStudentData(
  assessmentStore: LocalStore<Assessment>,
  submissionStore: LocalStore<Submission>
): Promise<{ assessments: Assessment[]; submissions: Submission[] }> {
  try {
    if (await apiClient.isAvailable()) {
      const [remote, remoteSubs] = await Promise.all([
        apiClient.getAssessments(),
        apiClient.getSubmissions(),
      ]);
      const stored = await assessmentStore.getAll();
      const mergedMap = new Map<string, Assessment>();
      stored.forEach((a) => mergedMap.set(a.id, a));
      if (remote) {
        remote.forEach((a) => mergedMap.set(a.id, a));
      }
      const mergedAssessments = Array.from(mergedMap.values());
      if (mergedAssessments.length > 0) {
        await assessmentStore.saveBatch(mergedAssessments);
      }

      if (remoteSubs) {
        await submissionStore.clear();
        if (remoteSubs.length > 0) await submissionStore.saveBatch(remoteSubs);
      }
      return { assessments: mergedAssessments, submissions: remoteSubs || [] };
    }
  } catch {}

  const [stored, storedSubs] = await Promise.all([
    assessmentStore.getAll(),
    submissionStore.getAll(),
  ]);
  return { assessments: stored, submissions: storedSubs };
}
