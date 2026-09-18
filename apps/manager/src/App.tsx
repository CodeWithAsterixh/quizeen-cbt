import React, { useState, useEffect } from 'react';
import { Assessment, Student, useAppLicense, LicenseLockoutScreen, bakedWhitelabelConfig, toast, GlobalDialogHost } from '@cbt/shared';
import { TitleBar } from './components/layout/TitleBar';
import { Sidebar, ManagerTab } from './components/layout/Sidebar';
import { ManagerModals } from './components/layout/ManagerModals';
import { ManagerViewRouter } from './components/layout/ManagerViewRouter';
import { useManagerAppStore } from './store/useManagerAppStore';
import { useStudentStore } from './store/useStudentStore';
import { useManagerHeartbeat } from './features/device/useManagerHeartbeat';
import { useManagerUpdater } from './features/device/useManagerUpdater';
import { ManagerUpdateBanner } from './features/device/ManagerUpdateBanner';
import { FreeTierBanner } from './components/layout/FreeTierBanner';
import { UpgradeLicenseModal } from './components/layout/UpgradeLicenseModal';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ManagerTab>('dashboard');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const { assessments, submissions, isSyncing, refresh, saveAssessment, deleteAssessment, duplicateAssessment, updateSubmission } = useManagerAppStore();
  const { students, refresh: refreshStudents, saveStudent, moveStudentsClass, generateCodeForStudent, generateCodesForStudents, deleteStudent } = useStudentStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [modals, setModals] = useState({ student: false, server: false, theme: false, loader: false, upgrade: false });
  const { licenseState, isLocked, isFreeTier, refreshLicense } = useAppLicense();
  const isAuthoring = isEditorOpen || modals.student;
  const updater = useManagerUpdater(isAuthoring);

  useManagerHeartbeat({
    status: updater.phase === 'downloading' || updater.phase === 'installing' ? 'updating' : 'online',
    updateStatus: updater.phase, updateProgress: updater.progress,
    onPushUpdateTriggered: () => { if (!isAuthoring) updater.startDownload(); },
  });

  const notify = (m: string) => { toast.success(m); };
  const handleRefresh = async () => { await Promise.all([refresh(), refreshStudents()]); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) { e.preventDefault(); handleRefresh(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [refresh, refreshStudents]);

  if (isLocked) return <LicenseLockoutScreen licenseState={licenseState} onRetry={refreshLicense} />;

  const branding = licenseState?.license?.branding;
  const rawLogo = branding?.appIconUrl || branding?.logoUrl || bakedWhitelabelConfig?.appIconUrl || bakedWhitelabelConfig?.logo;
  const appLogo = rawLogo && (rawLogo.startsWith('data:image/') || rawLogo.startsWith('/') || rawLogo.startsWith('http')) ? rawLogo : '/icon.png';

  return (
    <div className="app-shell">
      <TitleBar title={bakedWhitelabelConfig?.managerName || (branding?.schoolName ? `${branding.schoolName} Assessment Manager` : 'Assessment Manager')} iconUrl={appLogo} />
      {isFreeTier && <FreeTierBanner onOpenUpgrade={() => setModals((m) => ({ ...m, upgrade: true }))} />}
      <ManagerUpdateBanner visible={updater.bannerVisible} phase={updater.phase} progress={updater.progress} latestVersion={updater.latestVersion} error={updater.error} onStart={updater.startDownload} onDismiss={updater.dismissBanner} />
      <div className="manager-body">
        <Sidebar currentTab={currentTab} onSelectTab={(t) => { setSelectedExamId(null); setSelectedSubmissionId(null); setCurrentTab(t); }} pendingGradingCount={submissions.filter((s) => s.status === 'awaiting_result').length} logoUrl={appLogo} />
        <main className="main-viewport">
          <ManagerViewRouter
            currentTab={currentTab} assessments={assessments} submissions={submissions} students={students}
            selectedExamId={selectedExamId} selectedSubmissionId={selectedSubmissionId}
            onSelectExam={setSelectedExamId} onSelectSubmission={setSelectedSubmissionId}
            onNavigate={(t) => { setSelectedExamId(null); setSelectedSubmissionId(null); setCurrentTab(t); }}
            onOpenCreateExam={() => { setEditingAssessment(null); setIsEditorOpen(true); }} onOpenLoader={() => setModals(m => ({ ...m, loader: true }))}
            onEditExam={(e) => { setEditingAssessment(e); setIsEditorOpen(true); }} onDuplicateExam={duplicateAssessment}
            onDeleteExam={async (id) => { const r = await deleteAssessment(id); setSelectedExamId(null); notify(r.message); }}
            onOpenCreateStudent={() => { setEditingStudent(null); setModals(m => ({ ...m, student: true })); }}
            onEditStudent={(s) => { setEditingStudent(s); setModals(m => ({ ...m, student: true })); }}
            onMoveStudents={async (ids, dir) => { const r = await moveStudentsClass(ids, dir); notify(r.message); }}
            onGenerateCode={generateCodeForStudent} onGenerateCodes={async (ids) => { const r = await generateCodesForStudents(ids); notify(r.message); }}
            onDeleteStudent={async (id) => { const r = await deleteStudent(id); notify(r.message); }} onUpdateSubmission={async (s) => { const r = await updateSubmission(s); notify(r.message); }}
            onSync={handleRefresh} isSyncing={isSyncing} onOpenServerModal={() => setModals(m => ({ ...m, server: true }))}
            currentTheme={licenseState?.license?.theme} schoolName={branding?.schoolName} onNotify={notify}
          />
        </main>
      </div>
      <ManagerModals
        isEditorOpen={isEditorOpen} editingAssessment={editingAssessment}
        onCloseEditor={() => { setIsEditorOpen(false); setEditingAssessment(null); }}
        onSaveAssessment={async (e) => { const r = await saveAssessment(e); setIsEditorOpen(false); setEditingAssessment(null); notify(r.message); }}
        isStudentModalOpen={modals.student} editingStudent={editingStudent}
        onCloseStudentModal={() => { setModals(m => ({ ...m, student: false })); setEditingStudent(null); }}
        onSaveStudent={async (s) => { const r = await saveStudent(s); setModals(m => ({ ...m, student: false })); setEditingStudent(null); notify(r.message); }}
        isServerModalOpen={modals.server} onCloseServerModal={() => setModals(m => ({ ...m, server: false }))}
        isThemeModalOpen={modals.theme} onCloseThemeModal={() => setModals(m => ({ ...m, theme: false }))}
        currentTheme={licenseState?.license?.theme} schoolName={branding?.schoolName}
        isLoaderOpen={modals.loader} onCloseLoader={() => setModals(m => ({ ...m, loader: false }))}
        onImportQzn={async (items) => { for (const item of items) await saveAssessment(item); await handleRefresh(); notify(`Imported ${items.length} assessment(s) successfully.`); }}
      />
      <UpgradeLicenseModal isOpen={modals.upgrade} onClose={() => setModals((m) => ({ ...m, upgrade: false }))} onActivated={refreshLicense} portalUrl={licenseState?.portalUrl} />
      <GlobalDialogHost />
    </div>
  );
};
