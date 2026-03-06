import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import DeviceCard from '@/components/DeviceCard';
import type { Device } from '@/types/switchbot';

interface Props {
  title: string;
  devices: Device[];
  forceExpand?: boolean;
  variant?: 'controls' | 'sensors';
  disabledDeviceIds?: Set<string>;
  reorderMode?: boolean;
}

function SortableDeviceCard({
  device,
  variant,
  disabled,
  reorderMode,
}: {
  device: Device;
  variant: 'controls' | 'sensors';
  disabled: boolean;
  reorderMode: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: device.deviceId,
    disabled: !reorderMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    position: 'relative' as const,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DeviceCard
        device={device}
        variant={variant}
        disabled={disabled}
        reorderMode={reorderMode}
        dragHandleListeners={listeners}
        dragHandleAttributes={attributes}
      />
    </div>
  );
}

export default function DeviceSection({
  title,
  devices,
  forceExpand = false,
  variant = 'controls',
  disabledDeviceIds,
  reorderMode = false,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const isExpanded = forceExpand || !collapsed;

  const deviceIds = devices.map((d) => d.deviceId);

  return (
    <div>
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-between w-full py-1.5 px-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <span>
          {title}
          <span className="ml-1.5 text-gray-400 dark:text-gray-500 font-normal normal-case tracking-normal">
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
        <SortableContext items={deviceIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {devices.map((device) => (
              <SortableDeviceCard
                key={device.deviceId}
                device={device}
                variant={variant}
                disabled={disabledDeviceIds?.has(device.deviceId) ?? false}
                reorderMode={reorderMode}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
