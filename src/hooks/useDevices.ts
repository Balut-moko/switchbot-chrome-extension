import { useState, useEffect, useCallback } from 'react';
import { sendMessage } from '@/lib/messaging';
import type { Device } from '@/types/switchbot';

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const result = await sendMessage('getDevices', { forceRefresh });
      setDevices(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load cached first, then refresh in background
    fetchDevices(false).then(() => fetchDevices(true));
  }, [fetchDevices]);

  const refresh = useCallback(() => fetchDevices(true), [fetchDevices]);

  return { devices, loading, error, refresh };
}
