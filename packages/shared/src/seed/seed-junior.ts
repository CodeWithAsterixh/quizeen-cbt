import { Exam } from '../types/index.js';

export const SEED_JUNIOR_EXAMS: Exam[] = [
  {
    id: 'exam_jss2_basic_tech',
    title: 'JSS 2 Mid-Term Test - Basic Science & Technology',
    subject: 'Basic Technology',
    session: '2024/2025',
    assessmentType: 'test',
    educationLevel: 'junior_secondary',
    targetClasses: ['JSS 2'],
    durationMinutes: 35,
    passingScore: 50,
    totalPoints: 30,
    teacherName: 'Engr. Okonkwo',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q_jss_1',
        prompt: 'Which of the following is a first-class lever?',
        type: 'multiple_choice',
        options: ['Wheelbarrow', 'See-saw', 'Nutcracker', 'Tweezers'],
        correctAnswer: 'See-saw',
        points: 10,
        explanation: 'In a first-class lever, the fulcrum is between effort and load.',
      },
      {
        id: 'q_jss_2',
        prompt: 'Kinetic energy is the energy possessed by a body in motion.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 10,
        explanation: 'Kinetic energy depends on mass and velocity.',
      },
      {
        id: 'q_jss_3',
        prompt: 'What tool is used for driving and drawing out nails?',
        type: 'multiple_choice',
        options: ['Claw hammer', 'Ball peen hammer', 'Mallet', 'Sledgehammer'],
        correctAnswer: 'Claw hammer',
        points: 10,
        explanation: 'A claw hammer has a curved claw designed to lever out nails.',
      },
    ],
  },
];
