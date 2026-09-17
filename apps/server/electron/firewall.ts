import { execFile } from 'node:child_process';
import { bakedWhitelabelConfig } from '@cbt/shared';

const configuredPorts = new Set<number>();
let discoveryConfigured = false;

export function ensureFirewallRule(port: number): void {
  if (process.platform !== 'win32') return;
  const srvName = bakedWhitelabelConfig?.serverName || 'Queez CBT Server';
  if (!configuredPorts.has(port)) {
    configuredPorts.add(port);
    const ruleName = `${srvName} Port ${port}`;
    const p = execFile('netsh', [
      'advfirewall', 'firewall', 'add', 'rule',
      `name=${ruleName}`, 'dir=in', 'action=allow', 'protocol=TCP',
      `localport=${port}`, 'profile=any', 'enable=yes',
    ], { windowsHide: true }, () => {});
    p.unref?.();
  }

  if (!discoveryConfigured) {
    discoveryConfigured = true;
    const p = execFile('netsh', [
      'advfirewall', 'firewall', 'add', 'rule',
      `name=${srvName} Discovery`, 'dir=in', 'action=allow', 'protocol=UDP',
      'localport=4001', 'profile=any', 'enable=yes',
    ], { windowsHide: true }, () => {});
    p.unref?.();
  }
}
