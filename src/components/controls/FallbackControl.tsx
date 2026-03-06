import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { Device } from '@/types/switchbot';
import IRRemoteControl from './IRRemoteControl';

interface Props {
  device: Device;
  disabled?: boolean;
}

function StatusBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
      <span>{label}</span>
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
  const badges: Array<{ label: string; value: string }> = [];

  if ('power' in s) {
    badges.push({ label: '', value: s.power === 'on' ? 'ON' : 'OFF' });
  }
  if ('temperature' in s && typeof s.temperature === 'number') {
    badges.push({ label: '\u{1F321}\uFE0F', value: `${s.temperature}\u00B0C` });
  }
  if ('humidity' in s && typeof s.humidity === 'number') {
    badges.push({ label: '\u{1F4A7}', value: `${s.humidity}%` });
  }
  if ('battery' in s && typeof s.battery === 'number') {
    badges.push({ label: '\u{1F50B}', value: `${s.battery}%` });
  }
  if ('workingStatus' in s && typeof s.workingStatus === 'string') {
    badges.push({ label: '', value: s.workingStatus });
  }

  if (badges.length === 0) {
    return <span className="text-xs text-gray-400 dark:text-gray-500">{device.deviceType}</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((b) => (
        <StatusBadge key={`${b.label}${b.value}`} label={b.label} value={b.value} />
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
