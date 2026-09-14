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

  generateCode(id: string, fallbackStudent?: any): Student | null {
    const list = db.getStudents();
    let student = list.find((s) => s.id === id);
    if (!student && fallbackStudent?.name) {
      student = this.save({ ...fallbackStudent, id });
    }
    if (!student) return null;
    const existing = new Set(list.filter((s) => s.code).map((s) => s.code!.toUpperCase()));
    student.code = generateStudentCode(existing);
    db.saveStudent(student);
    return student;
  },

  generateAllCodes(filterClass?: string, studentIds?: string[]): Student[] {
    const list = db.getStudents();
    const existing = new Set(list.filter((s) => s.code).map((s) => s.code!.toUpperCase()));
    let target = list;
    if (studentIds && studentIds.length > 0) {
      target = list.filter((s) => studentIds.includes(s.id));
    } else if (filterClass) {
      target = list.filter((s) => s.classGroup === filterClass);
    }
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
