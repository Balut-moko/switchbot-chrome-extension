import { useState, useCallback } from 'react';
import { sendMessage } from '@/lib/messaging';
import type { DeviceCommand } from '@/types/switchbot';

export function useDeviceCommand(deviceId: string) {
  const [isPending, setIsPending] = useState(false);

  const send = useCallback(
    async (command: DeviceCommand) => {
      setIsPending(true);
      try {
        const result = await sendMessage('sendCommand', { deviceId, command });
        return result;
      } finally {
        setIsPending(false);
      }
    },
    [deviceId],
  );

  return { sendCommand: send, isPending };
}
