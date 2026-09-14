import { Student } from '../types/index.js';
import { serverConfig } from './server-config.js';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export const studentApi = {
  async getStudents(): Promise<Student[]> {
    const res = await fetch(`${serverConfig.getApiBase()}/students?_t=${Date.now()}`, {
      cache: 'no-store', headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success: boolean; data: Student[] };
    return json.data || [];
  },

  async lookupStudentByCode(code: string): Promise<ApiResponse<Student>> {
    const clean = encodeURIComponent(code.trim().toUpperCase());
    try {
      const res = await fetch(`${serverConfig.getApiBase()}/students/code/${clean}?_t=${Date.now()}`, {
        cache: 'no-store', headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      });
      const json = (await res.json()) as ApiResponse<Student>;
      return {
        success: json.success ?? res.ok,
        statusCode: json.statusCode ?? res.status,
        message: json.message || (res.ok ? 'Student ID verified successfully.' : 'Student not found with this code.'),
        data: json.data,
      };
    } catch {
      return {
        success: false, statusCode: 0,
        message: 'Could not connect to the examination server. Please check your network or ask your teacher.',
      };
    }
  },

  async getStudentByCode(code: string): Promise<Student | null> {
    const res = await this.lookupStudentByCode(code);
    return res.data || null;
  },

  async saveStudent(student: Partial<Student> & { name: string }): Promise<Student> {
    const res = await fetch(`${serverConfig.getApiBase()}/students`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(student),
    });
    const json = (await res.json()) as { success: boolean; data: Student };
    return json.data;
  },

  async generateCode(id: string, fallbackStudent?: any): Promise<Student | null> {
    const res = await fetch(`${serverConfig.getApiBase()}/students/${encodeURIComponent(id)}/generate-code`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: fallbackStudent ? JSON.stringify(fallbackStudent) : undefined,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data: Student };
    return json.data || null;
  },

  async generateAllCodes(classGroup?: string, studentIds?: string[]): Promise<Student[]> {
    const res = await fetch(`${serverConfig.getApiBase()}/students/generate-all`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ classGroup, studentIds }),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success: boolean; data: Student[] };
    return json.data || [];
  },

  async deleteStudent(id: string): Promise<boolean> {
    const res = await fetch(`${serverConfig.getApiBase()}/students/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return res.ok;
  },
};
