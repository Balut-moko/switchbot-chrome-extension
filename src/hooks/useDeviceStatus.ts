import { useEffect, useState } from 'react';
import { sendMessage } from '@/lib/messaging';
import type { DeviceStatus } from '@/types/switchbot';

export function useDeviceStatus(deviceId: string, enabled = true) {
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setLoading(true);

    sendMessage('getDeviceStatus', { deviceId })
      .then((s) => {
        if (!cancelled) setStatus(s);
      })
      .catch(() => {
        // Silently fail - status is optional
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [deviceId, enabled]);

  return { status, loading };
}
