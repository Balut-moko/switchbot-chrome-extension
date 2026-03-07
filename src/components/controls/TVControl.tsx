import { useState } from 'react';
import { useDeviceCommand } from '@/hooks/useDeviceCommand';
import type { Device } from '@/types/switchbot';
import { t } from '@/utils/i18n';

interface Props {
  device: Device;
  disabled?: boolean;
}

/**
 * TV / IR リモコン系デバイスコントロール
 * カラー: green=ON, gray=OFF, gray(light)=音量ボタン
 */
export default function TVControl({ device, disabled = false }: Props) {
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

  const volume = async (direction: 'up' | 'down') => {
    await sendCommand({
      command: direction === 'up' ? 'volumeAdd' : 'volumeSub',
      parameter: 'default',
      commandType: 'command',
    });
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => volume('down')}
        disabled={isPending || disabled}
        className="w-6 h-6 flex items-center justify-center text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30"
      >
        -
      </button>
      <button
        type="button"
        onClick={togglePower}
        disabled={isPending || disabled}
        className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
          isOn
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        {isOn ? t('TV_ON') : t('TV_OFF')}
      </button>
      <button
        type="button"
        onClick={() => volume('up')}
        disabled={isPending || disabled}
        className="w-6 h-6 flex items-center justify-center text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
