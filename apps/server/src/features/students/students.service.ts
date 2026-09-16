import { Student, generateStudentCode, getLocalIsoTimestamp } from '@cbt/shared';
import { db } from '../../core/db/database.js';

export const studentsService = {
  getAll(): Student[] {
    return db.getStudents();
  },

  getByCode(code: string): Student | undefined {
    return db.getStudentByCode(code);
  },

  save(payload: Partial<Student> & { name: string; educationLevel: any; classGroup: string }): Student {
    const student: Student = {
      id: payload.id || `stu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      code: payload.code ? payload.code.trim().toUpperCase() : undefined,
      name: payload.name.trim(),
      educationLevel: payload.educationLevel,
      classGroup: payload.classGroup,
      department: payload.department,
      createdAt: payload.createdAt || getLocalIsoTimestamp(),
    };
    db.saveStudent(student);
    return student;
  },

  update(id: string, payload: Partial<Student>): Student | null {
    const student = db.getStudents().find((s) => s.id === id);
    if (!student) return null;
    const updated: Student = {
      ...student,
      name: payload.name ? payload.name.trim() : student.name,
      educationLevel: payload.educationLevel || student.educationLevel,
      classGroup: payload.classGroup || student.classGroup,
      department: payload.department !== undefined ? payload.department : student.department,
    };
    db.saveStudent(updated);
    return updated;
  },

  promote(studentIds: string[], targetClass: string, level?: any, dept?: any): Student[] {
    const list = db.getStudents();
    const updated: Student[] = [];
    for (const s of list) {
      if (studentIds.includes(s.id)) {
        s.classGroup = targetClass;
        if (level) s.educationLevel = level;
        if (dept !== undefined) s.department = dept;
        db.saveStudent(s);
        updated.push(s);
      }
    }
    return updated;
  },

  generateCode(id: string, fallback?: any): Student | null {
    const list = db.getStudents();
    const student = list.find((s) => s.id === id) || (fallback?.name ? this.save({ ...fallback, id }) : null);
    if (!student) return null;
    const existing = new Set(list.filter((s) => s.code).map((s) => s.code!.toUpperCase()));
    student.code = generateStudentCode(existing);
    db.saveStudent(student);
    return student;
  },

  generateAllCodes(filterClass?: string, studentIds?: string[]): Student[] {
    const list = db.getStudents();
    const existing = new Set(list.filter((s) => s.code).map((s) => s.code!.toUpperCase()));
    const target = studentIds?.length ? list.filter((s) => studentIds.includes(s.id)) : filterClass ? list.filter((s) => s.classGroup === filterClass) : list;
    target.forEach((s) => {
      s.code = generateStudentCode(existing);
      existing.add(s.code);
      db.saveStudent(s);
    });
    return db.getStudents();
  },

  delete(id: string): boolean {
    return db.deleteStudent(id);
  },
};
