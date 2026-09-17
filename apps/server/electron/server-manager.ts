import http from 'node:http';
import { createApp, RequestLogEntry } from '../src/app.js';
import { getHardwareId } from '../src/features/license/hardware.service.js';
import { ServerBeacon, getLocalIpAddresses } from './discovery.js';
import { findFallbackPort, probeQueezServer } from './port-fallback.js';
import { initWebSocketServer, closeWebSocketServer, broadcastWsEvent } from '../src/core/ws/ws-hub.js';
import { ensureFirewallRule } from './firewall.js';

export interface StartServerResult {
  success: boolean; port: number; error?: string; fallbackFrom?: number; message?: string;
}

export class ServerManager {
  private server: http.Server | null = null;
  private beacon = new ServerBeacon();
  private startedAt = 0;
  private currentPort = 4000;
  private requestCount = 0;

  constructor(private onLog: (entry: RequestLogEntry) => void) {}

  public async detectExisting(port = 4000) {
    const probe = await probeQueezServer(port);
    if (probe.active) return { active: true, url: probe.url, port };
    for (const p of [4050, 4500, 5000]) {
      const alt = await probeQueezServer(p);
      if (alt.active) return { active: true, url: alt.url, port: p };
    }
    return { active: false, url: '' };
  }

  private tryListen(port: number): Promise<{ success: boolean; port: number; error?: string }> {
    return new Promise((resolve) => {
      try {
        const app = createApp((entry) => { this.requestCount++; this.onLog(entry); });
        const srv = http.createServer(app);
        this.server = srv;
        srv.on('error', (err: any) => {
          this.server = null;
          resolve({ success: false, port, error: err?.message || 'Server error' });
        });
        srv.listen(port, '0.0.0.0', () => {
          this.startedAt = Date.now();
          ensureFirewallRule(port);
          try { initWebSocketServer(srv, () => this.getStatus()); } catch {}
          try { this.beacon.start(port); broadcastWsEvent('server:status', this.getStatus()); } catch {}
          resolve({ success: true, port });
        });
      } catch (err: any) {
        this.server = null;
        resolve({ success: false, port, error: err?.message || 'Start failed' });
      }
    });
  }

  async start(requestedPort = 4000): Promise<StartServerResult> {
    this.stop();
    this.currentPort = requestedPort;
    const initial = await this.tryListen(requestedPort);
    if (initial.success) return { success: true, port: requestedPort };

    const probe = await probeQueezServer(requestedPort);
    const fallbackPort = await findFallbackPort(requestedPort);
    if (fallbackPort !== requestedPort) {
      const fallback = await this.tryListen(fallbackPort);
      if (fallback.success) {
        this.currentPort = fallbackPort;
        const msg = (probe.active ? `Another CBT Server is active on port ${requestedPort}. ` : `Port ${requestedPort} is in use. `) + `Started on port ${fallbackPort}.`;
        return { success: true, port: fallbackPort, fallbackFrom: requestedPort, message: msg };
      }
    }
    this.currentPort = requestedPort;
    return { success: false, port: requestedPort, error: initial.error };
  }

  stop(): void {
    try { broadcastWsEvent('server:status', { running: false, port: this.currentPort, uptimeSeconds: 0, ips: getLocalIpAddresses(), totalRequests: this.requestCount, hardwareId: getHardwareId() }); } catch {}
    try { closeWebSocketServer(); } catch {}
    this.beacon.stop();
    if (this.server) {
      try { (this.server as any).closeAllConnections?.(); (this.server as any).closeIdleConnections?.(); this.server.close(); } catch {}
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
      hardwareId: getHardwareId(),
    };
  }
}
