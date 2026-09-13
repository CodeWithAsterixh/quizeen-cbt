import React, { useState } from 'react';
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
import { ServerSettingsModal } from './components/layout/ServerSettingsModal';
import { useManagerAppStore } from './store/useManagerAppStore';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ManagerTab>('dashboard');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const { assessments, submissions, saveAssessment, deleteAssessment, duplicateAssessment, updateSubmission } = useManagerAppStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);

  const pendingCount = submissions.filter((s) => s.status === 'awaiting_result').length;
  const activeSub = submissions.find((s) => s.id === selectedSubmissionId);
  const activeAssessment = assessments.find((e) => e.id === (activeSub ? activeSub.examId : selectedExamId));
  const handleTabChange = (t: ManagerTab) => { setSelectedExamId(null); setSelectedSubmissionId(null); setCurrentTab(t); };

  return (
    <div className="app-shell">
      <TitleBar title="Queez" badge="Management" />
      <div className="manager-body">
        <Sidebar currentTab={currentTab} onSelectTab={handleTabChange} onOpenServerSettings={() => setIsServerModalOpen(true)} pendingGradingCount={pendingCount} />
        <main className="main-viewport">
          {activeSub && activeAssessment ? (
            <StudentResultDetailPage
              submission={activeSub} exam={activeAssessment} onSave={updateSubmission}
              onBack={() => setSelectedSubmissionId(null)}
              backLabel={selectedExamId ? 'Back to Assessment Details' : 'Back to Marking Queue'}
            />
          ) : activeAssessment && currentTab === 'exams' ? (
            <AssessmentDetailPage
              assessment={activeAssessment} submissions={submissions}
              onBack={() => setSelectedExamId(null)} onDuplicate={duplicateAssessment}
              onEdit={(e) => { setEditingAssessment(e); setIsEditorOpen(true); }}
              onDelete={(id) => { deleteAssessment(id); setSelectedExamId(null); }}
              onSelectSubmission={(s) => setSelectedSubmissionId(s.id)}
            />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  exams={assessments} submissions={submissions} onNavigate={handleTabChange}
                  onOpenCreateExam={() => { setEditingAssessment(null); setIsEditorOpen(true); }}
                />
              )}
              {currentTab === 'exams' && (
                <AssessmentListView
                  assessments={assessments} onOpenAssessment={(e) => setSelectedExamId(e.id)}
                  onOpenCreate={() => { setEditingAssessment(null); setIsEditorOpen(true); }}
                  onEditAssessment={(e) => { setEditingAssessment(e); setIsEditorOpen(true); }}
                  onDuplicateAssessment={duplicateAssessment} onDeleteAssessment={deleteAssessment}
                />
              )}
              {currentTab === 'compiler' && <PackageCompilerView exams={assessments} />}
              {currentTab === 'grading' && <GradingQueueView submissions={submissions} exams={assessments} onUpdateSubmission={updateSubmission} />}
              {currentTab === 'analytics' && <AnalyticsView submissions={submissions} exams={assessments} />}
            </>
          )}
        </main>
      </div>

      <AssessmentEditorModal
        isOpen={isEditorOpen} initialExam={editingAssessment}
        onClose={() => { setIsEditorOpen(false); setEditingAssessment(null); }}
        onSave={async (e) => { await saveAssessment(e); setIsEditorOpen(false); setEditingAssessment(null); }}
      />
      <ServerSettingsModal isOpen={isServerModalOpen} onClose={() => setIsServerModalOpen(false)} />
    </div>
  );
};
