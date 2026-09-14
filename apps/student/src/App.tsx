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
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isPinOpen, setPinOpen] = useState(false);

  const { licenseState, isLocked, refreshLicense } = useAppLicense();
  const { isRefreshing, handleRefresh } = useStudentSync(session, setSession, refresh);
  const isExamActive = view === 'running';
  const updater = useStationUpdater(isExamActive);

  useDeviceHeartbeat({
    status: isExamActive ? 'in_exam' : updater.phase === 'downloading' || updater.phase === 'installing' ? 'updating' : 'online',
    currentExam: activeAssessment ? {
      examId: activeAssessment.id, examTitle: activeAssessment.title,
      studentName: session ? session.studentName : 'Candidate',
    } : null,
    updateStatus: updater.phase, updateProgress: updater.progress,
    onPushUpdateTriggered: () => { if (!isExamActive) updater.startDownload(); },
  });

  const handleExit = () => { setSession(null); setLatestSub(null); setView('start'); };
  const handleSelect = (a: Assessment) => {
    if (a.unlockPin?.trim()) { setPendingPinAssessment(a); setPinOpen(true); }
    else { setActiveAssessment(a); setView('running'); }
  };
  const handleSubmit = async (sub: Submission) => {
    await saveSubmission(sub); setLatestSub(sub); setActiveAssessment(null); setView('completed');
  };

  if (isLocked) {
    return <LicenseLockoutScreen licenseState={licenseState} onRetry={refreshLicense} />;
  }

  return (
    <div className="app-shell">
      <TitleBar title="Queez" badge="Student Portal" />
      <main className="app-content">
        {view === 'start' && (
          <StartScreen onStartExamClick={() => { setSession(null); setProfileOpen(true); }} onOpenSettings={() => setSettingsOpen(true)} examCount={assessments.length} />
        )}
        {view === 'catalog' && session && (
          <AssessmentCatalog
            student={session} assessments={assessments} submissions={submissions}
            onSelectAssessment={handleSelect} onChangeProfile={() => setProfileOpen(true)}
            onExit={handleExit} onRefresh={handleRefresh} isRefreshing={isRefreshing}
          />
        )}
        {view === 'running' && activeAssessment && session && (
          <AssessmentRunner assessment={activeAssessment} student={session} onSubmitAssessment={handleSubmit} onQuit={() => { setActiveAssessment(null); setView('catalog'); }} />
        )}
        {view === 'completed' && latestSub && (
          <AssessmentCompletedScreen submission={latestSub} onReturnToHome={handleExit} />
        )}
      </main>

      <AppModals
        isSettingsOpen={isSettingsOpen} onCloseSettings={() => setSettingsOpen(false)}
        onExamsUpdated={importAssessments} examCount={assessments.length} onClearAll={clearAllAssessments}
        isProfileOpen={isProfileOpen} onCloseProfile={() => setProfileOpen(false)}
        onProfileSubmit={(s) => { setSession(s); setProfileOpen(false); setView('catalog'); }}
        session={session} pendingPinExam={pendingPinAssessment} isPinOpen={isPinOpen}
        onClosePin={() => { setPinOpen(false); setPendingPinAssessment(null); }}
        onConfirmPin={() => {
          if (pendingPinAssessment) {
            setActiveAssessment(pendingPinAssessment); setPendingPinAssessment(null); setPinOpen(false); setView('running');
          }
        }}
      />

      <UpdateProgressModal
        isOpen={updater.showModal} phase={updater.phase} progress={updater.progress}
        latestVersion={updater.latestVersion} error={updater.error}
        onStart={updater.startDownload} onDismiss={updater.dismissModal}
      />
    </div>
  );
};
