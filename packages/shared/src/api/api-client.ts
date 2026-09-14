import { Assessment, Submission, ExamScheduleConfig, EducationLevel, Department } from '../types/index.js';
import { serverConfig } from './server-config.js';
import { studentApi } from './student-api.js';

import { submissionApi } from './submission-api.js';
import { packageApi } from './package-api.js';

export const apiClient = {
  getServerUrl: () => serverConfig.getUrl(), setServerUrl: (url: string) => serverConfig.setUrl(url),
  testConnection: (url?: string) => serverConfig.testConnection(url),
  async isAvailable(): Promise<boolean> { return (await serverConfig.testConnection()).ok; },

  async getExams(f?: { level?: EducationLevel; targetClass?: string; department?: Department; assessmentType?: string }): Promise<Assessment[]> {
    const p = new URLSearchParams();
    if (f?.level) p.append('level', f.level); if (f?.targetClass) p.append('targetClass', f.targetClass);
    if (f?.department) p.append('department', f.department); if (f?.assessmentType) p.append('assessmentType', f.assessmentType);
    p.append('_t', Date.now().toString());
    const res = await fetch(`${serverConfig.getApiBase()}/assessments?${p.toString()}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
    if (!res.ok) return [];
    return ((await res.json()) as any).data || [];
  },

  async createExam(exam: Omit<Assessment, 'id' | 'createdAt'>): Promise<{ data: Assessment; message?: string; statusCode?: number }> {
    const res = await fetch(`${serverConfig.getApiBase()}/assessments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(exam) });
    const json = await res.json();
    return { data: json.data, message: json.message, statusCode: json.statusCode ?? res.status };
  },

  async updateExam(id: string, updates: Partial<Assessment>): Promise<{ data: Assessment; message?: string; statusCode?: number }> {
    const res = await fetch(`${serverConfig.getApiBase()}/assessments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    const json = await res.json();
    return { data: json.data, message: json.message, statusCode: json.statusCode ?? res.status };
  },

  async deleteExam(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${serverConfig.getApiBase()}/assessments/${id}`, { method: 'DELETE' });
    const json = await res.json();
    return { success: json.success ?? res.ok, message: json.message };
  },

  async verifyPin(id: string, pin: string): Promise<{ valid: boolean; statusCode: number; message: string }> {
    try {
      const res = await fetch(`${serverConfig.getApiBase()}/assessments/${encodeURIComponent(id)}/verify-pin`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin }),
      });
      const json = await res.json();
      return { valid: json.data?.valid ?? res.ok, statusCode: json.statusCode ?? res.status, message: json.message || '' };
    } catch {
      return { valid: false, statusCode: 0, message: 'Could not reach server to verify PIN.' };
    }
  },

  getAssessments(f?: any) { return this.getExams(f); },
  createAssessment(a: any) { return this.createExam(a); },
  updateAssessment(id: string, u: any) { return this.updateExam(id, u); },
  deleteAssessment(id: string) { return this.deleteExam(id); },

  submitAnswers: (p: any) => submissionApi.submitAnswers(p),
  getSubmissions: (examId?: string) => submissionApi.getSubmissions(examId),
  gradeSubmission: (id: string, a: any) => submissionApi.gradeSubmission(id, a),

  compilePackage: (p: any) => packageApi.compilePackage(p),
  unpackPackage: (z: string) => packageApi.unpackPackage(z),

  getStudents: () => studentApi.getStudents(),
  getStudentByCode: (code: string) => studentApi.getStudentByCode(code),
  lookupStudentByCode: (code: string) => studentApi.lookupStudentByCode(code),
  saveStudent: (student: any) => studentApi.saveStudent(student),
  generateStudentCode: (id: string, fallback?: any) => studentApi.generateCode(id, fallback),
  generateAllStudentCodes: (classGroup?: string, studentIds?: string[]) => studentApi.generateAllCodes(classGroup, studentIds),
  deleteStudent: (id: string) => studentApi.deleteStudent(id),
};
