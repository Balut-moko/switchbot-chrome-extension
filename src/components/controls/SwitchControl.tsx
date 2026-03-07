import { useEffect, useState } from 'react';
import { useDeviceCommand } from '@/hooks/useDeviceCommand';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { Device } from '@/types/switchbot';

interface Props {
  device: Device;
  disabled?: boolean;
}

/**
 * スイッチ系デバイスコントロール（Plug, Fan, Climate 等にも使用）
 * カラー: green=ON, gray=OFF
 */
export default function SwitchControl({ device, disabled = false }: Props) {
  const [isOn, setIsOn] = useState(false);
  const { sendCommand, isPending } = useDeviceCommand(device.deviceId);
  const { status } = useDeviceStatus(device.deviceId, !device.isIR);

  useEffect(() => {
    if (status && 'power' in status) {
      setIsOn(status.power === 'on');
    }
  }, [status]);

  const toggle = async () => {
    const newState = !isOn;
    setIsOn(newState);
    try {
      await sendCommand({
        command: newState ? 'turnOn' : 'turnOff',
        parameter: 'default',
      });
    } catch {
      setIsOn(!newState);
    }
  };

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
