import React from 'react';
import { DeviceInfo, Badge, Button } from '@cbt/shared';

interface Props {
  device: DeviceInfo;
  onPushUpdate: (id: string) => void;
  isPushing?: boolean;
}

type BadgeColor = 'blue' | 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | undefined;

const getStatusColor = (status: string): BadgeColor => {
  if (status === 'in_exam') return 'amber';
  if (status === 'updating') return 'blue';
  if (status === 'online') return 'emerald';
  return undefined;
};

export const ServerDeviceRow: React.FC<Props> = ({ device, onPushUpdate, isPushing }) => {
  const canUpdate = device.status !== 'offline' && device.status !== 'in_exam' && device.status !== 'updating';
  const progressText = device.updateProgress !== undefined ? ` (${device.updateProgress}%)` : '';

  return (
    <tr style={{ borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
      <td style={{ padding: '10px 12px', fontWeight: 600 }}>
        <div>{device.deviceName || device.deviceId.slice(0, 8)}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontFamily: 'monospace' }}>
          {device.ip}
        </div>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <Badge color={device.appType === 'student' ? 'blue' : 'amber'}>
          {device.appType === 'student' ? 'Student Station' : 'Manager'}
        </Badge>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <Badge color={getStatusColor(device.status)}>
          {device.status.replace('_', ' ').toUpperCase()}{progressText}
        </Badge>
      </td>
      <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
        v{device.appVersion}
      </td>
      <td style={{ padding: '10px 12px', color: 'var(--color-text-subtle)', fontSize: '0.75rem' }}>
        {new Date(device.lastSeen).toLocaleTimeString()}
      </td>
      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
        <Button
          size="sm"
          variant="secondary"
          disabled={!canUpdate || isPushing}
          onClick={() => onPushUpdate(device.deviceId)}
        >
          {device.status === 'in_exam' ? 'In Exam' : 'Push Update'}
        </Button>
      </td>
    </tr>
  );
};
