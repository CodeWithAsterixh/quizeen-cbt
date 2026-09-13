import React from 'react';
import { EducationLevel, Department, AssessmentType } from '@cbt/shared';
import { AssessmentMetaFields } from './AssessmentMetaFields';
import { AssessmentScheduleFields } from './AssessmentScheduleFields';

interface AssessmentSettingsTabProps {
  subject: string; setSubject: (v: string) => void;
  session: string; setSession: (v: string) => void;
  assessmentType: AssessmentType; setAssessmentType: (v: AssessmentType) => void;
  durationMinutes: number; setDurationMinutes: (v: number) => void;
  passingScore: number; setPassingScore: (v: number) => void;
  educationLevel: EducationLevel; onLevelChange: (lvl: EducationLevel) => void;
  selectedClasses: string[]; onToggleClass: (cls: string) => void;
  department?: Department; setDepartment: (v?: Department) => void;
  isAvailable: boolean; setIsAvailable: (v: boolean) => void;
  availableFrom: string; setAvailableFrom: (v: string) => void;
  availableTo: string; setAvailableTo: (v: string) => void;
}

export const AssessmentSettingsTab: React.FC<AssessmentSettingsTabProps> = (props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <AssessmentMetaFields
        subject={props.subject} setSubject={props.setSubject}
        session={props.session} setSession={props.setSession}
        assessmentType={props.assessmentType} setAssessmentType={props.setAssessmentType}
        durationMinutes={props.durationMinutes} setDurationMinutes={props.setDurationMinutes}
        passingScore={props.passingScore} setPassingScore={props.setPassingScore}
        educationLevel={props.educationLevel} onLevelChange={props.onLevelChange}
        selectedClasses={props.selectedClasses} onToggleClass={props.onToggleClass}
        department={props.department} setDepartment={props.setDepartment}
      />
      <AssessmentScheduleFields
        isAvailable={props.isAvailable} setIsAvailable={props.setIsAvailable}
        availableFrom={props.availableFrom} setAvailableFrom={props.setAvailableFrom}
        availableTo={props.availableTo} setAvailableTo={props.setAvailableTo}
      />
    </div>
  );
};
