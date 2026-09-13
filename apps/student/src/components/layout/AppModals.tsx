import React from 'react';
import { Assessment, StudentSession } from '@cbt/shared';
import { SettingsModal } from '../../features/settings/SettingsModal';
import { StudentProfileModal } from '../../features/profile/StudentProfileModal';
import { AssessmentPinModal } from '../../features/catalog/AssessmentPinModal';

interface AppModalsProps {
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
  onExamsUpdated: (exams: Assessment[]) => void;
  examCount: number;
  onResetToDefaults: () => Promise<void>;
  onClearAll: () => Promise<void>;
  isProfileOpen: boolean;
  onCloseProfile: () => void;
  onProfileSubmit: (session: StudentSession) => void;
  session: StudentSession | null;
  pendingPinExam: Assessment | null;
  isPinOpen: boolean;
  onClosePin: () => void;
  onConfirmPin: () => void;
}

export const AppModals: React.FC<AppModalsProps> = ({
  isSettingsOpen, onCloseSettings, onExamsUpdated, examCount,
  onResetToDefaults, onClearAll, isProfileOpen, onCloseProfile,
  onProfileSubmit, session, pendingPinExam, isPinOpen, onClosePin, onConfirmPin,
}) => (
  <>
    <SettingsModal
      isOpen={isSettingsOpen}
      onClose={onCloseSettings}
      onExamsUpdated={onExamsUpdated}
      currentExamCount={examCount}
      onResetToDefaults={onResetToDefaults}
      onClearAll={onClearAll}
    />
    <StudentProfileModal
      isOpen={isProfileOpen}
      onClose={onCloseProfile}
      onProfileSubmit={onProfileSubmit}
      initialSession={session}
    />
    <AssessmentPinModal
      assessment={pendingPinExam}
      isOpen={isPinOpen}
      onClose={onClosePin}
      onConfirm={onConfirmPin}
    />
  </>
);
