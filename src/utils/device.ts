import type { Device, SwitchBotDevice, SwitchBotIRDevice } from '@/types/switchbot';

export type DeviceCategory =
  | 'switch'
  | 'sensor'
  | 'ac'
  | 'curtain'
  | 'tv'
  | 'lock'
  | 'light'
  | 'other';

const SWITCH_TYPES = new Set(['Bot', 'Plug', 'Plug Mini (US)', 'Plug Mini (JP)']);

const LIGHT_TYPES = new Set(['Color Bulb', 'Strip Light', 'Ceiling Light', 'Ceiling Light Pro']);

const SENSOR_TYPES = new Set([
  'Meter',
  'Meter Plus',
  'MeterPlus',
  'WoIOSensor',
  'Hub 2',
  'Motion Sensor',
  'Contact Sensor',
]);

const CURTAIN_TYPES = new Set(['Curtain', 'Curtain3', 'Blind Tilt', 'Roller Shade']);

const LOCK_TYPES = new Set(['Smart Lock', 'Smart Lock Pro']);

export function isIRDevice(
  device: SwitchBotDevice | SwitchBotIRDevice,
): device is SwitchBotIRDevice {
  return 'remoteType' in device;
}

export function toUnifiedDevice(device: SwitchBotDevice | SwitchBotIRDevice): Device {
  if (isIRDevice(device)) {
    return {
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      deviceType: device.remoteType,
      hubDeviceId: device.hubDeviceId,
      isIR: true,
    };
  }
  return {
    deviceId: device.deviceId,
    deviceName: device.deviceName,
    deviceType: device.deviceType,
    hubDeviceId: device.hubDeviceId,
    isIR: false,
  };
}

export function getDeviceCategory(device: Device): DeviceCategory {
  const type = device.deviceType;
  if (SWITCH_TYPES.has(type)) return 'switch';
  if (LIGHT_TYPES.has(type)) return 'light';
  if (SENSOR_TYPES.has(type)) return 'sensor';
  if (CURTAIN_TYPES.has(type)) return 'curtain';
  if (LOCK_TYPES.has(type)) return 'lock';

  if (device.isIR) {
    if (type === 'Air Conditioner') return 'ac';
    if (type === 'TV' || type === 'IPTV' || type === 'Set Top Box') return 'tv';
    if (type === 'Light' || type === 'DIY Light') return 'light';
    if (type === 'Fan') return 'switch';
  }

  return 'other';
}

const DEVICE_ICONS: Record<string, string> = {
  Bot: '\u{1F916}',
  Plug: '\u{1F50C}',
  'Plug Mini (US)': '\u{1F50C}',
  'Plug Mini (JP)': '\u{1F50C}',
  'Color Bulb': '\u{1F4A1}',
  'Strip Light': '\u{1F308}',
  'Ceiling Light': '\u{1F4A1}',
  Curtain: '\u{1FA9E}',
  Curtain3: '\u{1FA9E}',
  'Blind Tilt': '\u{1FA9E}',
  'Smart Lock': '\u{1F512}',
  'Smart Lock Pro': '\u{1F512}',
  Meter: '\u{1F321}\uFE0F',
  'Meter Plus': '\u{1F321}\uFE0F',
  MeterPlus: '\u{1F321}\uFE0F',
  'Hub 2': '\u{1F321}\uFE0F',
  'Motion Sensor': '\u{1F3C3}',
  'Contact Sensor': '\u{1F6AA}',
  'Air Conditioner': '\u2744\uFE0F',
  TV: '\u{1F4FA}',
  Fan: '\u{1F32C}\uFE0F',
  Light: '\u{1F4A1}',
  'DIY Light': '\u{1F4A1}',
};

export function getDeviceIcon(device: Device): string {
  return DEVICE_ICONS[device.deviceType] ?? (device.isIR ? '\u{1F4E1}' : '\u{1F4E6}');
}

export function isStatusAvailable(device: Device): boolean {
  return !device.isIR;
}

export type DeviceGroup = 'controls' | 'sensors';

export function getDeviceGroup(device: Device): DeviceGroup {
  return getDeviceCategory(device) === 'sensor' ? 'sensors' : 'controls';
}

const CATEGORY_SORT_ORDER: Record<DeviceCategory, number> = {
  switch: 0,
  light: 1,
  curtain: 2,
  lock: 3,
  ac: 4,
  tv: 5,
  other: 6,
  sensor: 7,
};

function sortDevicesByCategory(devices: Device[]): Device[] {
  return [...devices].sort((a, b) => {
    const orderDiff =
      CATEGORY_SORT_ORDER[getDeviceCategory(a)] - CATEGORY_SORT_ORDER[getDeviceCategory(b)];
    if (orderDiff !== 0) return orderDiff;
    return a.deviceName.localeCompare(b.deviceName);
  });
}

export interface GroupedDevices {
  controls: Device[];
  sensors: Device[];
}

export function groupDevices(devices: Device[]): GroupedDevices {
  const controls: Device[] = [];
  const sensors: Device[] = [];

  for (const device of devices) {
    if (getDeviceGroup(device) === 'sensors') {
      sensors.push(device);
    } else {
      controls.push(device);
    }
  }

  return {
    controls: sortDevicesByCategory(controls),
    sensors: sortDevicesByCategory(sensors),
  };
}
