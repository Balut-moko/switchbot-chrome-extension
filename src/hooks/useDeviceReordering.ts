import type { DragEndEvent } from '@dnd-kit/core';
import { useCallback } from 'react';
import { devicePreferencesItem } from '@/lib/storage';
import type { Device } from '@/types/switchbot';

type DevicePreferences = Record<string, { visible: boolean; order: number; disabled?: boolean }>;

interface UseDeviceReorderingOptions {
  filtered: Device[];
  preferences: DevicePreferences;
  allDevices: Device[];
  onPreferencesChange: (prefs: DevicePreferences) => void;
}

/**
 * デバイスのドラッグ＆ドロップ並び替えロジックを提供するカスタムフック。
 */
export function useDeviceReordering({
  filtered,
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

      const orderedList = [...filtered];
      const oldIndex = orderedList.findIndex((d) => d.deviceId === activeId);
      const newIndex = orderedList.findIndex((d) => d.deviceId === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      // Reorder the list
      const [moved] = orderedList.splice(oldIndex, 1);
      orderedList.splice(newIndex, 0, moved);

      // Build new order values for all visible devices
      const updatedPrefs = { ...preferences };
      for (let i = 0; i < orderedList.length; i++) {
        const deviceId = orderedList[i].deviceId;
        updatedPrefs[deviceId] = {
          ...updatedPrefs[deviceId],
          visible: updatedPrefs[deviceId]?.visible ?? true,
          order: i,
        };
      }

      // Preserve order for hidden devices (not in filtered list)
      let maxOrder = orderedList.length;
      for (const device of allDevices) {
        if (!orderedList.find((d) => d.deviceId === device.deviceId)) {
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
    [filtered, preferences, allDevices, onPreferencesChange],
  );

  return { handleDragEnd };
}
