import { Student } from '../types/index.js';
import { serverConfig } from './server-config.js';

export const studentApi = {
  async getStudents(): Promise<Student[]> {
    const res = await fetch(`${serverConfig.getApiBase()}/students`);
    if (!res.ok) return [];
    const json = (await res.json()) as { success: boolean; data: Student[] };
    return json.data || [];
  },

  async getStudentByCode(code: string): Promise<Student | null> {
    const clean = encodeURIComponent(code.trim().toUpperCase());
    const res = await fetch(`${serverConfig.getApiBase()}/students/code/${clean}`);
    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data: Student };
    return json.data || null;
  },

  async saveStudent(student: Partial<Student> & { name: string }): Promise<Student> {
    const res = await fetch(`${serverConfig.getApiBase()}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    const json = (await res.json()) as { success: boolean; data: Student };
    return json.data;
  },

  async generateCode(id: string): Promise<Student | null> {
    const res = await fetch(`${serverConfig.getApiBase()}/students/${encodeURIComponent(id)}/generate-code`, {
      method: 'POST',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data: Student };
    return json.data || null;
  },

  async generateAllCodes(classGroup?: string, studentIds?: string[]): Promise<Student[]> {
    const res = await fetch(`${serverConfig.getApiBase()}/students/generate-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classGroup, studentIds }),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success: boolean; data: Student[] };
    return json.data || [];
  },

  async deleteStudent(id: string): Promise<boolean> {
    const res = await fetch(`${serverConfig.getApiBase()}/students/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  },
};
