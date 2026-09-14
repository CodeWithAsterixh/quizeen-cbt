import React from 'react';
import { Assessment, EducationLevel, Department } from '@cbt/shared';
import { AssessmentEditorModal } from '../../features/assessments/AssessmentEditorModal';
import { StudentEditorModal } from '../../features/students/StudentEditorModal';
import { ServerSettingsModal } from './ServerSettingsModal';
import { QznLoaderModal } from '../../features/packages/QznLoaderModal';

interface Props {
  isEditorOpen: boolean;
  editingAssessment: Assessment | null;
  onCloseEditor: () => void;
  onSaveAssessment: (assessment: Assessment) => Promise<void> | void;
  isStudentModalOpen: boolean;
  onCloseStudentModal: () => void;
  onSaveStudent: (student: { name: string; educationLevel: EducationLevel; classGroup: string; department?: Department }) => Promise<void>;
  isServerModalOpen: boolean;
  onCloseServerModal: () => void;
  isLoaderOpen: boolean;
  onCloseLoader: () => void;
  onImportQzn: (items: Assessment[]) => Promise<void>;
}

export const ManagerModals: React.FC<Props> = ({
  isEditorOpen, editingAssessment, onCloseEditor, onSaveAssessment,
  isStudentModalOpen, onCloseStudentModal, onSaveStudent,
  isServerModalOpen, onCloseServerModal,
  isLoaderOpen, onCloseLoader, onImportQzn,
}) => {
  return (
    <>
      <AssessmentEditorModal
        isOpen={isEditorOpen}
        initialExam={editingAssessment}
        onClose={onCloseEditor}
        onSave={onSaveAssessment}
      />
      <StudentEditorModal
        isOpen={isStudentModalOpen}
        onClose={onCloseStudentModal}
        onSave={onSaveStudent}
      />
      <ServerSettingsModal
        isOpen={isServerModalOpen}
        onClose={onCloseServerModal}
      />
      <QznLoaderModal
        isOpen={isLoaderOpen}
        onClose={onCloseLoader}
        onImport={onImportQzn}
      />
    </>
  );
};
