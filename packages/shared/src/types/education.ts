export type EducationLevel = 'junior_secondary' | 'senior_secondary' | 'external';

export interface EducationLevelConfig {
  id: EducationLevel;
  name: string;
  shortLabel: string;
  description: string;
  classes: string[];
  hasDepartments: boolean;
}

export type Department = 'science' | 'arts' | 'commercial';

export interface DepartmentConfig {
  id: Department;
  name: string;
  description: string;
}

export const EDUCATION_LEVELS: EducationLevelConfig[] = [
  {
    id: 'junior_secondary',
    name: 'Junior Secondary School',
    shortLabel: 'JSS',
    description: 'Basic secondary education (JSS 1 to 3)',
    classes: ['JSS 1', 'JSS 2', 'JSS 3'],
    hasDepartments: false,
  },
  {
    id: 'senior_secondary',
    name: 'Senior Secondary School',
    shortLabel: 'SSS',
    description: 'Specialized secondary education with departments (SSS 1 to 3)',
    classes: ['SSS 1', 'SSS 2', 'SSS 3'],
    hasDepartments: true,
  },
  {
    id: 'external',
    name: 'External / Professional',
    shortLabel: 'External',
    description: 'External candidates, JAMB UTME, WAEC SSCE, NECO, and Professional prep',
    classes: ['External Candidate', 'JAMB / UTME', 'WAEC / SSCE', 'NECO / GCE'],
    hasDepartments: true,
  },
];

export const DEPARTMENTS: DepartmentConfig[] = [
  {
    id: 'science',
    name: 'Science',
    description: 'Physics, Chemistry, Biology, Mathematics, Further Maths',
  },
  {
    id: 'arts',
    name: 'Arts / Humanities',
    description: 'Literature in English, Government, History, CRS/IRS',
  },
  {
    id: 'commercial',
    name: 'Commercial / Business',
    description: 'Financial Accounting, Commerce, Economics, Book Keeping',
  },
];

export function getLevelConfig(levelId: EducationLevel): EducationLevelConfig | undefined {
  return EDUCATION_LEVELS.find((lvl) => lvl.id === levelId);
}

export function getAllClassesForLevel(levelId: EducationLevel): string[] {
  return getLevelConfig(levelId)?.classes ?? [];
}
