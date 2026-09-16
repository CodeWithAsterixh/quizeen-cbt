import { Student, EducationLevel, Department } from '../types/index.js';
import { createIdempotencyKey } from '../utils/idempotency.js';
import { serverConfig } from './server-config.js';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export const studentApi = {
  async getStudents(): Promise<Student[]> {
    const res = await fetch(`${serverConfig.getApiBase()}/students?_t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = (await res.json()) as { success: boolean; data: Student[] };
    return json.data || [];
  },

  async lookupStudentByCode(code: string): Promise<ApiResponse<Student>> {
    const clean = encodeURIComponent(code.trim().toUpperCase());
    try {
      const res = await fetch(`${serverConfig.getApiBase()}/students/code/${clean}?_t=${Date.now()}`, { cache: 'no-store' });
      const json = (await res.json()) as ApiResponse<Student>;
      return {
        success: json.success ?? res.ok, statusCode: json.statusCode ?? res.status,
        message: json.message || (res.ok ? 'Student ID verified.' : 'Student not found.'),
        data: json.data,
      };
    } catch {
      return { success: false, statusCode: 0, message: 'Could not connect to server.' };
    }
  },

  async getStudentByCode(code: string): Promise<Student | null> {
    const res = await this.lookupStudentByCode(code);
    return res.data || null;
  },

  async saveStudent(student: Partial<Student> & { name: string }): Promise<Student> {
    const isEdit = Boolean(student.id);
    const url = isEdit ? `${serverConfig.getApiBase()}/students/${encodeURIComponent(student.id!)}` : `${serverConfig.getApiBase()}/students`;
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'idempotency-key': createIdempotencyKey(`stu_${student.id || student.name}`) },
      body: JSON.stringify(student),
    });
    const json = (await res.json()) as { success: boolean; data: Student };
    return json.data;
  },

  async promoteStudents(studentIds: string[], targetClass: string, educationLevel?: EducationLevel, department?: Department): Promise<Student[]> {
    const res = await fetch(`${serverConfig.getApiBase()}/students/promote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'idempotency-key': createIdempotencyKey(`promo_${Date.now()}`) },
      body: JSON.stringify({ studentIds, targetClass, educationLevel, department }),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success: boolean; data: Student[] };
    return json.data || [];
  },

  async generateCode(id: string, fallbackStudent?: any): Promise<Student | null> {
    const res = await fetch(`${serverConfig.getApiBase()}/students/${encodeURIComponent(id)}/generate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'idempotency-key': createIdempotencyKey(`gencode_${id}`) },
      body: fallbackStudent ? JSON.stringify(fallbackStudent) : undefined,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data: Student };
    return json.data || null;
  },

  async generateAllCodes(classGroup?: string, studentIds?: string[]): Promise<Student[]> {
    const res = await fetch(`${serverConfig.getApiBase()}/students/generate-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'idempotency-key': createIdempotencyKey('genallcodes') },
      body: JSON.stringify({ classGroup, studentIds }),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success: boolean; data: Student[] };
    return json.data || [];
  },

  async deleteStudent(id: string): Promise<boolean> {
    const res = await fetch(`${serverConfig.getApiBase()}/students/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'idempotency-key': createIdempotencyKey(`del_stu_${id}`) },
    });
    return res.ok;
  },
};
