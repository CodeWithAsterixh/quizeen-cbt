export interface LogEntry {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  status: number;
  durationMs: number;
  ip: string;
}

export interface ServerStatus {
  running: boolean;
  port: number;
  uptimeSeconds: number;
  ips: string[];
  totalRequests: number;
  hardwareId?: string;
}
