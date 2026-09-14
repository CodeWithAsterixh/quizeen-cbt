import { Assessment, Submission, ExamScheduleConfig, EducationLevel, Department } from '../types/index.js';
import { serverConfig } from './server-config.js';
import { studentApi } from './student-api.js';

export const apiClient = {
  getServerUrl: (): string => serverConfig.getUrl(),
  setServerUrl: (url: string): void => serverConfig.setUrl(url),
  testConnection: (url?: string) => serverConfig.testConnection(url),

  async isAvailable(): Promise<boolean> {
    const res = await serverConfig.testConnection();
    return res.ok;
  },

  async getExams(filters?: { level?: EducationLevel; targetClass?: string; department?: Department; assessmentType?: string }): Promise<Assessment[]> {
    const params = new URLSearchParams();
    if (filters?.level) params.append('level', filters.level);
    if (filters?.targetClass) params.append('targetClass', filters.targetClass);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.assessmentType) params.append('assessmentType', filters.assessmentType);
    params.append('_t', Date.now().toString());
    const res = await fetch(`${serverConfig.getApiBase()}/assessments?${params.toString()}`, {
      cache: 'no-store', headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
    });
    if (!res.ok) return [];
    return ((await res.json()) as any).data || [];
  },

  async createExam(exam: Omit<Assessment, 'id' | 'createdAt'>): Promise<Assessment> {
    const res = await fetch(`${serverConfig.getApiBase()}/assessments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(exam),
    });
    return ((await res.json()) as any).data;
  },

  async updateExam(id: string, updates: Partial<Assessment>): Promise<Assessment> {
    const res = await fetch(`${serverConfig.getApiBase()}/assessments/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates),
    });
    return ((await res.json()) as any).data;
  },

  async deleteExam(id: string): Promise<void> {
    await fetch(`${serverConfig.getApiBase()}/assessments/${id}`, { method: 'DELETE' });
  },

  getAssessments(f?: any) { return this.getExams(f); },
  createAssessment(a: any) { return this.createExam(a); },
  updateAssessment(id: string, u: any) { return this.updateExam(id, u); },
  deleteAssessment(id: string) { return this.deleteExam(id); },

  async submitAnswers(payload: {
    studentName: string; examId: string; classGroup: string; department?: Department;
    answers: Record<string, string>; infractionCount?: number; totalElapsedSeconds: number;
  }): Promise<Submission> {
    const res = await fetch(`${serverConfig.getApiBase()}/submissions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    return ((await res.json()) as any).data;
  },

  async getSubmissions(examId?: string): Promise<Submission[]> {
    const sep = examId ? `?examId=${encodeURIComponent(examId)}&` : '?';
    const res = await fetch(`${serverConfig.getApiBase()}/submissions${sep}_t=${Date.now()}`, {
      cache: 'no-store', headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
    });
    if (!res.ok) return [];
    return ((await res.json()) as any).data || [];
  },

  async gradeSubmission(id: string, answers: Record<string, { awardedPoints: number }>): Promise<Submission> {
    const res = await fetch(`${serverConfig.getApiBase()}/submissions/${id}/grade`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }),
    });
    return ((await res.json()) as any).data;
  },

  async compilePackage(payload: { packageName: string; examIds: string[]; schedules: ExamScheduleConfig[] }): Promise<Blob> {
    const res = await fetch(`${serverConfig.getApiBase()}/packages/compile`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    return res.blob();
  },

  async unpackPackage(zipBase64: string): Promise<{ importedCount: number; packageId: string }> {
    const res = await fetch(`${serverConfig.getApiBase()}/packages/unpack`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ zipBase64 }),
    });
    return ((await res.json()) as any).data;
  },

  getStudents: () => studentApi.getStudents(),
  getStudentByCode: (code: string) => studentApi.getStudentByCode(code),
  saveStudent: (student: any) => studentApi.saveStudent(student),
  generateStudentCode: (id: string, fallback?: any) => studentApi.generateCode(id, fallback),
  generateAllStudentCodes: (classGroup?: string, studentIds?: string[]) => studentApi.generateAllCodes(classGroup, studentIds),
  deleteStudent: (id: string) => studentApi.deleteStudent(id),
};
