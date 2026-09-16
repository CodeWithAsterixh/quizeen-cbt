import React, { useState, useEffect, useCallback } from 'react';
import { DeviceInfo, deviceApi, Button, ArrowsClockwise, Trash, socketClient } from '@cbt/shared';
import { ServerDeviceRow } from './ServerDeviceRow';

export const ServerDevicesTab: React.FC = () => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [filter, setFilter] = useState<'all' | 'student' | 'manager'>('all');
  const [pushingId, setPushingId] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    const list = await deviceApi.getConnectedDevices();
    setDevices(list);
  }, []);

  useEffect(() => {
    fetchDevices();
    const unsub1 = socketClient.on('device:status', fetchDevices);
    const unsub2 = socketClient.on('device:push-update', fetchDevices);
    return () => { unsub1(); unsub2(); };
  }, [fetchDevices]);

  const handlePush = async (deviceId: string) => {
    setPushingId(deviceId);
    await deviceApi.pushUpdate(deviceId);
    setTimeout(() => {
      setPushingId(null);
      fetchDevices();
    }, 1000);
  };

  const handleClearOffline = async () => {
    await deviceApi.clearOfflineDevices();
    fetchDevices();
  };

  const filtered = devices.filter((d) => (filter === 'all' ? true : d.appType === filter));
  const activeCount = devices.filter((d) => d.status !== 'offline').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Connected Devices</h2>
          <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
            {activeCount} active station{activeCount === 1 ? '' : 's'} connected across local network
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="sm" variant="secondary" onClick={handleClearOffline} icon={<Trash size={14} />}>
            Clear Offline
          </Button>
          <Button size="sm" variant="secondary" onClick={fetchDevices} icon={<ArrowsClockwise size={14} />}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="server-card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)', fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
              <th style={{ padding: '8px 12px' }}>STATION</th>
              <th style={{ padding: '8px 12px' }}>TYPE</th>
              <th style={{ padding: '8px 12px' }}>STATUS</th>
              <th style={{ padding: '8px 12px' }}>VERSION</th>
              <th style={{ padding: '8px 12px' }}>LAST SEEN</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-subtle)' }}>
                  No connected devices reported yet. Stations register upon launch.
                </td>
              </tr>
            ) : (
              filtered.map((dev) => (
                <ServerDeviceRow
                  key={dev.deviceId}
                  device={dev}
                  onPushUpdate={handlePush}
                  isPushing={pushingId === dev.deviceId}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
