import { useState, useEffect } from 'react';
import { useDeviceCommand } from '@/hooks/useDeviceCommand';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { Device } from '@/types/switchbot';

interface Props {
  device: Device;
}

export default function LightControl({ device }: Props) {
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
        commandType: device.isIR ? 'command' : undefined,
      });
    } catch {
      setIsOn(!newState);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
        isPending ? 'opacity-50' : ''
      } ${isOn ? 'bg-yellow-400' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          isOn ? 'translate-x-6' : ''
        }`}
      />
    </button>
  );
}
