import { useEffect, useRef } from 'react';
import { deviceApi, DeviceConnectionStatus, UpdatePhase, ActiveExamInfo, getAppVersion, socketClient } from '@cbt/shared';
import { getStationDeviceId, getStationName } from './deviceId';

interface HeartbeatOptions {
  status: DeviceConnectionStatus;
  currentExam?: ActiveExamInfo | null;
  updateStatus: UpdatePhase;
  updateProgress: number;
  onPushUpdateTriggered?: () => void;
}

export const useDeviceHeartbeat = ({
  status,
  currentExam,
  updateStatus,
  updateProgress,
  onPushUpdateTriggered,
}: HeartbeatOptions) => {
  const pushCallbackRef = useRef(onPushUpdateTriggered);
  pushCallbackRef.current = onPushUpdateTriggered;

  useEffect(() => {
    const unsub = socketClient.on('device:push-update', (data) => {
      const target = data?.targetDeviceId;
      const myId = getStationDeviceId();
      if (!target || target === '*' || target === 'all' || target === myId) {
        pushCallbackRef.current?.();
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const buildPayload = () => ({
      deviceId: getStationDeviceId(),
      deviceName: getStationName(),
      appType: 'student' as const,
      appVersion: getAppVersion(),
      platform: navigator.platform || 'Windows',
      status,
      currentExam: currentExam || null,
      updateStatus,
      updateProgress,
    });

    const sendHeartbeat = async () => {
      const payload = buildPayload();
      socketClient.send('device:heartbeat', payload);
      try {
        const res = await deviceApi.reportHeartbeat(payload);
        if (!isCancelled && res.pushUpdate && pushCallbackRef.current) {
          pushCallbackRef.current();
        }
      } catch {}
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 10000);
    const unsubConn = socketClient.onConnectionChange((connected) => {
      if (connected) sendHeartbeat();
    });

    return () => {
      isCancelled = true;
      clearInterval(interval);
      unsubConn();
    };
  }, [status, currentExam, updateStatus, updateProgress]);
};
