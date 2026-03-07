import { useCallback, useEffect, useMemo, useState } from 'react';
import { sendMessage } from '@/lib/messaging';
import { devicePreferencesItem } from '@/lib/storage';
import type { Device } from '@/types/switchbot';
import { sortDevicesByCategory } from '@/utils/device';

type DevicePreferences = Record<string, { visible: boolean; order: number; disabled?: boolean }>;

interface UseDeviceFilteringResult {
  query: string;
  setQuery: (q: string) => void;
  filtered: Device[];
  disabledDeviceIds: Set<string>;
  preferences: DevicePreferences;
  setPreferences: (prefs: DevicePreferences) => void;
  mockMode: boolean;
}

/**
 * デバイスのフィルタリング・ソート・プリファレンス適用ロジックを提供するカスタムフック。
 */
export function useDeviceFiltering(devices: Device[]): UseDeviceFilteringResult {
  const [query, setQueryRaw] = useState('');
  const [mockMode, setMockMode] = useState(false);
  const [preferences, setPreferences] = useState<DevicePreferences>({});

  useEffect(() => {
    devicePreferencesItem.getValue().then(setPreferences);
    sendMessage('isMockMode', undefined)
      .then(setMockMode)
      .catch(() => {});
  }, []);

  const handleSearch = useCallback((q: string) => {
    setQueryRaw(q.toLowerCase());
  }, []);

  const hasPrefs = Object.keys(preferences).length > 0;

  const visibleDevices = useMemo(() => {
    if (!hasPrefs) return sortDevicesByCategory(devices);

    return devices
      .filter((d) => preferences[d.deviceId]?.visible !== false)
      .sort((a, b) => {
        const orderA = preferences[a.deviceId]?.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = preferences[b.deviceId]?.order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });
  }, [devices, preferences, hasPrefs]);

  const filtered = query
    ? visibleDevices.filter((d) => d.deviceName.toLowerCase().includes(query))
    : visibleDevices;

  const disabledDeviceIds = useMemo(() => {
    const ids = new Set<string>();
    for (const [id, pref] of Object.entries(preferences)) {
      if (pref.disabled) ids.add(id);
    }
    return ids;
  }, [preferences]);

  return {
    query,
    setQuery: handleSearch,
    filtered,
    disabledDeviceIds,
    preferences,
    setPreferences,
    mockMode,
  };
}
