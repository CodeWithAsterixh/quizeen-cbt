import { Assessment, Submission, ExamScheduleConfig, EducationLevel, Department } from '../types/index.js';

const API_BASE = 'http://localhost:4000/api';

export const apiClient = {
  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:4000/health', { signal: AbortSignal.timeout(1000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getExams(filters?: { level?: EducationLevel; targetClass?: string; department?: Department; assessmentType?: string }): Promise<Assessment[]> {
    const params = new URLSearchParams();
    if (filters?.level) params.append('level', filters.level);
    if (filters?.targetClass) params.append('targetClass', filters.targetClass);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.assessmentType) params.append('assessmentType', filters.assessmentType);
    const res = await fetch(`${API_BASE}/assessments?${params.toString()}`);
    return ((await res.json()) as any).data || [];
  },

  async createExam(exam: Omit<Assessment, 'id' | 'createdAt'>): Promise<Assessment> {
    const res = await fetch(`${API_BASE}/assessments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(exam),
    });
    const json = (await res.json()) as any;
    return json.data;
  },

  async updateExam(id: string, updates: Partial<Assessment>): Promise<Assessment> {
    const res = await fetch(`${API_BASE}/assessments/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates),
    });
    const json = (await res.json()) as any;
    return json.data;
  },

  async deleteExam(id: string): Promise<void> {
    await fetch(`${API_BASE}/assessments/${id}`, { method: 'DELETE' });
  },

  getAssessments(filters?: { level?: EducationLevel; targetClass?: string; department?: Department; assessmentType?: string }): Promise<Assessment[]> {
    return this.getExams(filters);
  },
  createAssessment(assessment: Omit<Assessment, 'id' | 'createdAt'>): Promise<Assessment> {
    return this.createExam(assessment);
  },
  updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment> {
    return this.updateExam(id, updates);
  },
  deleteAssessment(id: string): Promise<void> {
    return this.deleteExam(id);
  },

  async submitAnswers(payload: {
    studentName: string; examId: string; classGroup: string; department?: Department;
    answers: Record<string, string>; infractionCount?: number; totalElapsedSeconds: number;
  }): Promise<Submission> {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    const json = (await res.json()) as any;
    return json.data;
  },

  async getSubmissions(examId?: string): Promise<Submission[]> {
    const url = examId ? `${API_BASE}/submissions?examId=${examId}` : `${API_BASE}/submissions`;
    return ((await (await fetch(url)).json()) as any).data || [];
  },

  async gradeSubmission(id: string, answers: Record<string, { awardedPoints: number }>): Promise<Submission> {
    const res = await fetch(`${API_BASE}/submissions/${id}/grade`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }),
    });
    const json = (await res.json()) as any;
    return json.data;
  },

  async compilePackage(payload: { packageName: string; examIds: string[]; schedules: ExamScheduleConfig[] }): Promise<Blob> {
    const res = await fetch(`${API_BASE}/packages/compile`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    return res.blob();
  },

  async unpackPackage(zipBase64: string): Promise<{ importedCount: number; packageId: string }> {
    const res = await fetch(`${API_BASE}/packages/unpack`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ zipBase64 }),
    });
    const json = (await res.json()) as any;
    return json.data;
  },
};
