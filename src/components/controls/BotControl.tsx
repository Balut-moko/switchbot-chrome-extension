import { useCallback } from 'react';
import { useDeviceToggle } from '@/hooks/useDeviceToggle';
import type { BotStatus, Device, DeviceStatus } from '@/types/switchbot';
import { t } from '@/utils/i18n';

interface Props {
  device: Device;
  disabled?: boolean;
}

const extractBotPower = (status: DeviceStatus): boolean => {
  return 'power' in status && (status as BotStatus).power === 'on';
};

/**
 * Bot デバイスコントロール
 * カラー: green=ON(switchMode), gray=OFF, blue=Press ボタン
 */
export default function BotControl({ device, disabled = false }: Props) {
  const { isOn, isPending, status, toggle, sendCommand } = useDeviceToggle({
    deviceId: device.deviceId,
    extractPower: extractBotPower,
  });

  const botStatus = status as BotStatus | null;
  const deviceMode = botStatus?.deviceMode ?? 'switchMode';
  const isPress = deviceMode === 'pressMode' || deviceMode === 'customizeMode';

  const handlePress = useCallback(async () => {
    await sendCommand({ command: 'press', parameter: 'default' });
  }, [sendCommand]);

  if (isPress) {
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
