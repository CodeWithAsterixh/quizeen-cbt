import { Exam } from '../types/index.js';

export const SEED_PRIMARY_EXAMS: Exam[] = [
  {
    id: 'exam_pri_math_5',
    title: 'Primary 5 Term Assessment - Basic Mathematics',
    subject: 'Mathematics',
    session: '2024/2025',
    assessmentType: 'test',
    educationLevel: 'primary',
    targetClasses: ['Primary 5', 'Primary 6'],
    durationMinutes: 30,
    passingScore: 60,
    totalPoints: 30,
    teacherName: 'Mrs. Adebayo',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q_pri_1',
        prompt: 'What is 3/4 converted to a decimal?',
        type: 'multiple_choice',
        options: ['0.25', '0.50', '0.75', '1.25'],
        correctAnswer: '0.75',
        points: 10,
        explanation: '3 divided by 4 equals 0.75.',
      },
      {
        id: 'q_pri_2',
        prompt: 'A square has four equal sides.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 10,
        explanation: 'A square is a regular quadrilateral with 4 equal sides.',
      },
      {
        id: 'q_pri_3',
        prompt: 'If a pen costs 50 Naira, how much do 6 pens cost?',
        type: 'multiple_choice',
        options: ['200 Naira', '250 Naira', '300 Naira', '350 Naira'],
        correctAnswer: '300 Naira',
        points: 10,
        explanation: '50 * 6 = 300.',
      },
    ],
  },
];
