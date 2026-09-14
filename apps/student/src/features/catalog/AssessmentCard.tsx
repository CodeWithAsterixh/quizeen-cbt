import { Assessment, Badge, Button, Card } from '@cbt/shared';
import { CheckCircle, CheckSquareIcon, ClockIcon, LockKey, Play } from '@cbt/shared';
import React from 'react';

interface AssessmentCardProps {
  assessment: Assessment;
  isSubmitted?: boolean;
  onSelectAssessment: (assessment: Assessment) => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
  isSubmitted = false,
  onSelectAssessment,
}) => {
  const isExam = assessment.assessmentType === 'exam';

  return (
    <article aria-label={assessment.title}>
      <Card
        accent={isSubmitted ? undefined : 'blue'}
        isInteractive={!isSubmitted}
        style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16, opacity: isSubmitted ? 0.85 : 1 }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
              {assessment.subject}
            </h2>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Badge color={isExam ? 'purple' : 'blue'}>{isExam ? 'Exam' : 'Test'}</Badge>
              {assessment.department && <Badge color="purple">{assessment.department.toUpperCase()}</Badge>}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: 14 }}>
            <div><span style={{ color: 'var(--color-text-subtle)', marginRight: 6 }}>Class:</span><strong style={{ color: 'var(--color-text)' }}>{assessment.targetClasses?.join(', ') || assessment.educationLevel}</strong></div>
            <div><span style={{ color: 'var(--color-text-subtle)', marginRight: 6 }}>Session:</span><strong style={{ color: 'var(--color-text)' }}>{assessment.session || '2024/2025'}</strong></div>
            {assessment.availableTo && (
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                Closes {new Date(assessment.availableTo).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.85rem', color: 'var(--color-text-muted)', paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ClockIcon size={16} color="var(--color-primary)" />
              <span>{assessment.durationMinutes} mins</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckSquareIcon size={16} color="var(--color-success)" />
              <span>{assessment.questions.length} questions</span>
            </span>
            {assessment.unlockPin && !isSubmitted && (
              <Badge color="amber" icon={<LockKey size={14} />}>PIN Protected</Badge>
            )}
          </div>
        </div>

        {isSubmitted ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, backgroundColor: 'var(--color-bg-subtle, #f1f5f9)', border: '1px solid var(--color-border, #e2e8f0)', color: 'var(--color-text-muted, #64748b)', fontSize: '0.88rem', fontWeight: 600, marginTop: 4 }}>
            <CheckCircle size={18} weight="fill" color="var(--color-success, #10b981)" />
            <span>Already Submitted</span>
          </div>
        ) : (
          <Button variant="primary" onClick={() => onSelectAssessment(assessment)} icon={<Play size={18} weight="fill" />} style={{ width: '100%', marginTop: 4 }}>
            Start {isExam ? 'Exam' : 'Test'}
          </Button>
        )}
      </Card>
    </article>
  );
};

export const ExamCard = AssessmentCard;
