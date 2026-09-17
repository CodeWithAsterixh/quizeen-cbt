import { useState, useEffect } from 'react';
import { Assessment, Question, EducationLevel, Department, AssessmentType, getDefaultAcademicSession } from '@cbt/shared';

const defaultQ: Question = {
  id: 'q_default', prompt: 'Sample Question 1', type: 'multiple_choice',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctAnswer: 'Option A', points: 10,
};

export function useAssessmentForm(initialExam?: Assessment | null, isOpen = false, initialTab: 'questions' | 'settings' = 'questions') {
  const [activeTab, setActiveTab] = useState<'questions' | 'settings'>(initialTab);
  const [editingQIndex, setEditingQIndex] = useState<number | null>(null);
  const [subject, setSubject] = useState(initialExam?.subject ?? 'Mathematics');
  const [session, setSession] = useState(initialExam?.session ?? getDefaultAcademicSession());
  const [assessmentType, setAssessmentType] = useState<AssessmentType>(initialExam?.assessmentType ?? 'test');
  const [isAvailable, setIsAvailable] = useState(initialExam?.isAvailable ?? true);
  const [availableFrom, setAvailableFrom] = useState(initialExam?.availableFrom ?? '');
  const [availableTo, setAvailableTo] = useState(initialExam?.availableTo ?? '');
  const [durationMinutes, setDurationMinutes] = useState(initialExam?.durationMinutes ?? 30);
  const [passingScore, setPassingScore] = useState(initialExam?.passingScore ?? 50);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(initialExam?.educationLevel ?? 'senior_secondary');
  const [selectedClasses, setSelectedClasses] = useState<string[]>(initialExam?.targetClasses ?? ['SSS 2']);
  const [department, setDepartment] = useState<Department | undefined>(initialExam?.department);
  const [shuffleQuestions, setShuffleQuestions] = useState(initialExam?.shuffleQuestions ?? true);
  const [shuffleOptions, setShuffleOptions] = useState(initialExam?.shuffleOptions ?? true);
  const [questions, setQuestions] = useState<Question[]>(initialExam?.questions ?? [{ ...defaultQ, id: `q_${Date.now()}` }]);
  const [past, setPast] = useState<Question[][]>([]);
  const [future, setFuture] = useState<Question[][]>([]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialExam ? initialTab : 'settings');
      setEditingQIndex(null);
      setSubject(initialExam?.subject ?? 'Mathematics');
      setSession(initialExam?.session ?? getDefaultAcademicSession());
      setAssessmentType(initialExam?.assessmentType ?? 'test');
      setIsAvailable(initialExam?.isAvailable ?? true);
      setAvailableFrom(initialExam?.availableFrom ?? '');
      setAvailableTo(initialExam?.availableTo ?? '');
      setDurationMinutes(initialExam?.durationMinutes ?? 30);
      setPassingScore(initialExam?.passingScore ?? 50);
      setEducationLevel(initialExam?.educationLevel ?? 'senior_secondary');
      setSelectedClasses(initialExam?.targetClasses ?? ['SSS 2']);
      setDepartment(initialExam?.department);
      setShuffleQuestions(initialExam?.shuffleQuestions ?? true);
      setShuffleOptions(initialExam?.shuffleOptions ?? true);
      setQuestions(initialExam?.questions ?? [{ ...defaultQ, id: `q_${Date.now()}` }]);
      setPast([]);
      setFuture([]);
    }
  }, [isOpen, initialExam, initialTab]);

  const updateQuestions = (newQ: Question[] | ((prev: Question[]) => Question[])) => {
    setQuestions((current) => {
      const next = typeof newQ === 'function' ? newQ(current) : newQ;
      setPast((p) => [...p.slice(-20), current]);
      setFuture([]);
      return next;
    });
  };

  const undo = () => {
    if (past.length === 0) return;
    const prevQ = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [questions, ...f]);
    setQuestions(prevQ);
  };

  const redo = () => {
    if (future.length === 0) return;
    const nextQ = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, questions]);
    setQuestions(nextQ);
  };

  return {
    activeTab, setActiveTab, editingQIndex, setEditingQIndex,
    subject, setSubject, session, setSession,
    assessmentType, setAssessmentType, isAvailable, setIsAvailable,
    availableFrom, setAvailableFrom, availableTo, setAvailableTo,
    durationMinutes, setDurationMinutes, passingScore, setPassingScore,
    educationLevel, setEducationLevel, selectedClasses, setSelectedClasses,
    department, setDepartment, questions, setQuestions: updateQuestions,
    shuffleQuestions, setShuffleQuestions, shuffleOptions, setShuffleOptions,
    undo, redo, canUndo: past.length > 0, canRedo: future.length > 0,
  };
}
