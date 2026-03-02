import { useState } from 'react';
import type { Device } from '@/types/switchbot';
import DeviceCard from '@/components/DeviceCard';

interface Props {
  title: string;
  devices: Device[];
  forceExpand?: boolean;
  variant?: 'controls' | 'sensors';
}

export default function DeviceSection({
  title,
  devices,
  forceExpand = false,
  variant = 'controls',
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const isExpanded = forceExpand || !collapsed;

  return (
    <div>
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-between w-full py-1.5 px-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
      >
        <span>
          {title}
          <span className="ml-1.5 text-gray-400 font-normal normal-case tracking-normal">
            {devices.length}
          </span>
        </span>
        <span
          className={`text-[10px] text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-0' : '-rotate-90'
          }`}
        >
          &#9660;
        </span>
      </button>

      {isExpanded && (
        <div className="space-y-2">
          {devices.map((device) => (
            <DeviceCard key={device.deviceId} device={device} variant={variant} />
          ))}
        </div>
      )}
    </div>
  );
}
