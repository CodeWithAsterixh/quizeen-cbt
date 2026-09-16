import React from 'react';
import { Assessment, StudentSession } from '@cbt/shared';
import { StudentCodeModal } from '../../features/profile/StudentCodeModal';
import { AssessmentPinModal } from '../../features/catalog/AssessmentPinModal';

interface AppModalsProps {
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
  isProfileOpen, onCloseProfile,
  onProfileSubmit, session, pendingPinExam, isPinOpen, onClosePin, onConfirmPin,
}) => (
  <>
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
