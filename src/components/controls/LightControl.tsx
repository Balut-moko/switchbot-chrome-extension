import { useMemo } from 'react';
import { useDeviceToggle } from '@/hooks/useDeviceToggle';
import type { Device } from '@/types/switchbot';

interface Props {
  device: Device;
  disabled?: boolean;
}

/**
 * 照明系デバイスコントロール
 * カラー: green=ON, gray=OFF
 */
export default function LightControl({ device, disabled = false }: Props) {
  const commandOptions = useMemo(
    () => (device.isIR ? { commandType: 'command' } : undefined),
    [device.isIR],
  );

  const { isOn, isPending, toggle } = useDeviceToggle({
    deviceId: device.deviceId,
    enableStatus: !device.isIR,
    commandOptions,
  });

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending || disabled}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
        isPending || disabled ? 'opacity-50' : ''
      } ${isOn ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          isOn ? 'translate-x-6' : ''
        }`}
      />
    </button>
  );
}
