import http from 'node:http';
import { execFile } from 'node:child_process';
import { createApp, RequestLogEntry } from '../src/app.js';
import { getHardwareId } from '../src/features/license/hardware.service.js';
import { ServerBeacon, getLocalIpAddresses } from './discovery.js';
import { findFallbackPort, probeQueezServer } from './port-fallback.js';

export interface StartServerResult {
  success: boolean; port: number; error?: string; fallbackFrom?: number; message?: string;
}

// Ensure Windows Firewall allows inbound TCP on the given port.
// Without this rule, other machines on the same LAN are blocked even though
// the server binds to 0.0.0.0. Errors are silently swallowed - the server
// still starts; the rule is just advisory.
function ensureFirewallRule(port: number): void {
  if (process.platform !== 'win32') return;
  const ruleName = `Queez CBT Server Port ${port}`;
  // Delete stale rule for this port, then re-add. Runs without elevation via
  // the existing elevated installer context; silently fails if not elevated.
  execFile('netsh', [
    'advfirewall', 'firewall', 'add', 'rule',
    `name=${ruleName}`,
    'dir=in', 'action=allow', 'protocol=TCP',
    `localport=${port}`,
    'profile=private,domain',
    'enable=yes',
  ], { windowsHide: true }, () => {});
  // Also allow UDP on discovery port 4001
  execFile('netsh', [
    'advfirewall', 'firewall', 'add', 'rule',
    'name=Queez CBT Discovery',
    'dir=in', 'action=allow', 'protocol=UDP',
    'localport=4001',
    'profile=private,domain',
    'enable=yes',
  ], { windowsHide: true }, () => {});
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
          try { this.beacon.start(port); } catch {}
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
        const msg = probe.active
          ? `Another Queez Server is active on port ${requestedPort}. Started on port ${fallbackPort}.`
          : `Port ${requestedPort} is in use. Started on port ${fallbackPort}.`;
        return { success: true, port: fallbackPort, fallbackFrom: requestedPort, message: msg };
      }
    }
    this.currentPort = requestedPort;
    return { success: false, port: requestedPort, error: initial.error };
  }

  stop(): void {
    this.beacon.stop();
    if (this.server) { try { this.server.close(); } catch {} this.server = null; }
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
