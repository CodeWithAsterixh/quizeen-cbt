import { db } from '../../core/db/database.js';

export interface AnalyticsOverview {
  totalSubmissions: number;
  averageScore: number;
  passRate: number;
  totalInfractions: number;
  cohorts: Record<string, { count: number; totalPct: number; passed: number; averageScore: number; passRate: number }>;
}

export class AnalyticsService {
  public getOverview(): AnalyticsOverview {
    const submissions = db.getSubmissions();
    const total = submissions.length;
    const avg = total > 0 ? Math.round(submissions.reduce((a, s) => a + s.percentage, 0) / total) : 0;
    const passed = submissions.filter((s) => s.percentage >= 50).length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    const infractions = submissions.reduce((a, s) => a + (s.infractionCount || 0), 0);

    const cohorts: AnalyticsOverview['cohorts'] = {};

    submissions.forEach((s) => {
      const key = `${s.classGroup}${s.department ? ` - ${s.department.toUpperCase()}` : ''}`;
      if (!cohorts[key]) cohorts[key] = { count: 0, totalPct: 0, passed: 0, averageScore: 0, passRate: 0 };
      cohorts[key].count += 1;
      cohorts[key].totalPct += s.percentage;
      if (s.percentage >= 50) cohorts[key].passed += 1;
    });

    Object.keys(cohorts).forEach((key) => {
      const c = cohorts[key];
      c.averageScore = Math.round(c.totalPct / c.count);
      c.passRate = Math.round((c.passed / c.count) * 100);
    });

    return { totalSubmissions: total, averageScore: avg, passRate, totalInfractions: infractions, cohorts };
  }
}

export const analyticsService = new AnalyticsService();
