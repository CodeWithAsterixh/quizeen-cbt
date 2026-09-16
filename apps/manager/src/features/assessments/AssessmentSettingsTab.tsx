import React, { useState } from 'react';
import { EducationLevel, Department, AssessmentType, Clock, GraduationCap, CalendarBlank, ArrowsClockwise } from '@cbt/shared';
import { SettingsGroupRow } from './SettingsGroupRow';
import { getAvailabilityPhrase, getAudiencePhrase, getTimingPhrase, getShufflingPhrase } from './settings-phrases';
import { EditAvailabilityModal } from './EditAvailabilityModal';
import { EditAudienceModal } from './EditAudienceModal';
import { EditTimingModal } from './EditTimingModal';
import { EditShufflingModal } from './EditShufflingModal';

interface Props {
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
  shuffleQuestions: boolean; setShuffleQuestions: (v: boolean) => void;
  shuffleOptions: boolean; setShuffleOptions: (v: boolean) => void;
}

export const AssessmentSettingsTab: React.FC<Props> = (p) => {
  const [activeModal, setActiveModal] = useState<'timing' | 'audience' | 'availability' | 'shuffling' | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <SettingsGroupRow
        icon={<Clock size={20} />} title="Subject & Assessment Timing"
        phrase={getTimingPhrase(p.durationMinutes, p.passingScore, p.assessmentType)}
        onEdit={() => setActiveModal('timing')} badge={p.subject || 'Not set'}
      />
      <SettingsGroupRow
        icon={<GraduationCap size={20} />} title="Target Audience & Department"
        phrase={getAudiencePhrase(p.selectedClasses, p.educationLevel, p.department)}
        onEdit={() => setActiveModal('audience')}
      />
      <SettingsGroupRow
        icon={<CalendarBlank size={20} />} title="Availability & Access Window"
        phrase={getAvailabilityPhrase(p.isAvailable, p.availableFrom, p.availableTo)}
        onEdit={() => setActiveModal('availability')}
      />
      <SettingsGroupRow
        icon={<ArrowsClockwise size={20} />} title="Shuffling & Security"
        phrase={getShufflingPhrase(p.shuffleQuestions, p.shuffleOptions)}
        onEdit={() => setActiveModal('shuffling')}
      />

      <EditTimingModal
        isOpen={activeModal === 'timing'} subject={p.subject} session={p.session}
        assessmentType={p.assessmentType} durationMinutes={p.durationMinutes} passingScore={p.passingScore}
        onClose={() => setActiveModal(null)}
        onSave={(d) => { p.setSubject(d.subject); p.setSession(d.session); p.setAssessmentType(d.assessmentType); p.setDurationMinutes(d.durationMinutes); p.setPassingScore(d.passingScore); }}
      />
      <EditAudienceModal
        isOpen={activeModal === 'audience'} educationLevel={p.educationLevel}
        selectedClasses={p.selectedClasses} department={p.department} onClose={() => setActiveModal(null)}
        onSave={(d) => { p.onLevelChange(d.educationLevel); d.selectedClasses.forEach(c => { if (!p.selectedClasses.includes(c)) p.onToggleClass(c); }); p.selectedClasses.forEach(c => { if (!d.selectedClasses.includes(c)) p.onToggleClass(c); }); p.setDepartment(d.department); }}
      />
      <EditAvailabilityModal
        isOpen={activeModal === 'availability'} isAvailable={p.isAvailable}
        availableFrom={p.availableFrom} availableTo={p.availableTo} onClose={() => setActiveModal(null)}
        onSave={(d) => { p.setIsAvailable(d.isAvailable); p.setAvailableFrom(d.availableFrom); p.setAvailableTo(d.availableTo); }}
      />
      <EditShufflingModal
        isOpen={activeModal === 'shuffling'} shuffleQuestions={p.shuffleQuestions}
        shuffleOptions={p.shuffleOptions} onClose={() => setActiveModal(null)}
        onSave={(d) => { p.setShuffleQuestions(d.shuffleQuestions); p.setShuffleOptions(d.shuffleOptions); }}
      />
    </div>
  );
};
