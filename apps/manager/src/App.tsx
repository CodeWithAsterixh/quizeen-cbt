import React, { useState, useEffect } from 'react';
import { Assessment, useAppLicense, LicenseLockoutScreen } from '@cbt/shared';
import { TitleBar } from './components/layout/TitleBar';
import { Sidebar, ManagerTab } from './components/layout/Sidebar';
import { ManagerModals } from './components/layout/ManagerModals';
import { ManagerViewRouter } from './components/layout/ManagerViewRouter';
import { useManagerAppStore } from './store/useManagerAppStore';
import { useStudentStore } from './store/useStudentStore';
import { useManagerHeartbeat } from './features/device/useManagerHeartbeat';
import { useManagerUpdater } from './features/device/useManagerUpdater';
import { ManagerUpdateBanner } from './features/device/ManagerUpdateBanner';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ManagerTab>('dashboard');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const { assessments, submissions, isSyncing, refresh, saveAssessment, deleteAssessment, duplicateAssessment, updateSubmission } = useManagerAppStore();
  const { students, refresh: refreshStudents, saveStudent, generateCodeForStudent, generateCodesForStudents, deleteStudent } = useStudentStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [modals, setModals] = useState({ student: false, server: false, theme: false, loader: false });
  const [notice, setNotice] = useState<string | null>(null);

  const { licenseState, isLocked, refreshLicense } = useAppLicense();
  const isAuthoring = isEditorOpen || modals.student;
  const updater = useManagerUpdater(isAuthoring);

  useManagerHeartbeat({
    status: updater.phase === 'downloading' || updater.phase === 'installing' ? 'updating' : 'online',
    updateStatus: updater.phase, updateProgress: updater.progress,
    onPushUpdateTriggered: () => { if (!isAuthoring) updater.startDownload(); },
  });

  const notify = (m: string) => { setNotice(m); setTimeout(() => setNotice(null), 3500); };
  const handleRefresh = async () => { await Promise.all([refresh(), refreshStudents()]); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) { e.preventDefault(); handleRefresh(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [refresh, refreshStudents]);

  if (isLocked) return <LicenseLockoutScreen licenseState={licenseState} onRetry={refreshLicense} />;

  const branding = licenseState?.license?.branding;
  return (
    <div className="app-shell">
      <TitleBar
        title={branding?.appName || branding?.schoolName || 'Queez'}
        badge={branding?.shortName ? `${branding.shortName} Office` : 'Management'}
        iconUrl={branding?.appIconUrl || branding?.logoUrl}
      />
      <ManagerUpdateBanner visible={updater.bannerVisible} phase={updater.phase} progress={updater.progress} latestVersion={updater.latestVersion} error={updater.error} onStart={updater.startDownload} onDismiss={updater.dismissBanner} />
      <div className="manager-body">
        <Sidebar
          currentTab={currentTab} onSelectTab={(t) => { setSelectedExamId(null); setSelectedSubmissionId(null); setCurrentTab(t); }}
          onOpenServerSettings={() => setModals(m => ({ ...m, server: true }))} onOpenThemeSettings={() => setModals(m => ({ ...m, theme: true }))}
          pendingGradingCount={submissions.filter((s) => s.status === 'awaiting_result').length} onRefresh={handleRefresh} isSyncing={isSyncing}
        />
        <main className="main-viewport">
          {notice && (
            <div style={{ background: 'var(--color-primary)', color: '#fff', padding: '10px 16px', borderRadius: 'var(--radius-md)', marginBottom: 14, fontWeight: 600, fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{notice}</span><button onClick={() => setNotice(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>X</button>
            </div>
          )}
          <ManagerViewRouter
            currentTab={currentTab} assessments={assessments} submissions={submissions} students={students}
            selectedExamId={selectedExamId} selectedSubmissionId={selectedSubmissionId}
            onSelectExam={setSelectedExamId} onSelectSubmission={setSelectedSubmissionId}
            onNavigate={(t) => { setSelectedExamId(null); setSelectedSubmissionId(null); setCurrentTab(t); }}
            onOpenCreateExam={() => { setEditingAssessment(null); setIsEditorOpen(true); }} onOpenLoader={() => setModals(m => ({ ...m, loader: true }))}
            onEditExam={(e) => { setEditingAssessment(e); setIsEditorOpen(true); }} onDuplicateExam={duplicateAssessment}
            onDeleteExam={async (id) => { const r = await deleteAssessment(id); setSelectedExamId(null); notify(r.message); }}
            onOpenCreateStudent={() => setModals(m => ({ ...m, student: true }))} onGenerateCode={generateCodeForStudent}
            onGenerateCodes={async (ids) => { const r = await generateCodesForStudents(ids); notify(r.message); }}
            onDeleteStudent={async (id) => { const r = await deleteStudent(id); notify(r.message); }}
            onUpdateSubmission={async (s) => { const r = await updateSubmission(s); notify(r.message); }}
          />
        </main>
      </div>

      <ManagerModals
        isEditorOpen={isEditorOpen} editingAssessment={editingAssessment}
        onCloseEditor={() => { setIsEditorOpen(false); setEditingAssessment(null); }}
        onSaveAssessment={async (e) => { const r = await saveAssessment(e); setIsEditorOpen(false); setEditingAssessment(null); notify(r.message); }}
        isStudentModalOpen={modals.student} onCloseStudentModal={() => setModals(m => ({ ...m, student: false }))}
        onSaveStudent={async (s) => { const r = await saveStudent(s); setModals(m => ({ ...m, student: false })); notify(r.message); }}
        isServerModalOpen={modals.server} onCloseServerModal={() => setModals(m => ({ ...m, server: false }))}
        isThemeModalOpen={modals.theme} onCloseThemeModal={() => setModals(m => ({ ...m, theme: false }))}
        currentTheme={licenseState?.license?.theme} schoolName={branding?.schoolName}
        isLoaderOpen={modals.loader} onCloseLoader={() => setModals(m => ({ ...m, loader: false }))}
        onImportQzn={async (items) => { for (const item of items) await saveAssessment(item); await handleRefresh(); notify(`Imported ${items.length} assessment(s) successfully.`); }}
      />
    </div>
  );
};
