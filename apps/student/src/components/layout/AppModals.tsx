import React from 'react';
import { Assessment, StudentSession } from '@cbt/shared';
import { SettingsModal } from '../../features/settings/SettingsModal';
import { StudentCodeModal } from '../../features/profile/StudentCodeModal';
import { AssessmentPinModal } from '../../features/catalog/AssessmentPinModal';

interface AppModalsProps {
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
  onExamsUpdated: (exams: Assessment[]) => void;
  examCount: number;
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
  onClearAll, isProfileOpen, onCloseProfile,
  onProfileSubmit, session, pendingPinExam, isPinOpen, onClosePin, onConfirmPin,
}) => (
  <>
    <SettingsModal
      isOpen={isSettingsOpen}
      onClose={onCloseSettings}
      onExamsUpdated={onExamsUpdated}
      currentExamCount={examCount}
      onClearAll={onClearAll}
    />
    <StudentCodeModal
      isOpen={isProfileOpen}
      onClose={onCloseProfile}
      onProfileSubmit={onProfileSubmit}
    />
    <AssessmentPinModal
      assessment={pendingPinExam}
      isOpen={isPinOpen}
      onClose={onClosePin}
      onConfirm={onConfirmPin}
    />
  </>
);
