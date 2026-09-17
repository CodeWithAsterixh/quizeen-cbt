import { execFile } from 'node:child_process';

const configuredPorts = new Set<number>();
let discoveryConfigured = false;

export function ensureFirewallRule(port: number): void {
  if (process.platform !== 'win32') return;
  if (!configuredPorts.has(port)) {
    configuredPorts.add(port);
    const ruleName = `Queez CBT Server Port ${port}`;
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
      'name=Queez CBT Discovery', 'dir=in', 'action=allow', 'protocol=UDP',
      'localport=4001', 'profile=any', 'enable=yes',
    ], { windowsHide: true }, () => {});
    p.unref?.();
  }
}
