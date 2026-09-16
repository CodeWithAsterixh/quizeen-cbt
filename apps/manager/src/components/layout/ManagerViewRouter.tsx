import React from 'react';
import { Assessment, Submission, Student } from '@cbt/shared';
import { ManagerTab } from './Sidebar';
import { DashboardView } from '../../features/dashboard/DashboardView';
import { AssessmentListView } from '../../features/assessments/AssessmentListView';
import { AssessmentDetailPage } from '../../features/assessments/AssessmentDetailPage';
import { PackageCompilerView } from '../../features/compiler/PackageCompilerView';
import { GradingQueueView } from '../../features/grading/GradingQueueView';
import { StudentResultDetailPage } from '../../features/grading/StudentResultDetailPage';
import { AnalyticsView } from '../../features/analytics/AnalyticsView';
import { StudentListView } from '../../features/students/StudentListView';

interface Props {
  currentTab: ManagerTab;
  assessments: Assessment[];
  submissions: Submission[];
  students: Student[];
  selectedExamId: string | null;
  selectedSubmissionId: string | null;
  onSelectExam: (id: string | null) => void;
  onSelectSubmission: (id: string | null) => void;
  onNavigate: (t: ManagerTab) => void;
  onOpenCreateExam: () => void;
  onOpenLoader: () => void;
  onEditExam: (a: Assessment) => void;
  onDuplicateExam: (a: Assessment) => void;
  onDeleteExam: (id: string) => void;
  onOpenCreateStudent: () => void;
  onEditStudent?: (s: Student) => void;
  onMoveStudents?: (ids: string[], direction: 'next' | 'prev') => Promise<void>;
  onGenerateCode: (id: string) => Promise<string>;
  onGenerateCodes: (ids: string[]) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
  onUpdateSubmission: (s: Submission) => Promise<void>;
}

export const ManagerViewRouter: React.FC<Props> = (props) => {
  const {
    currentTab, assessments, submissions, students, selectedExamId, selectedSubmissionId,
    onSelectExam, onSelectSubmission, onNavigate, onOpenCreateExam, onOpenLoader,
    onEditExam, onDuplicateExam, onDeleteExam, onOpenCreateStudent, onEditStudent,
    onMoveStudents, onGenerateCode, onGenerateCodes, onDeleteStudent, onUpdateSubmission,
  } = props;

  const activeSub = submissions.find((s) => s.id === selectedSubmissionId);
  const activeAssessment = assessments.find((e) => e.id === (activeSub ? activeSub.examId : selectedExamId));

  if (activeSub && activeAssessment) {
    return (
      <StudentResultDetailPage
        submission={activeSub} exam={activeAssessment}
        onSave={onUpdateSubmission} onBack={() => onSelectSubmission(null)}
        backLabel={selectedExamId ? 'Back to Assessment Details' : 'Back to Marking Queue'}
      />
    );
  }

  if (activeAssessment && currentTab === 'exams') {
    return (
      <AssessmentDetailPage
        assessment={activeAssessment} submissions={submissions}
        onBack={() => onSelectExam(null)} onDuplicate={onDuplicateExam}
        onEdit={onEditExam} onDelete={onDeleteExam}
        onSelectSubmission={(s) => onSelectSubmission(s.id)}
      />
    );
  }

  return (
    <>
      {currentTab === 'dashboard' && <DashboardView exams={assessments} submissions={submissions} onNavigate={onNavigate} onOpenCreateExam={onOpenCreateExam} onOpenLoader={onOpenLoader} />}
      {currentTab === 'exams' && <AssessmentListView assessments={assessments} submissions={submissions} onOpenAssessment={(e) => onSelectExam(e.id)} onOpenCreate={onOpenCreateExam} onEditAssessment={onEditExam} onDuplicateAssessment={onDuplicateExam} onDeleteAssessment={onDeleteExam} onOpenLoader={onOpenLoader} />}
      {currentTab === 'students' && <StudentListView students={students} onOpenCreate={onOpenCreateStudent} onEditStudent={onEditStudent} onMoveStudents={onMoveStudents} onGenerateCode={onGenerateCode} onGenerateCodes={onGenerateCodes} onDeleteStudent={onDeleteStudent} />}
      {currentTab === 'compiler' && <PackageCompilerView exams={assessments} />}
      {currentTab === 'grading' && <GradingQueueView submissions={submissions} exams={assessments} onUpdateSubmission={onUpdateSubmission} />}
      {currentTab === 'analytics' && <AnalyticsView submissions={submissions} exams={assessments} />}
    </>
  );
};
