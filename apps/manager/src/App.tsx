import React, { useState, useEffect } from 'react';
import { Assessment } from '@cbt/shared';
import { TitleBar } from './components/layout/TitleBar';
import { Sidebar, ManagerTab } from './components/layout/Sidebar';
import { DashboardView } from './features/dashboard/DashboardView';
import { AssessmentListView } from './features/assessments/AssessmentListView';
import { AssessmentDetailPage } from './features/assessments/AssessmentDetailPage';
import { AssessmentEditorModal } from './features/assessments/AssessmentEditorModal';
import { PackageCompilerView } from './features/compiler/PackageCompilerView';
import { GradingQueueView } from './features/grading/GradingQueueView';
import { StudentResultDetailPage } from './features/grading/StudentResultDetailPage';
import { AnalyticsView } from './features/analytics/AnalyticsView';
import { StudentListView } from './features/students/StudentListView';
import { StudentEditorModal } from './features/students/StudentEditorModal';
import { ServerSettingsModal } from './components/layout/ServerSettingsModal';
import { QznLoaderModal } from './features/packages/QznLoaderModal';
import { useManagerAppStore } from './store/useManagerAppStore';
import { useStudentStore } from './store/useStudentStore';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ManagerTab>('dashboard');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const { assessments, submissions, isSyncing, refresh, saveAssessment, deleteAssessment, duplicateAssessment, updateSubmission } = useManagerAppStore();
  const { students, refresh: refreshStudents, saveStudent, generateCodeForStudent, generateCodesForStudents, deleteStudent } = useStudentStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const notify = (m: string) => { setNotice(m); setTimeout(() => setNotice(null), 3500); };
  const handleRefresh = async () => { await Promise.all([refresh(), refreshStudents()]); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
        e.preventDefault();
        handleRefresh();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refresh, refreshStudents]);

  const pendingCount = submissions.filter((s) => s.status === 'awaiting_result').length;
  const activeSub = submissions.find((s) => s.id === selectedSubmissionId);
  const activeAssessment = assessments.find((e) => e.id === (activeSub ? activeSub.examId : selectedExamId));
  const handleTabChange = (t: ManagerTab) => { setSelectedExamId(null); setSelectedSubmissionId(null); setCurrentTab(t); };

  const handleImportQzn = async (items: Assessment[]) => {
    for (const item of items) { await saveAssessment(item); }
    await handleRefresh();
    notify(`Imported ${items.length} assessment(s) successfully.`);
  };

  return (
    <div className="app-shell">
      <TitleBar title="Queez" badge="Management" />
      <div className="manager-body">
        <Sidebar currentTab={currentTab} onSelectTab={handleTabChange} onOpenServerSettings={() => setIsServerModalOpen(true)} pendingGradingCount={pendingCount} onRefresh={handleRefresh} isSyncing={isSyncing} />
        <main className="main-viewport">
          {notice && (
            <div style={{ background: 'var(--color-primary)', color: '#fff', padding: '10px 16px', borderRadius: 'var(--radius-md)', marginBottom: 14, fontWeight: 600, fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{notice}</span><button onClick={() => setNotice(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>X</button>
            </div>
          )}
          {activeSub && activeAssessment ? (
            <StudentResultDetailPage submission={activeSub} exam={activeAssessment} onSave={async (s) => { const r = await updateSubmission(s); notify(r.message); }} onBack={() => setSelectedSubmissionId(null)} backLabel={selectedExamId ? 'Back to Assessment Details' : 'Back to Marking Queue'} />
          ) : activeAssessment && currentTab === 'exams' ? (
            <AssessmentDetailPage assessment={activeAssessment} submissions={submissions} onBack={() => setSelectedExamId(null)} onDuplicate={duplicateAssessment} onEdit={(e) => { setEditingAssessment(e); setIsEditorOpen(true); }} onDelete={async (id) => { const r = await deleteAssessment(id); setSelectedExamId(null); notify(r.message); }} onSelectSubmission={(s) => setSelectedSubmissionId(s.id)} />
          ) : (
            <>
              {currentTab === 'dashboard' && <DashboardView exams={assessments} submissions={submissions} onNavigate={handleTabChange} onOpenCreateExam={() => { setEditingAssessment(null); setIsEditorOpen(true); }} onOpenLoader={() => setIsLoaderOpen(true)} />}
              {currentTab === 'exams' && <AssessmentListView assessments={assessments} onOpenAssessment={(e) => setSelectedExamId(e.id)} onOpenCreate={() => { setEditingAssessment(null); setIsEditorOpen(true); }} onEditAssessment={(e) => { setEditingAssessment(e); setIsEditorOpen(true); }} onDuplicateAssessment={duplicateAssessment} onDeleteAssessment={async (id) => { const r = await deleteAssessment(id); notify(r.message); }} onOpenLoader={() => setIsLoaderOpen(true)} />}
              {currentTab === 'students' && <StudentListView students={students} onOpenCreate={() => setIsStudentModalOpen(true)} onGenerateCode={generateCodeForStudent} onGenerateCodes={async (ids) => { const r = await generateCodesForStudents(ids); notify(r.message); }} onDeleteStudent={async (id) => { const r = await deleteStudent(id); notify(r.message); }} />}
              {currentTab === 'compiler' && <PackageCompilerView exams={assessments} />}
              {currentTab === 'grading' && <GradingQueueView submissions={submissions} exams={assessments} onUpdateSubmission={async (s) => { const r = await updateSubmission(s); notify(r.message); }} />}
              {currentTab === 'analytics' && <AnalyticsView submissions={submissions} exams={assessments} />}
            </>
          )}
        </main>
      </div>

      <AssessmentEditorModal isOpen={isEditorOpen} initialExam={editingAssessment} onClose={() => { setIsEditorOpen(false); setEditingAssessment(null); }} onSave={async (e) => { const r = await saveAssessment(e); setIsEditorOpen(false); setEditingAssessment(null); notify(r.message); }} />
      <StudentEditorModal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} onSave={async (s) => { const r = await saveStudent(s); setIsStudentModalOpen(false); notify(r.message); }} />
      <ServerSettingsModal isOpen={isServerModalOpen} onClose={() => setIsServerModalOpen(false)} />
      <QznLoaderModal isOpen={isLoaderOpen} onClose={() => setIsLoaderOpen(false)} onImport={handleImportQzn} />
    </div>
  );
};
