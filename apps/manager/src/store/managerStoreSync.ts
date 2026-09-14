import { Assessment, Submission, LocalStore, apiClient } from '@cbt/shared';

export interface ManagerSyncedData {
  assessments: Assessment[];
  submissions: Submission[];
}

export async function fetchAndSyncManagerData(
  assessmentStore: LocalStore<Assessment>,
  submissionStore: LocalStore<Submission>
): Promise<ManagerSyncedData> {
  try {
    if (await apiClient.isAvailable()) {
      const [remoteAssessments, remoteSubs] = await Promise.all([
        apiClient.getAssessments(),
        apiClient.getSubmissions(),
      ]);

      await assessmentStore.clear();
      if (remoteAssessments.length > 0) await assessmentStore.saveBatch(remoteAssessments);
      await submissionStore.clear();
      if (remoteSubs.length > 0) await submissionStore.saveBatch(remoteSubs);

      return { assessments: remoteAssessments, submissions: remoteSubs };
    }
  } catch {}

  const localAssessments = await assessmentStore.getAll();
  const localSubs = await submissionStore.getAll();
  return { assessments: localAssessments, submissions: localSubs };
}
