import { useEffect, useState } from 'react';
import { useDeviceCommand } from '@/hooks/useDeviceCommand';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { Device } from '@/types/switchbot';
import { t } from '@/utils/i18n';

interface Props {
  device: Device;
  disabled?: boolean;
}

export default function LockControl({ device, disabled = false }: Props) {
  const [lockState, setLockState] = useState<'locked' | 'unlocked'>('locked');
  const [confirming, setConfirming] = useState(false);
  const { sendCommand, isPending } = useDeviceCommand(device.deviceId);
  const { status } = useDeviceStatus(device.deviceId);

  useEffect(() => {
    if (status && 'lockState' in status) {
      const s = (status as { lockState: string }).lockState;
      setLockState(s === 'locked' ? 'locked' : 'unlocked');
    }
  }, [status]);

  const handleLock = async () => {
    setLockState('locked');
    try {
      await sendCommand({ command: 'lock', parameter: 'default' });
    } catch {
      setLockState('unlocked');
    }
  };

  const handleUnlock = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    setConfirming(false);
    setLockState('unlocked');
    try {
      await sendCommand({ command: 'unlock', parameter: 'default' });
    } catch {
      setLockState('locked');
    }
  };

  const isLocked = lockState === 'locked';

  return (
    <button
      type="button"
      onClick={isLocked ? handleUnlock : handleLock}
      disabled={isPending || disabled}
      className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
        confirming
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : isLocked
            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
      }`}
    >
      {confirming ? t('CONFIRM') : isLocked ? t('LOCK_LOCKED') : t('LOCK_UNLOCKED')}
    </button>
  );
}
