import { Assessment, Submission, LocalStore, apiClient } from '@cbt/shared';

export interface ManagerSyncedData {
  assessments: Assessment[];
  submissions: Submission[];
}

function getTimestamp(a: Assessment): number {
  return new Date((a as any).updatedAt || a.createdAt || 0).getTime();
}

async function syncAssessmentsToRemote(
  local: Assessment[],
  remote: Assessment[]
): Promise<void> {
  const remoteMap = new Map((remote || []).map((a) => [a.id, a]));
  for (const item of local) {
    const rem = remoteMap.get(item.id);
    if (!rem) {
      try { await apiClient.createAssessment(item); } catch {}
    } else if (getTimestamp(item) > getTimestamp(rem)) {
      try { await apiClient.updateAssessment(item.id, item); } catch {}
    }
  }
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

      const localAssessments = await assessmentStore.getAll();
      await syncAssessmentsToRemote(localAssessments, remoteAssessments);

      const assMap = new Map<string, Assessment>();
      (remoteAssessments || []).forEach((a) => assMap.set(a.id, a));
      localAssessments.forEach((local) => {
        const rem = assMap.get(local.id);
        if (!rem || getTimestamp(local) >= getTimestamp(rem)) {
          assMap.set(local.id, local);
        }
      });
      const mergedAssessments = Array.from(assMap.values());
      if (mergedAssessments.length > 0) await assessmentStore.saveBatch(mergedAssessments);

      const localSubs = await submissionStore.getAll();
      const subMap = new Map<string, Submission>();
      localSubs.forEach((s) => subMap.set(s.id, s));
      (remoteSubs || []).forEach((s) => subMap.set(s.id, s));
      const mergedSubs = Array.from(subMap.values());
      if (mergedSubs.length > 0) await submissionStore.saveBatch(mergedSubs);

      return { assessments: mergedAssessments, submissions: mergedSubs };
    }
  } catch {}

  const localAssessments = await assessmentStore.getAll();
  const localSubs = await submissionStore.getAll();
  return { assessments: localAssessments, submissions: localSubs };
}
