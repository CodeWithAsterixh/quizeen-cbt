import { DeviceInfo, getLocalIsoTimestamp } from '@cbt/shared';

class DeviceService {
  private devices = new Map<string, DeviceInfo>();
  private pendingUpdates = new Set<string>();

  recordHeartbeat(data: Partial<DeviceInfo> & { deviceId: string }): { success: boolean; pushUpdate: boolean } {
    const existing = this.devices.get(data.deviceId);
    const now = getLocalIsoTimestamp();
    const shouldPush = this.pendingUpdates.has(data.deviceId) || this.pendingUpdates.has('*');

    if (shouldPush) {
      this.pendingUpdates.delete(data.deviceId);
    }

    const updated: DeviceInfo = {
      deviceId: data.deviceId,
      deviceName: data.deviceName || existing?.deviceName || 'Station',
      appType: data.appType || existing?.appType || 'student',
      appVersion: data.appVersion || existing?.appVersion || '1.0.0',
      platform: data.platform || existing?.platform || 'win32',
      ip: data.ip || existing?.ip || '127.0.0.1',
      status: data.status || existing?.status || 'online',
      currentExam: data.currentExam !== undefined ? data.currentExam : existing?.currentExam,
      updateStatus: data.updateStatus || existing?.updateStatus || 'idle',
      updateProgress: data.updateProgress ?? existing?.updateProgress ?? 0,
      lastSeen: now,
    };

    this.devices.set(data.deviceId, updated);
    return { success: true, pushUpdate: shouldPush };
  }

  getAllDevices(): DeviceInfo[] {
    const cutoff = Date.now() - 45000;
    const result: DeviceInfo[] = [];

    for (const [id, dev] of this.devices.entries()) {
      const lastSeenMs = Date.parse(dev.lastSeen) || 0;
      if (lastSeenMs < cutoff && dev.status !== 'offline') {
        dev.status = 'offline';
      }
      result.push(dev);
    }

    return result.sort((a, b) => a.deviceName.localeCompare(b.deviceName));
  }

  pushUpdate(deviceId: string): boolean {
    if (deviceId === 'all') {
      this.pendingUpdates.add('*');
      return true;
    }
    this.pendingUpdates.add(deviceId);
    return true;
  }

  clearOffline(): void {
    const cutoff = Date.now() - 120000;
    for (const [id, dev] of this.devices.entries()) {
      if ((Date.parse(dev.lastSeen) || 0) < cutoff) {
        this.devices.delete(id);
      }
    }
  }
}

export const deviceService = new DeviceService();
