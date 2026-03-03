import { useEffect, useState } from 'react';
import { useDevices } from '@/hooks/useDevices';
import { devicePreferencesItem } from '@/lib/storage';
import type { Device } from '@/types/switchbot';
import { getDeviceIcon } from '@/utils/device';

type DevicePreferences = Record<string, { visible: boolean; order: number }>;

interface DeviceWithPrefs {
  device: Device;
  visible: boolean;
  order: number;
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
      return { device, visible: p.visible, order: p.order };
    })
    .sort((a, b) => a.order - b.order);
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

  const savePrefs = (next: DevicePreferences) => {
    setPrefs(next);
    devicePreferencesItem.setValue(next);
  };

  const toggleVisible = (deviceId: string) => {
    const current = prefs[deviceId];
    if (!current) return;
    savePrefs({
      ...prefs,
      [deviceId]: { ...current, visible: !current.visible },
    });
  };

  const moveUp = (index: number, sortedList: DeviceWithPrefs[]) => {
    if (index <= 0) return;
    const current = sortedList[index];
    const above = sortedList[index - 1];
    savePrefs({
      ...prefs,
      [current.device.deviceId]: {
        ...prefs[current.device.deviceId],
        order: above.order,
      },
      [above.device.deviceId]: {
        ...prefs[above.device.deviceId],
        order: current.order,
      },
    });
  };

  const moveDown = (index: number, sortedList: DeviceWithPrefs[]) => {
    if (index >= sortedList.length - 1) return;
    const current = sortedList[index];
    const below = sortedList[index + 1];
    savePrefs({
      ...prefs,
      [current.device.deviceId]: {
        ...prefs[current.device.deviceId],
        order: below.order,
      },
      [below.device.deviceId]: {
        ...prefs[below.device.deviceId],
        order: current.order,
      },
    });
  };

  if (loading || prefsLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Device Display Settings</h2>
        <p className="text-sm text-gray-500">Loading devices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Device Display Settings</h2>
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Device Display Settings</h2>
        <p className="text-sm text-gray-500">No devices found. Test your API connection first.</p>
      </div>
    );
  }

  const sortedList = buildSortedList(devices, prefs);

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Device Display Settings</h2>
      <div className="space-y-1">
        {sortedList.map((item, index) => (
          <div key={item.device.deviceId} className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              checked={item.visible}
              onChange={() => toggleVisible(item.device.deviceId)}
              className="rounded"
            />
            <span className="text-sm">{getDeviceIcon(item.device)}</span>
            <span className="text-sm flex-1 min-w-0 truncate">
              {item.device.deviceName}{' '}
              <span className="text-xs text-gray-500">({item.device.deviceType})</span>
            </span>
            <button
              type="button"
              onClick={() => moveUp(index, sortedList)}
              disabled={index === 0}
              className="text-sm hover:opacity-70 disabled:opacity-30"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => moveDown(index, sortedList)}
              disabled={index === sortedList.length - 1}
              className="text-sm hover:opacity-70 disabled:opacity-30"
            >
              ▼
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
