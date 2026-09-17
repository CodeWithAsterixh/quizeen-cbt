import React from 'react';
import { FloppyDisk, ListNumbers, Gear, ArrowCounterClockwise, ArrowClockwise } from '@cbt/shared';
import { Assessment, Question, EDUCATION_LEVELS, Modal, Button } from '@cbt/shared';
import { QuestionsListTab } from './QuestionsListTab';
import { AssessmentSettingsTab } from './AssessmentSettingsTab';
import { useAssessmentForm } from './useAssessmentForm';
import { useAssessmentShortcuts } from './useAssessmentShortcuts';

interface AssessmentEditorModalProps {
  isOpen: boolean; onClose: () => void; onSave: (assessment: Assessment) => void;
  initialExam?: Assessment | null; initialTab?: 'questions' | 'settings';
}

export const AssessmentEditorModal: React.FC<AssessmentEditorModalProps> = ({
  isOpen, onClose, onSave, initialExam, initialTab = 'questions',
}) => {
  const form = useAssessmentForm(initialExam, isOpen, initialTab);
  const {
    activeTab, setActiveTab, editingQIndex, setEditingQIndex,
    subject, setSubject, session, setSession, assessmentType, setAssessmentType,
    isAvailable, setIsAvailable, availableFrom, setAvailableFrom,
    availableTo, setAvailableTo, durationMinutes, setDurationMinutes,
    passingScore, setPassingScore, educationLevel, setEducationLevel,
    selectedClasses, setSelectedClasses, department, setDepartment,
    questions, setQuestions, shuffleQuestions, setShuffleQuestions,
    shuffleOptions, setShuffleOptions, undo, redo, canUndo, canRedo,
  } = form;

  const handleAddQ = () => {
    const newQ: Question = { id: `q_${Date.now()}`, prompt: `Question ${questions.length + 1}`, type: 'multiple_choice', options: ['Option A', 'Option B', 'Option C', 'Option D'], correctAnswer: 'Option A', points: 10 };
    setQuestions([...questions, newQ]);
    setEditingQIndex(questions.length);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      shuffleQuestions, shuffleOptions,
    });
  };

  useAssessmentShortcuts({ isOpen, onSave: () => handleSave(), onUndo: undo, onRedo: redo });

  const modalTitle = subject.trim() ? `${subject.trim()} Assessment` : (initialExam ? `Edit: ${initialExam.subject}` : 'Create New Assessment');
  const modalSubtitle = subject.trim() ? `Subject: ${subject.trim()} | ${session || 'Current Session'}` : 'Manage assessment settings and questions';

  return (
    <Modal
      isOpen={isOpen} onClose={onClose} title={modalTitle} subtitle={modalSubtitle} fullScreen
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{questions.length} questions • {durationMinutes} mins • {isAvailable ? 'Active' : 'Hidden'}</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button type="button" variant="outline" size="sm" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" icon={<ArrowCounterClockwise size={16} />} />
            <Button type="button" variant="outline" size="sm" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)" icon={<ArrowClockwise size={16} />} />
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="button" variant="primary" onClick={handleSave} icon={<FloppyDisk size={18} />}>Save Assessment</Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="button" variant={activeTab === 'questions' ? 'primary' : 'outline'} size="sm" icon={<ListNumbers size={18} />} onClick={() => setActiveTab('questions')}>Questions ({questions.length})</Button>
            <Button type="button" variant={activeTab === 'settings' ? 'primary' : 'outline'} size="sm" icon={<Gear size={18} />} onClick={() => setActiveTab('settings')}>Settings & Availability</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Subject:</span>
            <input
              type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Mathematics, English..."
              style={{ padding: '5px 10px', fontSize: '0.9rem', fontWeight: 600, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)', minWidth: 200 }}
            />
          </div>
        </div>
        {activeTab === 'questions' ? (
          <QuestionsListTab questions={questions} editingIndex={editingQIndex} setEditingIndex={setEditingQIndex} onAddQuestion={handleAddQ} onUpdateQuestion={(i, upd) => { const copy = [...questions]; copy[i] = { ...copy[i], ...upd }; setQuestions(copy); }} onDeleteQuestion={(i) => { setQuestions(questions.filter((_, idx) => idx !== i)); setEditingQIndex(null); }} />
        ) : (
          <AssessmentSettingsTab subject={subject} setSubject={setSubject} session={session} setSession={setSession} assessmentType={assessmentType} setAssessmentType={setAssessmentType} durationMinutes={durationMinutes} setDurationMinutes={setDurationMinutes} passingScore={passingScore} setPassingScore={setPassingScore} educationLevel={educationLevel} onLevelChange={(l) => { setEducationLevel(l); setSelectedClasses(EDUCATION_LEVELS.find((c) => c.id === l)?.classes.slice(0, 1) ?? []); }} selectedClasses={selectedClasses} onToggleClass={(c) => setSelectedClasses(selectedClasses.includes(c) ? selectedClasses.filter((x) => x !== c) : [...selectedClasses, c])} department={department} setDepartment={setDepartment} isAvailable={isAvailable} setIsAvailable={setIsAvailable} availableFrom={availableFrom} setAvailableFrom={setAvailableFrom} availableTo={availableTo} setAvailableTo={setAvailableTo} shuffleQuestions={shuffleQuestions} setShuffleQuestions={setShuffleQuestions} shuffleOptions={shuffleOptions} setShuffleOptions={setShuffleOptions} />
        )}
      </div>
    </Modal>
  );
};

export const ExamEditorModal = AssessmentEditorModal;
