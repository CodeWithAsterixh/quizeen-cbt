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
      if (remote) {
        await assessmentStore.clear();
        if (remote.length > 0) await assessmentStore.saveBatch(remote);
      }
      if (remoteSubs) {
        await submissionStore.clear();
        if (remoteSubs.length > 0) await submissionStore.saveBatch(remoteSubs);
      }
      return { assessments: remote || [], submissions: remoteSubs || [] };
    }
  } catch {}

  const [stored, storedSubs] = await Promise.all([
    assessmentStore.getAll(),
    submissionStore.getAll(),
  ]);
  return { assessments: stored, submissions: storedSubs };
}
