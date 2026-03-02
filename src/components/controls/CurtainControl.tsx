import { useEffect, useRef, useState } from 'react';
import { useDeviceCommand } from '@/hooks/useDeviceCommand';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { Device } from '@/types/switchbot';

interface Props {
  device: Device;
}

export default function CurtainControl({ device }: Props) {
  const [position, setPosition] = useState(0);
  const { sendCommand, isPending } = useDeviceCommand(device.deviceId);
  const { status } = useDeviceStatus(device.deviceId);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (status && 'slidePosition' in status) {
      setPosition((status as { slidePosition: number }).slidePosition);
    }
  }, [status]);

  const handleChange = (value: number) => {
    setPosition(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      sendCommand({
        command: 'setPosition',
        parameter: `0,ff,${value}`,
      });
    }, 500);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => handleChange(Number(e.target.value))}
        disabled={isPending}
        className="w-20 h-1.5 accent-blue-500"
      />
      <span className="text-xs font-mono w-8 text-right">{position}%</span>
    </div>
  );
}
