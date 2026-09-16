import { Assessment } from '../types/types.js';

export type AvailabilityStatus = 'available' | 'upcoming' | 'finished' | 'unavailable';

export interface AssessmentAvailabilityInfo {
  isAvailable: boolean;
  status: AvailabilityStatus;
  label: string;
  badgeColor: 'emerald' | 'amber' | 'rose' | 'blue';
  detail?: string;
}

export function isAssessmentAvailable(assessment: Assessment, now: Date = new Date()): boolean {
  if (assessment.isAvailable === false || assessment.isPublished === false) return false;
  const nowMs = now.getTime();

  if (assessment.availableFrom) {
    const fromMs = new Date(assessment.availableFrom).getTime();
    if (!isNaN(fromMs) && nowMs < fromMs) return false;
  }

  if (assessment.availableTo) {
    const toMs = new Date(assessment.availableTo).getTime();
    if (!isNaN(toMs) && nowMs > toMs) return false;
  }

  return true;
}

export function getAssessmentAvailabilityInfo(
  assessment: Assessment,
  now: Date = new Date()
): AssessmentAvailabilityInfo {
  if (assessment.isAvailable === false || assessment.isPublished === false) {
    return { isAvailable: false, status: 'unavailable', label: 'Hidden', badgeColor: 'rose' };
  }
  const nowMs = now.getTime();

  if (assessment.availableFrom) {
    const fromDate = new Date(assessment.availableFrom);
    if (!isNaN(fromDate.getTime()) && nowMs < fromDate.getTime()) {
      const timeStr = fromDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      return { isAvailable: false, status: 'upcoming', label: 'Upcoming', badgeColor: 'amber', detail: `Opens ${timeStr}` };
    }
  }

  if (assessment.availableTo) {
    const toDate = new Date(assessment.availableTo);
    if (!isNaN(toDate.getTime()) && nowMs > toDate.getTime()) {
      const timeStr = toDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      return { isAvailable: false, status: 'finished', label: 'Finished', badgeColor: 'rose', detail: `Closed ${timeStr}` };
    }
  }

  const closesDetail = assessment.availableTo
    ? `Until ${new Date(assessment.availableTo).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
    : undefined;

  return {
    isAvailable: true,
    status: 'available',
    label: 'Available',
    badgeColor: 'emerald',
    detail: closesDetail,
  };
}
