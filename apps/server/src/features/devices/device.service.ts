import { DeviceInfo, getLocalIsoTimestamp } from '@cbt/shared';
import { broadcastWsEvent, onWsMessage, onWsDisconnect, isDeviceConnected } from '../../core/ws/ws-hub.js';
import { updateService } from '../updates/update.service.js';

interface DeviceRecord extends DeviceInfo {
  lastSeenMs?: number;
}

class DeviceService {
  private devices = new Map<string, DeviceRecord>();
  private pendingUpdates = new Set<string>();

  constructor() {
    onWsMessage((event, data, ws) => {
      if (event === 'device:heartbeat' && data?.deviceId) {
        (ws as any).deviceId = data.deviceId;
        this.recordHeartbeat(data);
      }
    });

    onWsDisconnect((ws) => {
      const id = (ws as any).deviceId;
      if (id && !isDeviceConnected(id)) this.markOffline(id);
    });
  }

  markOffline(deviceId: string): void {
    const dev = this.devices.get(deviceId);
    if (dev && dev.status !== 'offline') {
      dev.status = 'offline';
      broadcastWsEvent('device:status', dev);
    }
  }

  recordHeartbeat(data: Partial<DeviceInfo> & { deviceId: string }): { success: boolean; pushUpdate: boolean } {
    const existing = this.devices.get(data.deviceId);
    const now = getLocalIsoTimestamp();
    const shouldPush = this.pendingUpdates.has(data.deviceId) || this.pendingUpdates.has('*');

    if (shouldPush) this.pendingUpdates.delete(data.deviceId);

    const updated: DeviceRecord = {
      deviceId: data.deviceId,
      deviceName: data.deviceName || existing?.deviceName || 'Station',
      appType: data.appType || existing?.appType || 'student',
      appVersion: data.appVersion || existing?.appVersion || '1.0.0',
      platform: data.platform || existing?.platform || 'win32',
      ip: data.ip || existing?.ip || '127.0.0.1',
      status: (data.status && data.status !== 'offline') ? data.status : 'online',
      currentExam: data.currentExam !== undefined ? data.currentExam : existing?.currentExam,
      updateStatus: data.updateStatus || existing?.updateStatus || 'idle',
      updateProgress: data.updateProgress ?? existing?.updateProgress ?? 0,
      lastSeen: now,
      lastSeenMs: Date.now(),
    };

    this.devices.set(data.deviceId, updated);
    broadcastWsEvent('device:status', updated);
    return { success: true, pushUpdate: shouldPush };
  }

  getAllDevices(): DeviceInfo[] {
    const cutoff = Date.now() - 45000;
    const result: DeviceInfo[] = [];

    for (const dev of this.devices.values()) {
      const ms = dev.lastSeenMs || Date.parse(dev.lastSeen) || 0;
      if (ms < cutoff && dev.status !== 'offline') dev.status = 'offline';
      result.push(dev);
    }

    return result.sort((a, b) => a.deviceName.localeCompare(b.deviceName));
  }

  pushUpdate(deviceId: string): { success: boolean; message: string } {
    if (deviceId !== 'all') {
      const dev = this.devices.get(deviceId);
      if (dev && !updateService.getUpdateFile(dev.appType)) {
        return { success: false, message: `No update package staged on server for ${dev.appType}` };
      }
    }
    if (deviceId === 'all') this.pendingUpdates.add('*');
    else this.pendingUpdates.add(deviceId);
    broadcastWsEvent('device:push-update', { targetDeviceId: deviceId, timestamp: Date.now() });
    return { success: true, message: `Update push queued for ${deviceId}` };
  }

  clearOffline(): void {
    const cutoff = Date.now() - 120000;
    for (const [id, dev] of this.devices.entries()) {
      const ms = dev.lastSeenMs || Date.parse(dev.lastSeen) || 0;
      if (dev.status === 'offline' && ms < cutoff) this.devices.delete(id);
    }
  }
}

export const deviceService = new DeviceService();
