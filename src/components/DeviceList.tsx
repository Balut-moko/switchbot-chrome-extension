import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DeviceSection from '@/components/DeviceSection';
import SearchBar from '@/components/SearchBar';
import { useDevices } from '@/hooks/useDevices';
import { useTheme } from '@/hooks/useTheme';
import { sendMessage } from '@/lib/messaging';
import { devicePreferencesItem } from '@/lib/storage';
import type { Device } from '@/types/switchbot';
import { type GroupedDevices, getDeviceGroup, groupDevices } from '@/utils/device';
import { t } from '@/utils/i18n';

export default function DeviceList() {
  const { devices, loading, error, refresh } = useDevices();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [reorderMode, setReorderMode] = useState(false);
  const [mockMode, setMockMode] = useState(false);
  const [preferences, setPreferences] = useState<
    Record<string, { visible: boolean; order: number; disabled?: boolean }>
  >({});

  useEffect(() => {
    devicePreferencesItem.getValue().then(setPreferences);
    sendMessage('isMockMode', undefined)
      .then(setMockMode)
      .catch(() => {});
  }, []);

  const handleSearch = useCallback((q: string) => {
    setQuery(q.toLowerCase());
  }, []);

  const openSettings = () => {
    browser.runtime.openOptionsPage();
  };

  const hasPrefs = Object.keys(preferences).length > 0;

  const visibleDevices = useMemo(() => {
    if (!hasPrefs) return devices;

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

  const grouped = useMemo(
    () => groupDevices(filtered, { preserveOrder: hasPrefs }),
    [filtered, hasPrefs],
  );
  const isSearching = query.length > 0;

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  const themeIcon =
    theme === 'light' ? '\u2600\uFE0F' : theme === 'dark' ? '\uD83C\uDF19' : '\uD83D\uDCBB';

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const activeId = String(active.id);
      const overId = String(over.id);

      // Find which group both items belong to
      const activeDevice = filtered.find((d) => d.deviceId === activeId);
      const overDevice = filtered.find((d) => d.deviceId === overId);
      if (!activeDevice || !overDevice) return;

      const activeGroup = getDeviceGroup(activeDevice);
      const overGroup = getDeviceGroup(overDevice);
      if (activeGroup !== overGroup) return;

      // Get the current group's devices in order
      const groupKey = activeGroup === 'sensors' ? 'sensors' : 'controls';
      const groupDeviceList = [...grouped[groupKey as keyof GroupedDevices]];

      const oldIndex = groupDeviceList.findIndex((d) => d.deviceId === activeId);
      const newIndex = groupDeviceList.findIndex((d) => d.deviceId === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      // Reorder the list
      const [moved] = groupDeviceList.splice(oldIndex, 1);
      groupDeviceList.splice(newIndex, 0, moved);

      // Build new order values: reassign order for all devices in both groups
      const otherGroupKey = groupKey === 'controls' ? 'sensors' : 'controls';
      const otherGroupDevices = grouped[otherGroupKey as keyof GroupedDevices];

      // Controls come first in order, then sensors
      const allOrdered: Device[] =
        groupKey === 'controls'
          ? [...groupDeviceList, ...otherGroupDevices]
          : [...otherGroupDevices, ...groupDeviceList];

      const updatedPrefs = { ...preferences };
      for (let i = 0; i < allOrdered.length; i++) {
        const deviceId = allOrdered[i].deviceId;
        updatedPrefs[deviceId] = {
          ...updatedPrefs[deviceId],
          visible: updatedPrefs[deviceId]?.visible ?? true,
          order: i,
        };
      }

      // Also preserve order for hidden devices (not in visibleDevices)
      let maxOrder = allOrdered.length;
      for (const device of devices) {
        if (!allOrdered.find((d) => d.deviceId === device.deviceId)) {
          if (updatedPrefs[device.deviceId]) {
            updatedPrefs[device.deviceId] = {
              ...updatedPrefs[device.deviceId],
              order: maxOrder++,
            };
          }
        }
      }

      setPreferences(updatedPrefs);
      devicePreferencesItem.setValue(updatedPrefs);
    },
    [filtered, grouped, preferences, devices],
  );

  const toggleReorderMode = () => {
    setReorderMode((prev) => !prev);
    if (reorderMode) {
      // Exiting reorder mode - clear search
      setQuery('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold dark:text-gray-200">SwitchBot</h1>
          {mockMode && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold leading-none rounded bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              Demo Mode
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!reorderMode && (
            <>
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
                title={t('REFRESH')}
              >
                {'\u{1F504}'}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={toggleReorderMode}
            className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
              reorderMode
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={reorderMode ? t('REORDER_MODE_DONE') : t('REORDER_MODE')}
          >
            {reorderMode ? t('REORDER_MODE_DONE') : t('REORDER_MODE')}
          </button>
          {!reorderMode && (
            <button
              type="button"
              onClick={openSettings}
              className="text-lg hover:opacity-70"
              title={t('SETTINGS')}
            >
              {'\u2699\uFE0F'}
            </button>
          )}
        </div>
      </div>

      {/* Search (hidden in reorder mode) */}
      {!reorderMode && (
        <div className="px-4 py-2">
          <SearchBar onSearch={handleSearch} />
        </div>
      )}

      {/* Device List */}
      <div className="flex-1 overflow-y-auto px-4 pb-3 space-y-3">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-md border border-red-200 dark:border-red-800">
            {t(error)}
          </div>
        )}

        {!loading && filtered.length === 0 && !error && (
          <div className="text-center py-8 text-sm text-gray-400">
            {query ? t('NO_SEARCH_RESULTS') : t('NO_DEVICES')}
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {grouped.controls.length > 0 && (
            <DeviceSection
              title={t('SECTION_CONTROLS')}
              devices={grouped.controls}
              forceExpand={isSearching}
              variant="controls"
              disabledDeviceIds={disabledDeviceIds}
              reorderMode={reorderMode}
            />
          )}

          {grouped.sensors.length > 0 && (
            <DeviceSection
              title={t('SECTION_SENSORS')}
              devices={grouped.sensors}
              forceExpand={isSearching}
              variant="sensors"
              disabledDeviceIds={disabledDeviceIds}
              reorderMode={reorderMode}
            />
          )}
        </DndContext>

        {loading && devices.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-400">{t('LOADING_DEVICES')}</div>
        )}
      </div>
    </div>
  );
}
