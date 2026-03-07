import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Monitor, Moon, RefreshCw, Settings, Sun } from 'lucide-react';
import { useCallback, useState } from 'react';
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

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  const toggleReorderMode = useCallback(() => {
    setReorderMode((prev) => !prev);
    if (reorderMode) setQuery('');
  }, [reorderMode, setQuery]);

  const openSettings = () => {
    browser.runtime.openOptionsPage();
  };

  return (
    <div className="flex flex-col h-full">
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
                className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={`Theme: ${theme}`}
              >
                <ThemeIcon className="w-4.5 h-4.5" />
              </button>
              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className={`p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${loading ? 'animate-spin' : ''}`}
                title={t('REFRESH')}
              >
                <RefreshCw className="w-4.5 h-4.5" />
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
              className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={t('SETTINGS')}
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

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
