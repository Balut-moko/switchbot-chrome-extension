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

function DeviceIconDisplay({ device }: { device: Device }) {
  const Icon = getDeviceIcon(device);
  return <Icon className="w-5 h-5 flex-shrink-0 text-gray-600 dark:text-gray-400" />;
}

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

function DeviceRow({
  item,
  onToggleVisible,
  onToggleDisabled,
}: {
  item: DeviceWithPrefs;
  onToggleVisible: (deviceId: string) => void;
  onToggleDisabled: (deviceId: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2 px-2 rounded-md border transition-colors border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
      {/* Visibility checkbox */}
      <input
        type="checkbox"
        checked={item.visible}
        onChange={() => onToggleVisible(item.device.deviceId)}
        className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500 h-4 w-4 flex-shrink-0"
        title={item.visible ? 'Visible' : 'Hidden'}
      />

      {/* Device icon */}
      <DeviceIconDisplay device={item.device} />

      {/* Device name */}
      <span className="text-sm font-medium flex-1 min-w-0 truncate dark:text-gray-200">
        {item.device.deviceName}
      </span>

      {/* Device type badge */}
      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded flex-shrink-0">
        {item.device.deviceType}
      </span>

      {/* Disable control toggle icon */}
      <button
        type="button"
        onClick={() => onToggleDisabled(item.device.deviceId)}
        disabled={!item.visible}
        title={item.disabled ? t('DEVICE_DISABLED_TOOLTIP') : t('DEVICE_ENABLED_TOOLTIP')}
        className={`p-1 rounded transition-colors flex-shrink-0 ${
          !item.visible
            ? 'opacity-30 pointer-events-none text-gray-400 dark:text-gray-600'
            : item.disabled
              ? 'text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
              : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        {item.disabled ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </svg>
        )}
      </button>
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
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
        <span>{t(GROUP_LABELS[groupKey])}</span>
        <span className="text-gray-400 dark:text-gray-500 font-normal normal-case tracking-normal">
          {items.length}
        </span>
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <DeviceRow
            key={item.device.deviceId}
            item={item}
            onToggleVisible={onToggleVisible}
            onToggleDisabled={onToggleDisabled}
          />
        ))}
      </div>
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
    </div>
  );
}
