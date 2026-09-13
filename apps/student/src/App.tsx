import React, { useState } from 'react';
import { Assessment, StudentSession, Submission } from '@cbt/shared';
import { TitleBar } from './components/layout/TitleBar';
import { AppModals } from './components/layout/AppModals';
import { StartScreen } from './features/start/StartScreen';
import { AssessmentCatalog } from './features/catalog/AssessmentCatalog';
import { AssessmentRunner } from './features/runner/AssessmentRunner';
import { AssessmentCompletedScreen } from './features/completion/AssessmentCompletedScreen';
import { useStudentAppStore } from './store/useStudentAppStore';

export const App: React.FC = () => {
  const { assessments, submissions, saveSubmission, importAssessments, clearAllAssessments } = useStudentAppStore();
  const [session, setSession] = useState<StudentSession | null>(null);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [pendingPinAssessment, setPendingPinAssessment] = useState<Assessment | null>(null);
  const [latestSub, setLatestSub] = useState<Submission | null>(null);
  const [view, setView] = useState<'start' | 'catalog' | 'running' | 'completed'>('start');
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isPinOpen, setPinOpen] = useState(false);

  const handleSelectAssessment = (assessment: Assessment) => {
    if (assessment.unlockPin?.trim()) {
      setPendingPinAssessment(assessment);
      setPinOpen(true);
    } else {
      setActiveAssessment(assessment);
      setView('running');
    }
  };

  const handleSubmitAssessment = async (sub: Submission) => {
    await saveSubmission(sub);
    setLatestSub(sub);
    setActiveAssessment(null);
    setView('completed');
  };

  return (
    <div className="app-shell">
      <TitleBar title="Queez" badge="Student Portal" />
      <main className="app-content">
        {view === 'start' && (
          <StartScreen
            onStartExamClick={() => (session ? setView('catalog') : setProfileOpen(true))}
            onOpenSettings={() => setSettingsOpen(true)}
            examCount={assessments.length}
          />
        )}
        {view === 'catalog' && session && (
          <AssessmentCatalog
            student={session}
            assessments={assessments}
            submissions={submissions}
            onSelectAssessment={handleSelectAssessment}
            onChangeProfile={() => setProfileOpen(true)}
            onExit={() => { setSession(null); setView('start'); }}
          />
        )}
        {view === 'running' && activeAssessment && session && (
          <AssessmentRunner
            assessment={activeAssessment}
            student={session}
            onSubmitAssessment={handleSubmitAssessment}
            onQuit={() => { setActiveAssessment(null); setView('catalog'); }}
          />
        )}
        {view === 'completed' && latestSub && (
          <AssessmentCompletedScreen
            submission={latestSub}
            onReturnToHome={() => { setLatestSub(null); setView('start'); }}
          />
        )}
      </main>

      <AppModals
        isSettingsOpen={isSettingsOpen} onCloseSettings={() => setSettingsOpen(false)}
        onExamsUpdated={importAssessments} examCount={assessments.length}
        onClearAll={clearAllAssessments}
        isProfileOpen={isProfileOpen} onCloseProfile={() => setProfileOpen(false)}
        onProfileSubmit={(s) => { setSession(s); setProfileOpen(false); setView('catalog'); }}
        session={session} pendingPinExam={pendingPinAssessment} isPinOpen={isPinOpen}
        onClosePin={() => { setPinOpen(false); setPendingPinAssessment(null); }}
        onConfirmPin={() => {
          if (pendingPinAssessment) {
            setActiveAssessment(pendingPinAssessment);
            setPendingPinAssessment(null);
            setPinOpen(false);
            setView('running');
          }
        }}
      />
    </div>
  );
};
