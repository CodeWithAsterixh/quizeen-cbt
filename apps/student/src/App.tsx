import React, { useState } from 'react';
import { Assessment, StudentSession, Submission, useAppLicense, LicenseLockoutScreen } from '@cbt/shared';
import { TitleBar } from './components/layout/TitleBar';
import { AppModals } from './components/layout/AppModals';
import { StartScreen } from './features/start/StartScreen';
import { AssessmentCatalog } from './features/catalog/AssessmentCatalog';
import { AssessmentRunner } from './features/runner/AssessmentRunner';
import { AssessmentCompletedScreen } from './features/completion/AssessmentCompletedScreen';
import { useStudentAppStore } from './store/useStudentAppStore';
import { useStudentSync } from './features/profile/useStudentSync';
import { useDeviceHeartbeat } from './features/device/useDeviceHeartbeat';
import { useStationUpdater } from './features/device/useStationUpdater';
import { UpdateProgressModal } from './features/device/UpdateProgressModal';

export const App: React.FC = () => {
  const { assessments, submissions, refresh, saveSubmission, importAssessments, clearAllAssessments } = useStudentAppStore();
  const [session, setSession] = useState<StudentSession | null>(null);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [pendingPinAssessment, setPendingPinAssessment] = useState<Assessment | null>(null);
  const [latestSub, setLatestSub] = useState<Submission | null>(null);
  const [view, setView] = useState<'start' | 'catalog' | 'running' | 'completed'>('start');
  const [modalState, setModalState] = useState({ settings: false, profile: false, pin: false });

  const { licenseState, isLocked, refreshLicense } = useAppLicense();
  const { isRefreshing, handleRefresh } = useStudentSync(session, setSession, refresh);
  const isExamActive = view === 'running';
  const updater = useStationUpdater(isExamActive);

  useDeviceHeartbeat({
    status: isExamActive ? 'in_exam' : updater.phase === 'downloading' || updater.phase === 'installing' ? 'updating' : 'online',
    currentExam: activeAssessment ? { examId: activeAssessment.id, examTitle: activeAssessment.title, studentName: session?.studentName || 'Candidate' } : null,
    updateStatus: updater.phase, updateProgress: updater.progress,
    onPushUpdateTriggered: () => { if (!isExamActive) updater.startDownload(); },
  });

  const handleExit = () => { setSession(null); setLatestSub(null); setView('start'); };
  const handleSelect = (a: Assessment) => {
    if (a.unlockPin?.trim()) { setPendingPinAssessment(a); setModalState(s => ({ ...s, pin: true })); } else { setActiveAssessment(a); setView('running'); }
  };
  const handleSubmit = async (sub: Submission) => {
    await saveSubmission(sub); setLatestSub(sub); setActiveAssessment(null); setView('completed');
  };

  if (isLocked) {
    return <LicenseLockoutScreen licenseState={licenseState} onRetry={refreshLicense} />;
  }

  const branding = licenseState?.license?.branding;
  return (
    <div className="app-shell">
      <TitleBar
        title={branding?.appName || branding?.schoolName || 'Queez'}
        badge={branding?.shortName ? `${branding.shortName} Portal` : 'Student Portal'}
        iconUrl={branding?.appIconUrl || branding?.logoUrl}
      />
      <main className="app-content">
        {view === 'start' && (
          <StartScreen onStartExamClick={() => { setSession(null); setModalState(s => ({ ...s, profile: true })); }} onOpenSettings={() => setModalState(s => ({ ...s, settings: true }))} examCount={assessments.length} />
        )}
        {view === 'catalog' && session && (
          <AssessmentCatalog
            student={session} assessments={assessments} submissions={submissions}
            onSelectAssessment={handleSelect} onChangeProfile={() => setModalState(s => ({ ...s, profile: true }))}
            onExit={handleExit} onRefresh={handleRefresh} isRefreshing={isRefreshing}
          />
        )}
        {view === 'running' && activeAssessment && session && (
          <AssessmentRunner assessment={activeAssessment} student={session} onSubmitAssessment={handleSubmit} />
        )}
        {view === 'completed' && latestSub && (
          <AssessmentCompletedScreen submission={latestSub} onReturnToHome={handleExit} />
        )}
      </main>

      <AppModals
        isSettingsOpen={modalState.settings} onCloseSettings={() => setModalState(s => ({ ...s, settings: false }))}
        onExamsUpdated={importAssessments} examCount={assessments.length} onClearAll={clearAllAssessments}
        isProfileOpen={modalState.profile} onCloseProfile={() => setModalState(s => ({ ...s, profile: false }))}
        onProfileSubmit={(s) => { setSession(s); setModalState(m => ({ ...m, profile: false })); setView('catalog'); }}
        session={session} pendingPinExam={pendingPinAssessment} isPinOpen={modalState.pin}
        onClosePin={() => { setModalState(s => ({ ...s, pin: false })); setPendingPinAssessment(null); }}
        onConfirmPin={() => {
          if (pendingPinAssessment) {
            setActiveAssessment(pendingPinAssessment); setPendingPinAssessment(null); setModalState(s => ({ ...s, pin: false })); setView('running');
          }
        }}
      />

      <UpdateProgressModal
        isOpen={updater.showModal} phase={updater.phase} progress={updater.progress}
        currentVersion={(window as any).electronApi?.appVersion || ''}
        latestVersion={updater.latestVersion} error={updater.error}
        onStart={updater.startDownload} onDismiss={updater.dismissModal}
      />
    </div>
  );
};
