import { Exam } from '../types/index.js';

export const SEED_ARTS_EXAMS: Exam[] = [
  {
    id: 'exam_sss2_literature',
    title: 'SSS 2 Literature in English - Drama & Poetry',
    subject: 'Literature in English',
    session: '2024/2025',
    assessmentType: 'exam',
    educationLevel: 'senior_secondary',
    targetClasses: ['SSS 2', 'SSS 3'],
    department: 'arts',
    durationMinutes: 40,
    passingScore: 50,
    totalPoints: 30,
    teacherName: 'Mrs. Folake',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q_lit_1',
        prompt: 'What literary device compares two unlike things using "like" or "as"?',
        type: 'multiple_choice',
        options: ['Metaphor', 'Simile', 'Personification', 'Hyperbole'],
        correctAnswer: 'Simile',
        points: 10,
        explanation: 'Similes explicitly use like or as.',
      },
      {
        id: 'q_lit_2',
        prompt: 'Dramatic irony occurs when the audience knows what characters do not.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 10,
        explanation: 'The audience possesses key knowledge ahead of the characters.',
      },
      {
        id: 'q_lit_3',
        prompt: 'A poem consisting of fourteen lines in rhymed iambic pentameter is a:',
        type: 'multiple_choice',
        options: ['Ballad', 'Ode', 'Sonnet', 'Elegy'],
        correctAnswer: 'Sonnet',
        points: 10,
        explanation: 'A 14-line poem with fixed meter is a sonnet.',
      },
    ],
  },
];
