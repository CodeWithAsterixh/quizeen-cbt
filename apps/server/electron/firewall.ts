import { execFile } from 'node:child_process';

export function ensureFirewallRule(port: number): void {
  if (process.platform !== 'win32') return;
  const ruleName = `Queez CBT Server Port ${port}`;
  execFile('netsh', [
    'advfirewall', 'firewall', 'add', 'rule',
    `name=${ruleName}`, 'dir=in', 'action=allow', 'protocol=TCP',
    `localport=${port}`, 'profile=any', 'enable=yes',
  ], { windowsHide: true }, () => {});

  execFile('netsh', [
    'advfirewall', 'firewall', 'add', 'rule',
    'name=Queez CBT Discovery', 'dir=in', 'action=allow', 'protocol=UDP',
    'localport=4001', 'profile=any', 'enable=yes',
  ], { windowsHide: true }, () => {});
}
