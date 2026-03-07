import type { LucideIcon } from 'lucide-react';
import { Battery, Droplets, Thermometer } from 'lucide-react';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { Device } from '@/types/switchbot';
import { BADGE_VARIANT_CLASSES } from '@/utils/styles';
import IRRemoteControl from './IRRemoteControl';

interface Props {
  device: Device;
  disabled?: boolean;
}

function StatusBadge({ icon: Icon, value }: { icon?: LucideIcon; value: string }) {
  return (
    <span className={BADGE_VARIANT_CLASSES.secondary}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{value}</span>
    </span>
  );
}

function FallbackStatusDisplay({ device }: { device: Device }) {
  const { status, loading } = useDeviceStatus(device.deviceId, !device.isIR);

  if (loading) {
    return (
      <span className="inline-block h-5 w-10 rounded bg-gray-100 dark:bg-gray-700 animate-pulse" />
    );
  }

  if (!status) {
    return <span className="text-xs text-gray-400 dark:text-gray-500">{device.deviceType}</span>;
  }

  const s = status as Record<string, unknown>;
  const badges: Array<{ icon?: LucideIcon; value: string }> = [];

  if ('power' in s) {
    badges.push({ value: s.power === 'on' ? 'ON' : 'OFF' });
  }
  if ('temperature' in s && typeof s.temperature === 'number') {
    badges.push({ icon: Thermometer, value: `${s.temperature}\u00B0C` });
  }
  if ('humidity' in s && typeof s.humidity === 'number') {
    badges.push({ icon: Droplets, value: `${s.humidity}%` });
  }
  if ('battery' in s && typeof s.battery === 'number') {
    badges.push({ icon: Battery, value: `${s.battery}%` });
  }
  if ('workingStatus' in s && typeof s.workingStatus === 'string') {
    badges.push({ value: s.workingStatus });
  }

  if (badges.length === 0) {
    return <span className="text-xs text-gray-400 dark:text-gray-500">{device.deviceType}</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((b) => (
        <StatusBadge key={`${b.icon?.name ?? ''}${b.value}`} icon={b.icon} value={b.value} />
      ))}
    </div>
  );
}

export default function FallbackControl({ device, disabled = false }: Props) {
  if (device.isIR) {
    return <IRRemoteControl device={device} disabled={disabled} />;
  }

  return <FallbackStatusDisplay device={device} />;
}
