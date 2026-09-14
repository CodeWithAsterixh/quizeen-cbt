import React, { useState, useEffect } from 'react';
import { FloppyDisk, ListNumbers, Gear } from '@cbt/shared';
import { Assessment, Question, EducationLevel, Department, AssessmentType, EDUCATION_LEVELS, Modal, Button } from '@cbt/shared';
import { QuestionsListTab } from './QuestionsListTab';
import { AssessmentSettingsTab } from './AssessmentSettingsTab';
import { useAssessmentForm } from './useAssessmentForm';

interface AssessmentEditorModalProps {
  isOpen: boolean; onClose: () => void; onSave: (assessment: Assessment) => void;
  initialExam?: Assessment | null; initialTab?: 'questions' | 'settings';
}

export const AssessmentEditorModal: React.FC<AssessmentEditorModalProps> = ({
  isOpen, onClose, onSave, initialExam, initialTab = 'questions',
}) => {
  const {
    activeTab, setActiveTab, editingQIndex, setEditingQIndex,
    subject, setSubject, session, setSession,
    assessmentType, setAssessmentType, isAvailable, setIsAvailable,
    availableFrom, setAvailableFrom, availableTo, setAvailableTo,
    durationMinutes, setDurationMinutes, passingScore, setPassingScore,
    educationLevel, setEducationLevel, selectedClasses, setSelectedClasses,
    department, setDepartment, questions, setQuestions,
  } = useAssessmentForm(initialExam, isOpen, initialTab);

  const handleAddQ = () => {
    const newQ: Question = { id: `q_${Date.now()}`, prompt: `Question ${questions.length + 1}`, type: 'multiple_choice', options: ['Option A', 'Option B', 'Option C', 'Option D'], correctAnswer: 'Option A', points: 10 };
    setQuestions([...questions, newQ]);
    setEditingQIndex(questions.length);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return alert('Please enter the Subject in Settings.');
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
    const classesStr = selectedClasses.length > 0 ? selectedClasses.join(', ') : 'All';
    onSave({
      id: initialExam?.id ?? `exam_${Date.now()}`,
      title: `${subject.trim()} - ${classesStr} (${session.trim()})`,
      description: '', subject: subject.trim(), session: session.trim(), assessmentType,
      educationLevel, targetClasses: selectedClasses.length > 0 ? selectedClasses : ['All'],
      department: EDUCATION_LEVELS.find((l) => l.id === educationLevel)?.hasDepartments ? department : undefined,
      durationMinutes, passingScore, totalPoints, questions, createdAt: initialExam?.createdAt ?? new Date().toISOString(), isPublished: true,
      isAvailable, availableFrom: availableFrom || undefined, availableTo: availableTo || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialExam ? `Edit: ${initialExam.subject}` : 'Create New Assessment'} subtitle="Manage assessment settings and questions" maxWidth={880}>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
          <Button type="button" variant={activeTab === 'questions' ? 'primary' : 'outline'} size="sm" icon={<ListNumbers size={18} />} onClick={() => setActiveTab('questions')}>Questions ({questions.length})</Button>
          <Button type="button" variant={activeTab === 'settings' ? 'primary' : 'outline'} size="sm" icon={<Gear size={18} />} onClick={() => setActiveTab('settings')}>Settings & Availability</Button>
        </div>
        {activeTab === 'questions' ? (
          <QuestionsListTab questions={questions} editingIndex={editingQIndex} setEditingIndex={setEditingQIndex} onAddQuestion={handleAddQ} onUpdateQuestion={(i, upd) => { const copy = [...questions]; copy[i] = { ...copy[i], ...upd }; setQuestions(copy); }} onDeleteQuestion={(i) => { setQuestions(questions.filter((_, idx) => idx !== i)); setEditingQIndex(null); }} />
        ) : (
          <AssessmentSettingsTab subject={subject} setSubject={setSubject} session={session} setSession={setSession} assessmentType={assessmentType} setAssessmentType={setAssessmentType} durationMinutes={durationMinutes} setDurationMinutes={setDurationMinutes} passingScore={passingScore} setPassingScore={setPassingScore} educationLevel={educationLevel} onLevelChange={(l) => { setEducationLevel(l); setSelectedClasses(EDUCATION_LEVELS.find((c) => c.id === l)?.classes.slice(0, 1) ?? []); }} selectedClasses={selectedClasses} onToggleClass={(c) => setSelectedClasses(selectedClasses.includes(c) ? selectedClasses.filter((x) => x !== c) : [...selectedClasses, c])} department={department} setDepartment={setDepartment} isAvailable={isAvailable} setIsAvailable={setIsAvailable} availableFrom={availableFrom} setAvailableFrom={setAvailableFrom} availableTo={availableTo} setAvailableTo={setAvailableTo} />
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{questions.length} questions • {durationMinutes} mins • {isAvailable ? 'Active' : 'Hidden'}</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" icon={<FloppyDisk size={18} />}>Save Assessment</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export const ExamEditorModal = AssessmentEditorModal;
