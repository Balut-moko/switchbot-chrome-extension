import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useCallback, useState } from 'react';
import DeviceListHeader from '@/components/DeviceListHeader';
import DeviceSection from '@/components/DeviceSection';
import SearchBar from '@/components/SearchBar';
import { useDeviceFiltering } from '@/hooks/useDeviceFiltering';
import { useDeviceReordering } from '@/hooks/useDeviceReordering';
import { useDevices } from '@/hooks/useDevices';
import { useLocale } from '@/hooks/useLocale';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/utils/i18n';

export default function DeviceList() {
  const { devices, loading, error, refresh } = useDevices();
  const { theme, setTheme } = useTheme();
  useLocale();
  const [reorderMode, setReorderMode] = useState(false);
  const {
    query,
    setQuery,
    filtered,
    grouped,
    disabledDeviceIds,
    isSearching,
    preferences,
    setPreferences,
    mockMode,
  } = useDeviceFiltering(devices);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const { handleDragEnd } = useDeviceReordering({
    filtered,
    grouped,
    preferences,
    allDevices: devices,
    onPreferencesChange: setPreferences,
  });

  const cycleTheme = () =>
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  const toggleReorderMode = useCallback(() => {
    setReorderMode((prev) => !prev);
    if (reorderMode) setQuery('');
  }, [reorderMode, setQuery]);

  return (
    <div className="flex flex-col h-full">
      <DeviceListHeader
        theme={theme}
        mockMode={mockMode}
        loading={loading}
        reorderMode={reorderMode}
        onCycleTheme={cycleTheme}
        onRefresh={refresh}
        onToggleReorder={toggleReorderMode}
      />

      {!reorderMode && (
        <div className="px-4 py-2">
          <SearchBar onSearch={setQuery} />
        </div>
      )}

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
