import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCallback, useRef, useState } from 'react';
import DeviceCard from '@/components/DeviceCard';
import DeviceListHeader from '@/components/DeviceListHeader';
import SearchBar from '@/components/SearchBar';
import { useDeviceFiltering } from '@/hooks/useDeviceFiltering';
import { useDeviceReordering } from '@/hooks/useDeviceReordering';
import { useDevices } from '@/hooks/useDevices';
import { useLocale } from '@/hooks/useLocale';
import { useTheme } from '@/hooks/useTheme';
import type { Device } from '@/types/switchbot';
import { t } from '@/utils/i18n';

function SortableDeviceCard({
  device,
  disabled,
  reorderMode,
}: {
  device: Device;
  disabled: boolean;
  reorderMode: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: device.deviceId,
    disabled: !reorderMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    position: 'relative' as const,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DeviceCard
        device={device}
        disabled={disabled}
        reorderMode={reorderMode}
        dragHandleListeners={listeners}
        dragHandleAttributes={attributes}
      />
    </div>
  );
}

export default function DeviceList() {
  const { devices, loading, error, refresh } = useDevices();
  const { theme, setTheme } = useTheme();
  useLocale();
  const [reorderMode, setReorderMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchKeyRef = useRef(0);
  const { query, setQuery, filtered, disabledDeviceIds, preferences, setPreferences, mockMode } =
    useDeviceFiltering(devices);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const { handleDragEnd } = useDeviceReordering({
    filtered,
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
  const toggleSearch = useCallback(() => {
    setSearchOpen((prev) => {
      if (prev) {
        setQuery('');
        searchKeyRef.current += 1;
      }
      return !prev;
    });
  }, [setQuery]);
  const handleSearchBlur = useCallback(() => {
    setSearchOpen(false);
  }, []);

  const deviceIds = filtered.map((d) => d.deviceId);

  return (
    <div className="flex flex-col h-full">
      <DeviceListHeader
        theme={theme}
        mockMode={mockMode}
        loading={loading}
        reorderMode={reorderMode}
        searchOpen={searchOpen}
        onCycleTheme={cycleTheme}
        onRefresh={refresh}
        onToggleReorder={toggleReorderMode}
        onToggleSearch={toggleSearch}
      />

      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          searchOpen && !reorderMode ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-2">
          <SearchBar
            key={searchKeyRef.current}
            onSearch={setQuery}
            onBlur={handleSearchBlur}
            autoFocus={searchOpen}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3">
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
          <SortableContext items={deviceIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {filtered.map((device) => (
                <SortableDeviceCard
                  key={device.deviceId}
                  device={device}
                  disabled={disabledDeviceIds.has(device.deviceId)}
                  reorderMode={reorderMode}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {loading && devices.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-400">{t('LOADING_DEVICES')}</div>
        )}
      </div>
    </div>
  );
}
