import { useEffect, useState } from 'react';
import { useDeviceCommand } from '@/hooks/useDeviceCommand';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { BotStatus, Device } from '@/types/switchbot';
import { t } from '@/utils/i18n';

interface Props {
  device: Device;
  disabled?: boolean;
}

/**
 * Bot デバイスコントロール
 * カラー: green=ON(switchMode), gray=OFF, blue=Press ボタン
 */
export default function BotControl({ device, disabled = false }: Props) {
  const [isOn, setIsOn] = useState(false);
  const { sendCommand, isPending } = useDeviceCommand(device.deviceId);
  const { status } = useDeviceStatus(device.deviceId);

  const botStatus = status as BotStatus | null;
  const deviceMode = botStatus?.deviceMode ?? 'switchMode';
  const isPress = deviceMode === 'pressMode' || deviceMode === 'customizeMode';

  useEffect(() => {
    if (botStatus) {
      setIsOn(botStatus.power === 'on');
    }
  }, [botStatus]);

  if (isPress) {
    const handlePress = async () => {
      await sendCommand({ command: 'press', parameter: 'default' });
    };

    return (
      <button
        type="button"
        onClick={handlePress}
        disabled={isPending || disabled}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          isPending || disabled
            ? 'bg-gray-200 text-gray-400'
            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
        }`}
      >
        {isPending ? '...' : t('PRESS')}
      </button>
    );
  }

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
