import type { DragEndEvent } from '@dnd-kit/core';
import { useCallback } from 'react';
import { devicePreferencesItem } from '@/lib/storage';
import type { Device } from '@/types/switchbot';
import { type GroupedDevices, getDeviceGroup } from '@/utils/device';

type DevicePreferences = Record<string, { visible: boolean; order: number; disabled?: boolean }>;

interface UseDeviceReorderingOptions {
  filtered: Device[];
  grouped: GroupedDevices;
  preferences: DevicePreferences;
  allDevices: Device[];
  onPreferencesChange: (prefs: DevicePreferences) => void;
}

/**
 * デバイスのドラッグ＆ドロップ並び替えロジックを提供するカスタムフック。
 */
export function useDeviceReordering({
  filtered,
  grouped,
  preferences,
  allDevices,
  onPreferencesChange,
}: UseDeviceReorderingOptions) {
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
      for (const device of allDevices) {
        if (!allOrdered.find((d) => d.deviceId === device.deviceId)) {
          if (updatedPrefs[device.deviceId]) {
            updatedPrefs[device.deviceId] = {
              ...updatedPrefs[device.deviceId],
              order: maxOrder++,
            };
          }
        }
      }

      onPreferencesChange(updatedPrefs);
      devicePreferencesItem.setValue(updatedPrefs);
    },
    [filtered, grouped, preferences, allDevices, onPreferencesChange],
  );

  return { handleDragEnd };
}
