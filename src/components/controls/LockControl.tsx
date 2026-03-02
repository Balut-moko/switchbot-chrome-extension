import { useState, useEffect } from 'react';
import { useDeviceCommand } from '@/hooks/useDeviceCommand';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { Device } from '@/types/switchbot';

interface Props {
  device: Device;
}

export default function LockControl({ device }: Props) {
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
      onClick={isLocked ? handleUnlock : handleLock}
      disabled={isPending}
      className={`px-2 py-0.5 rounded text-xs font-medium ${
        confirming
          ? 'bg-yellow-500 text-white'
          : isLocked
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100 text-green-700'
      }`}
    >
      {confirming ? 'Confirm?' : isLocked ? 'Locked' : 'Unlocked'}
    </button>
  );
}
