import { Submission, Department } from '../types/index.js';
import { createIdempotencyKey } from '../utils/idempotency.js';
import { serverConfig } from './server-config.js';

export const submissionApi = {
  async submitAnswers(payload: {
    studentName: string; examId: string; classGroup: string; department?: Department;
    answers: Record<string, string>; infractionCount?: number; totalElapsedSeconds: number;
  }): Promise<{ data: Submission; message: string; statusCode: number }> {
    const res = await fetch(`${serverConfig.getApiBase()}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'idempotency-key': createIdempotencyKey(`sub_${payload.studentName}_${payload.examId}`),
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return { data: json.data, message: json.message || '', statusCode: json.statusCode ?? res.status };
  },

  async getSubmissions(examId?: string): Promise<Submission[]> {
    const sep = examId ? `?examId=${encodeURIComponent(examId)}&` : '?';
    const res = await fetch(`${serverConfig.getApiBase()}/submissions${sep}_t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!res.ok) return [];
    return ((await res.json()) as any).data || [];
  },

  async gradeSubmission(id: string, answers: Record<string, { awardedPoints: number }>): Promise<{ data: Submission; message: string }> {
    const res = await fetch(`${serverConfig.getApiBase()}/submissions/${id}/grade`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'idempotency-key': createIdempotencyKey(`grade_${id}`),
      },
      body: JSON.stringify({ answers }),
    });
    const json = await res.json();
    return { data: json.data, message: json.message || '' };
  },

  async reportLiveSession(payload: {
    studentName: string; examId: string; classGroup?: string; department?: Department;
    infractionCount: number; timeSpentSeconds?: number;
  }): Promise<{ success: boolean; data?: Submission }> {
    try {
      const res = await fetch(`${serverConfig.getApiBase()}/submissions/live`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'idempotency-key': createIdempotencyKey(`live_${payload.studentName}_${payload.examId}_${payload.infractionCount}`),
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      return { success: res.ok, data: json.data };
    } catch {
      return { success: false };
    }
  },
};
