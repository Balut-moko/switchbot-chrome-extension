import { useCallback, useMemo, useState } from 'react';
import DeviceSection from '@/components/DeviceSection';
import SearchBar from '@/components/SearchBar';
import { useDevices } from '@/hooks/useDevices';
import { groupDevices } from '@/utils/device';

export default function DeviceList() {
  const { devices, loading, error, refresh } = useDevices();
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((q: string) => {
    setQuery(q.toLowerCase());
  }, []);

  const openSettings = () => {
    browser.runtime.openOptionsPage();
  };

  const filtered = query
    ? devices.filter((d) => d.deviceName.toLowerCase().includes(query))
    : devices;

  const grouped = useMemo(() => groupDevices(filtered), [filtered]);
  const isSearching = query.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h1 className="text-base font-bold">SwitchBot</h1>
        <div className="flex items-center gap-2">
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
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200">
            {error}
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
