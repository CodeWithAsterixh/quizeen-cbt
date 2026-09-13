import http from 'node:http';
import { createApp, RequestLogEntry } from '../src/app.js';
import { ServerBeacon, getLocalIpAddresses } from './discovery.js';

export class ServerManager {
  private server: http.Server | null = null;
  private beacon = new ServerBeacon();
  private startedAt = 0;
  private currentPort = 4000;
  private requestCount = 0;

  constructor(private onLog: (entry: RequestLogEntry) => void) {}

  start(port = 4000): Promise<{ success: boolean; port: number; error?: string }> {
    return new Promise((resolve) => {
      this.stop();
      this.currentPort = port;
      const app = createApp((entry) => {
        this.requestCount++;
        this.onLog(entry);
      });

      this.server = app.listen(port, () => {
        this.startedAt = Date.now();
        this.beacon.start(port);
        resolve({ success: true, port });
      });

      this.server.on('error', (err: any) => {
        this.server = null;
        resolve({ success: false, port, error: err.message });
      });
    });
  }

  stop(): void {
    this.beacon.stop();
    if (this.server) {
      try { this.server.close(); } catch {}
      this.server = null;
    }
    this.startedAt = 0;
  }

  getStatus() {
    return {
      running: Boolean(this.server),
      port: this.currentPort,
      uptimeSeconds: this.startedAt ? Math.floor((Date.now() - this.startedAt) / 1000) : 0,
      ips: getLocalIpAddresses(),
      totalRequests: this.requestCount,
    };
  }
}
