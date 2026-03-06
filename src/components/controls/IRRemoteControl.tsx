import { useState } from 'react';
import { useDeviceCommand } from '@/hooks/useDeviceCommand';
import type { Device } from '@/types/switchbot';
import { t } from '@/utils/i18n';

interface Props {
  device: Device;
  disabled?: boolean;
}

export default function IRRemoteControl({ device, disabled = false }: Props) {
  const [isOn, setIsOn] = useState(false);
  const { sendCommand, isPending } = useDeviceCommand(device.deviceId);

  const togglePower = async () => {
    const newState = !isOn;
    setIsOn(newState);
    try {
      await sendCommand({
        command: newState ? 'turnOn' : 'turnOff',
        parameter: 'default',
        commandType: 'command',
      });
    } catch {
      setIsOn(!newState);
    }
  };

  return (
    <button
      type="button"
      onClick={togglePower}
      disabled={isPending || disabled}
      className={`px-2 py-0.5 rounded text-xs font-medium ${
        isOn
          ? 'bg-green-500 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
      }`}
    >
      {isOn ? t('IR_POWER_ON') : t('IR_POWER_OFF')}
    </button>
  );
}
