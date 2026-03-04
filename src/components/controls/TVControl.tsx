import { useState } from 'react';
import { useDeviceCommand } from '@/hooks/useDeviceCommand';
import type { Device } from '@/types/switchbot';

interface Props {
  device: Device;
}

export default function TVControl({ device }: Props) {
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
        disabled={isPending}
        className="w-6 h-6 flex items-center justify-center text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30"
      >
        -
      </button>
      <button
        type="button"
        onClick={togglePower}
        disabled={isPending}
        className={`px-2 py-0.5 rounded text-xs font-medium ${
          isOn
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}
      >
        {isOn ? 'ON' : 'OFF'}
      </button>
      <button
        type="button"
        onClick={() => volume('up')}
        disabled={isPending}
        className="w-6 h-6 flex items-center justify-center text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
