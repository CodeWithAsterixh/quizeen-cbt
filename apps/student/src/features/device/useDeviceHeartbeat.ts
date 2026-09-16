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

    const sendHeartbeat = async () => {
      try {
        const res = await deviceApi.reportHeartbeat({
          deviceId: getStationDeviceId(),
          deviceName: getStationName(),
          appType: 'student',
          appVersion: getAppVersion(),
          platform: navigator.platform || 'Windows',
          status,
          currentExam: currentExam || null,
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
  }, [status, currentExam, updateStatus, updateProgress]);
};
