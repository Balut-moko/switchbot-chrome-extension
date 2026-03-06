import { useCallback, useEffect, useMemo, useState } from 'react';
import DeviceSection from '@/components/DeviceSection';
import SearchBar from '@/components/SearchBar';
import { useDevices } from '@/hooks/useDevices';
import { useTheme } from '@/hooks/useTheme';
import { devicePreferencesItem } from '@/lib/storage';
import { groupDevices } from '@/utils/device';
import { t } from '@/utils/i18n';

export default function DeviceList() {
  const { devices, loading, error, refresh } = useDevices();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [preferences, setPreferences] = useState<
    Record<string, { visible: boolean; order: number }>
  >({});

  useEffect(() => {
    devicePreferencesItem.getValue().then(setPreferences);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setQuery(q.toLowerCase());
  }, []);

  const openSettings = () => {
    browser.runtime.openOptionsPage();
  };

  const visibleDevices = useMemo(() => {
    const hasPrefs = Object.keys(preferences).length > 0;
    if (!hasPrefs) return devices;

    return devices
      .filter((d) => preferences[d.deviceId]?.visible !== false)
      .sort((a, b) => {
        const orderA = preferences[a.deviceId]?.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = preferences[b.deviceId]?.order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });
  }, [devices, preferences]);

  const filtered = query
    ? visibleDevices.filter((d) => d.deviceName.toLowerCase().includes(query))
    : visibleDevices;

  const grouped = useMemo(() => groupDevices(filtered), [filtered]);
  const isSearching = query.length > 0;

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  const themeIcon =
    theme === 'light' ? '\u2600\uFE0F' : theme === 'dark' ? '\uD83C\uDF19' : '\uD83D\uDCBB';

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <h1 className="text-base font-bold dark:text-gray-200">SwitchBot</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cycleTheme}
            className="text-lg hover:opacity-70"
            title={`Theme: ${theme}`}
          >
            {themeIcon}
          </button>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className={`text-lg hover:opacity-70 ${loading ? 'animate-spin' : ''}`}
            title="Refresh"
          >
            {'\u{1F504}'}
          </button>
          <button
            type="button"
            onClick={openSettings}
            className="text-lg hover:opacity-70"
            title="Settings"
          >
            {'\u2699\uFE0F'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Device List */}
      <div className="flex-1 overflow-y-auto px-4 pb-3 space-y-3">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-md border border-red-200 dark:border-red-800">
            {t(error)}
          </div>
        )}

        {!loading && filtered.length === 0 && !error && (
          <div className="text-center py-8 text-sm text-gray-400">
            {query ? 'No devices match your search.' : 'No devices found.'}
          </div>
        )}

        {grouped.controls.length > 0 && (
          <DeviceSection
            title="Controls"
            devices={grouped.controls}
            forceExpand={isSearching}
            variant="controls"
          />
        )}

        {grouped.sensors.length > 0 && (
          <DeviceSection
            title="Sensors"
            devices={grouped.sensors}
            forceExpand={isSearching}
            variant="sensors"
          />
        )}

        {loading && devices.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-400">Loading devices...</div>
        )}
      </div>
    </div>
  );
}
