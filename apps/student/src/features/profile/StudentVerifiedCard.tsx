import React from 'react';
import { CheckCircle } from '@cbt/shared';
import { Student, Badge } from '@cbt/shared';

interface Props {
  student: Student;
}

export const StudentVerifiedCard: React.FC<Props> = ({ student }) => {
  return (
    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: 14, display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534', fontWeight: 700 }}>
        <CheckCircle size={22} weight="fill" />
        <span>Student Verified</span>
      </div>
      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>{student.name}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Badge color="emerald">{student.classGroup}</Badge>
        {student.department && <Badge color="purple">{student.department}</Badge>}
        {student.code && <Badge color="blue">ID: {student.code}</Badge>}
      </div>
    </div>
  );
};
