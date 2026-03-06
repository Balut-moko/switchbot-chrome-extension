import {
  closestCenter,
  DndContext,
  type DragEndEvent,
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDevices } from '@/hooks/useDevices';
import { devicePreferencesItem } from '@/lib/storage';
import type { Device } from '@/types/switchbot';
import {
  getDeviceIcon,
  getOptionsDeviceGroup,
  groupDevicesForOptions,
  type OptionsDeviceGroup,
} from '@/utils/device';
import { t } from '@/utils/i18n';

type DevicePreferences = Record<string, { visible: boolean; order: number; disabled?: boolean }>;

interface DeviceWithPrefs {
  device: Device;
  visible: boolean;
  order: number;
  disabled: boolean;
}

function ensurePreferences(devices: Device[], prefs: DevicePreferences): DevicePreferences {
  const updated = { ...prefs };
  let maxOrder = -1;
  for (const p of Object.values(updated)) {
    if (p.order > maxOrder) maxOrder = p.order;
  }

  let changed = false;
  for (const device of devices) {
    if (!(device.deviceId in updated)) {
      maxOrder += 1;
      updated[device.deviceId] = { visible: true, order: maxOrder };
      changed = true;
    }
  }

  return changed ? updated : prefs;
}

function buildSortedList(devices: Device[], prefs: DevicePreferences): DeviceWithPrefs[] {
  return devices
    .map((device) => {
      const p = prefs[device.deviceId] ?? { visible: true, order: 999999 };
      return { device, visible: p.visible, order: p.order, disabled: p.disabled ?? false };
    })
    .sort((a, b) => a.order - b.order);
}

/** 6-dot drag handle icon */
function DragHandle({
  listeners,
  attributes,
}: {
  listeners?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
}) {
  return (
    <button
      type="button"
      className="cursor-grab active:cursor-grabbing touch-none p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      {...listeners}
      {...attributes}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <circle cx="5" cy="3" r="1.5" />
        <circle cx="11" cy="3" r="1.5" />
        <circle cx="5" cy="8" r="1.5" />
        <circle cx="11" cy="8" r="1.5" />
        <circle cx="5" cy="13" r="1.5" />
        <circle cx="11" cy="13" r="1.5" />
      </svg>
    </button>
  );
}

function SortableDeviceRow({
  item,
  onToggleVisible,
  onToggleDisabled,
}: {
  item: DeviceWithPrefs;
  onToggleVisible: (deviceId: string) => void;
  onToggleDisabled: (deviceId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.device.deviceId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 10 : undefined,
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 py-2 px-2 rounded-md border transition-colors ${
        isDragging
          ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
      }`}
    >
      {/* Drag handle */}
      <DragHandle listeners={listeners} attributes={attributes} />

      {/* Visibility checkbox */}
      <input
        type="checkbox"
        checked={item.visible}
        onChange={() => onToggleVisible(item.device.deviceId)}
        className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500 h-4 w-4 flex-shrink-0"
        title={item.visible ? 'Visible' : 'Hidden'}
      />

      {/* Device icon */}
      <span className="text-base flex-shrink-0">{getDeviceIcon(item.device)}</span>

      {/* Device name */}
      <span className="text-sm font-medium flex-1 min-w-0 truncate dark:text-gray-200">
        {item.device.deviceName}
      </span>

      {/* Device type badge */}
      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded flex-shrink-0">
        {item.device.deviceType}
      </span>

      {/* Disable control checkbox */}
      <label
        className={`flex items-center gap-1.5 text-xs flex-shrink-0 ${
          !item.visible ? 'opacity-30 pointer-events-none' : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        <input
          type="checkbox"
          checked={item.disabled}
          onChange={() => onToggleDisabled(item.device.deviceId)}
          disabled={!item.visible}
          className="rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 h-4 w-4"
        />
        {t('DEVICE_DISABLED_LABEL')}
      </label>
    </div>
  );
}

const GROUP_LABELS: Record<OptionsDeviceGroup, string> = {
  controls: 'SECTION_CONTROLS',
  sensors: 'SECTION_SENSORS',
  ir: 'SECTION_IR_DEVICES',
};

const GROUP_ORDER: OptionsDeviceGroup[] = ['controls', 'sensors', 'ir'];

function DeviceGroupSection({
  groupKey,
  items,
  onToggleVisible,
  onToggleDisabled,
}: {
  groupKey: OptionsDeviceGroup;
  items: DeviceWithPrefs[];
  onToggleVisible: (deviceId: string) => void;
  onToggleDisabled: (deviceId: string) => void;
}) {
  const deviceIds = items.map((item) => item.device.deviceId);

  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
        <span>{t(GROUP_LABELS[groupKey])}</span>
        <span className="text-gray-400 dark:text-gray-500 font-normal normal-case tracking-normal">
          {items.length}
        </span>
      </h3>
      <SortableContext items={deviceIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {items.map((item) => (
            <SortableDeviceRow
              key={item.device.deviceId}
              item={item}
              onToggleVisible={onToggleVisible}
              onToggleDisabled={onToggleDisabled}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function DeviceSettings() {
  const { devices, loading, error } = useDevices();
  const [prefs, setPrefs] = useState<DevicePreferences>({});
  const [prefsLoading, setPrefsLoading] = useState(true);

  // Load preferences from storage
  useEffect(() => {
    devicePreferencesItem.getValue().then((stored) => {
      setPrefs(stored);
      setPrefsLoading(false);
    });
  }, []);

  // Auto-initialize preferences for new devices
  useEffect(() => {
    if (devices.length === 0 || prefsLoading) return;
    const updated = ensurePreferences(devices, prefs);
    if (updated !== prefs) {
      setPrefs(updated);
      devicePreferencesItem.setValue(updated);
    }
  }, [devices, prefs, prefsLoading]);

  const savePrefs = useCallback((next: DevicePreferences) => {
    setPrefs(next);
    devicePreferencesItem.setValue(next);
  }, []);

  const toggleVisible = useCallback(
    (deviceId: string) => {
      const current = prefs[deviceId];
      if (!current) return;
      savePrefs({
        ...prefs,
        [deviceId]: { ...current, visible: !current.visible },
      });
    },
    [prefs, savePrefs],
  );

  const toggleDisabled = useCallback(
    (deviceId: string) => {
      const current = prefs[deviceId];
      if (!current) return;
      savePrefs({
        ...prefs,
        [deviceId]: { ...current, disabled: !(current.disabled ?? false) },
      });
    },
    [prefs, savePrefs],
  );

  const hasPrefs = Object.keys(prefs).length > 0;

  const sortedList = useMemo(() => buildSortedList(devices, prefs), [devices, prefs]);

  // Group devices into categories (preserving user order within groups)
  const grouped = useMemo((): Record<OptionsDeviceGroup, DeviceWithPrefs[]> => {
    const result: Record<OptionsDeviceGroup, DeviceWithPrefs[]> = {
      controls: [],
      sensors: [],
      ir: [],
    };

    for (const item of sortedList) {
      const group = getOptionsDeviceGroup(item.device);
      result[group].push(item);
    }

    // If no prefs exist, sort by category within groups
    if (!hasPrefs) {
      const groupedDevices = groupDevicesForOptions(devices);
      for (const groupKey of GROUP_ORDER) {
        result[groupKey] = groupedDevices[groupKey].map((device) => {
          const p = prefs[device.deviceId] ?? { visible: true, order: 999999 };
          return { device, visible: p.visible, order: p.order, disabled: p.disabled ?? false };
        });
      }
    }

    return result;
  }, [sortedList, hasPrefs, devices, prefs]);

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
      const activeDevice = sortedList.find((item) => item.device.deviceId === activeId)?.device;
      const overDevice = sortedList.find((item) => item.device.deviceId === overId)?.device;
      if (!activeDevice || !overDevice) return;

      const activeGroup = getOptionsDeviceGroup(activeDevice);
      const overGroup = getOptionsDeviceGroup(overDevice);
      if (activeGroup !== overGroup) return; // Only allow reorder within same group

      // Get the current group's items in order
      const groupItems = [...grouped[activeGroup]];
      const oldIndex = groupItems.findIndex((item) => item.device.deviceId === activeId);
      const newIndex = groupItems.findIndex((item) => item.device.deviceId === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      // Reorder within the group
      const [moved] = groupItems.splice(oldIndex, 1);
      groupItems.splice(newIndex, 0, moved);

      // Rebuild order: all groups in order (controls -> sensors -> ir)
      const allOrdered: Device[] = [];
      for (const groupKey of GROUP_ORDER) {
        if (groupKey === activeGroup) {
          for (const item of groupItems) {
            allOrdered.push(item.device);
          }
        } else {
          for (const item of grouped[groupKey]) {
            allOrdered.push(item.device);
          }
        }
      }

      const updatedPrefs = { ...prefs };
      for (let i = 0; i < allOrdered.length; i++) {
        const deviceId = allOrdered[i].deviceId;
        updatedPrefs[deviceId] = {
          ...updatedPrefs[deviceId],
          visible: updatedPrefs[deviceId]?.visible ?? true,
          order: i,
        };
      }

      // Preserve order for devices not in allOrdered (e.g. devices not loaded yet)
      let maxOrder = allOrdered.length;
      for (const deviceId of Object.keys(updatedPrefs)) {
        if (!allOrdered.find((d) => d.deviceId === deviceId)) {
          updatedPrefs[deviceId] = {
            ...updatedPrefs[deviceId],
            order: maxOrder++,
          };
        }
      }

      savePrefs(updatedPrefs);
    },
    [sortedList, grouped, prefs, savePrefs],
  );

  if (loading || prefsLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold dark:text-gray-200">{t('DEVICE_DISPLAY_SETTINGS')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('LOADING_DEVICES')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold dark:text-gray-200">{t('DEVICE_DISPLAY_SETTINGS')}</h2>
        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-md border border-red-200 dark:border-red-800">
          {error}
        </div>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold dark:text-gray-200">{t('DEVICE_DISPLAY_SETTINGS')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('NO_DEVICES_FOUND')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold dark:text-gray-200">{t('DEVICE_DISPLAY_SETTINGS')}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('DEVICE_DISPLAY_HINT')}</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          {GROUP_ORDER.map((groupKey) => (
            <DeviceGroupSection
              key={groupKey}
              groupKey={groupKey}
              items={grouped[groupKey]}
              onToggleVisible={toggleVisible}
              onToggleDisabled={toggleDisabled}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
