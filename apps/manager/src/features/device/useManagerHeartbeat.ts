import { useEffect, useRef } from 'react';
import { deviceApi, DeviceConnectionStatus, UpdatePhase, getAppVersion, socketClient } from '@cbt/shared';
import { getManagerDeviceId, getManagerDeviceName } from './deviceId';

interface ManagerHeartbeatOptions {
  status: DeviceConnectionStatus;
  updateStatus: UpdatePhase;
  updateProgress: number;
  onPushUpdateTriggered?: () => void;
}

export const useManagerHeartbeat = ({
  status,
  updateStatus,
  updateProgress,
  onPushUpdateTriggered,
}: ManagerHeartbeatOptions) => {
  const pushCallbackRef = useRef(onPushUpdateTriggered);
  pushCallbackRef.current = onPushUpdateTriggered;

  useEffect(() => {
    const unsub = socketClient.on('device:push-update', (data) => {
      const target = data?.targetDeviceId;
      const myId = getManagerDeviceId();
      if (!target || target === '*' || target === 'all' || target === myId) {
        pushCallbackRef.current?.();
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const sendHeartbeat = async () => {
      try {
        const res = await deviceApi.reportHeartbeat({
          deviceId: getManagerDeviceId(),
          deviceName: getManagerDeviceName(),
          appType: 'manager',
          appVersion: getAppVersion(),
          platform: navigator.platform || 'Windows',
          status,
          updateStatus,
          updateProgress,
        });
        if (!isCancelled && res.pushUpdate && pushCallbackRef.current) {
          pushCallbackRef.current();
        }
      } catch {}
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 10000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [status, updateStatus, updateProgress]);
};
