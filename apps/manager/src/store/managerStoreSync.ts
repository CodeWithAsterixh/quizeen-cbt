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

      const safeAssessments = remoteAssessments || [];
      const safeSubs = remoteSubs || [];

      // Refresh local store to mirror current active server only
      await assessmentStore.clear();
      if (safeAssessments.length > 0) await assessmentStore.saveBatch(safeAssessments);

      await submissionStore.clear();
      if (safeSubs.length > 0) await submissionStore.saveBatch(safeSubs);

      return { assessments: safeAssessments, submissions: safeSubs };
    }
  } catch {}

  // Offline fallback: only use local storage if server is unreachable
  const localAssessments = await assessmentStore.getAll();
  const localSubs = await submissionStore.getAll();
  return { assessments: localAssessments, submissions: localSubs };
}
