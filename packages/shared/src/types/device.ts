export type DeviceAppType = 'student' | 'manager' | 'server';

export type DeviceConnectionStatus = 'online' | 'in_exam' | 'updating' | 'offline';

export type UpdatePhase = 'idle' | 'checking' | 'downloading' | 'installing' | 'ready' | 'failed';

export interface ActiveExamInfo {
  examId: string;
  examTitle: string;
  studentName: string;
  startedAt?: string;
}

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  appType: DeviceAppType;
  appVersion: string;
  platform: string;
  ip: string;
  status: DeviceConnectionStatus;
  currentExam?: ActiveExamInfo | null;
  updateStatus: UpdatePhase;
  updateProgress: number;
  lastSeen: string;
}

export interface UpdateCheckResult {
  updateAvailable: boolean;
  currentVersion: string;
  latestVersion: string;
  downloadUrl?: string;
  packageSize?: number;
  sha256?: string;
  releaseNotes?: string;
}

export interface UpdateProgress {
  phase: UpdatePhase;
  progressPercent: number;
  transferredBytes: number;
  totalBytes: number;
  error?: string;
}
