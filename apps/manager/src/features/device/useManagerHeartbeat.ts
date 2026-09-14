import { useEffect, useRef } from 'react';
import { deviceApi, DeviceConnectionStatus, UpdatePhase } from '@cbt/shared';
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
    let isCancelled = false;

    const sendHeartbeat = async () => {
      try {
        const res = await deviceApi.reportHeartbeat({
          deviceId: getManagerDeviceId(),
          deviceName: getManagerDeviceName(),
          appType: 'manager',
          appVersion: '1.2.0',
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
