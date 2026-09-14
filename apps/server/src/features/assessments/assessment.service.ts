import { Assessment, Exam } from '@cbt/shared';
import { db } from '../../core/db/database.js';
import { ExamQueryFilter } from '../../core/types/contracts.js';

export class AssessmentService {
  public listAssessments(filters: ExamQueryFilter = {}): Assessment[] {
    let items = db.getExams();
    if (filters.level) items = items.filter((e) => e.educationLevel === filters.level);
    if (filters.targetClass) {
      items = items.filter((e) => e.targetClasses.includes('All') || e.targetClasses.includes(filters.targetClass!));
    }
    if (filters.department) {
      items = items.filter((e) => !e.department || e.department === filters.department);
    }
    if (filters.assessmentType) {
      items = items.filter((e) => (e.assessmentType ?? 'test') === filters.assessmentType);
    }
    return items;
  }

  public getAssessment(id: string): Assessment | undefined {
    return db.getExamById(id);
  }

  public createAssessment(data: Omit<Assessment, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): Assessment {
    const questions = data.questions || [];
    const totalPoints = questions.reduce((sum: number, q: Assessment['questions'][0]) => sum + (q.points || 0), 0);
    const newAssessment: Assessment = {
      ...data,
      id: data.id || `assessment_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      totalPoints,
      createdAt: data.createdAt || new Date().toISOString(),
      isPublished: true,
    } as Assessment;
    db.saveExam(newAssessment);
    return newAssessment;
  }

  public updateAssessment(id: string, updates: Partial<Assessment>): Assessment {
    const existing = db.getExamById(id);
    if (!existing) {
      return this.createAssessment({ ...updates, id } as any);
    }
    const questions = updates.questions ?? existing.questions;
    const totalPoints = questions.reduce((sum: number, q: Assessment['questions'][0]) => sum + (q.points || 0), 0);
    const updated: Assessment = { ...existing, ...updates, id, questions, totalPoints };
    db.saveExam(updated);
    return updated;
  }

  public deleteAssessment(id: string): boolean {
    return db.deleteExam(id);
  }

  public verifyPin(assessmentId: string, pin: string): boolean {
    const assessment = db.getExamById(assessmentId);
    if (!assessment || !assessment.unlockPin) return true;
    return assessment.unlockPin.trim() === pin.trim();
  }

  public listExams(filters: ExamQueryFilter = {}): Exam[] { return this.listAssessments(filters); }
  public getExam(id: string): Exam | undefined { return this.getAssessment(id); }
  public createExam(data: Omit<Exam, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): Exam { return this.createAssessment(data); }
  public updateExam(id: string, updates: Partial<Exam>): Exam | null { return this.updateAssessment(id, updates); }
  public deleteExam(id: string): boolean { return this.deleteAssessment(id); }
}

export const assessmentService = new AssessmentService();
export const examService = assessmentService;
