import type { Device, SwitchBotDevice, SwitchBotIRDevice } from '@/types/switchbot';

export type DeviceCategory =
  | 'bot'
  | 'switch'
  | 'sensor'
  | 'ac'
  | 'curtain'
  | 'tv'
  | 'lock'
  | 'light'
  | 'hub'
  | 'vacuum'
  | 'camera'
  | 'climate'
  | 'fan'
  | 'other';

const BOT_TYPES = new Set(['Bot']);

const SWITCH_TYPES = new Set([
  'Plug',
  'Plug Mini (US)',
  'Plug Mini (JP)',
  'Plug Mini (EU)',
  'Relay Switch 1',
  'Relay Switch 1PM',
  'Relay Switch 2PM',
]);

const LIGHT_TYPES = new Set([
  'Color Bulb',
  'Strip Light',
  'Strip Light 3',
  'RGBICWW Strip Light',
  'RGBIC Neon Rope Light',
  'RGBIC Neon Wire Rope Light',
  'Ceiling Light',
  'Ceiling Light Pro',
  'Floor Lamp',
  'RGBICWW Floor Lamp',
  'Candle Warmer Lamp',
  'AI Art Frame',
]);

const SENSOR_TYPES = new Set([
  'Meter',
  'Meter Plus',
  'MeterPlus',
  'WoIOSensor',
  'MeterPro',
  'MeterPro(CO2)',
  'Hub 2',
  'Motion Sensor',
  'Contact Sensor',
  'Presence Sensor',
  'Water Detector',
  'Home Climate Panel',
]);

const CURTAIN_TYPES = new Set(['Curtain', 'Curtain3', 'Blind Tilt', 'Roller Shade']);

const LOCK_TYPES = new Set(['Smart Lock', 'Smart Lock Pro', 'Smart Lock Ultra', 'Lock Lite']);

const HUB_TYPES = new Set(['Hub', 'Hub Plus', 'Hub Mini', 'Hub 3', 'AI Hub']);

const VACUUM_TYPES = new Set([
  'Robot Vacuum Cleaner S1',
  'Robot Vacuum Cleaner S1 Plus',
  'K10+',
  'K10+ Pro',
  'Robot Vacuum Cleaner K10+ Pro Combo',
  'Robot Vacuum Cleaner S10',
  'Robot Vacuum Cleaner S20',
  'Robot Vacuum Cleaner K11+',
  'Robot Vacuum Cleaner K20 Plus Pro',
]);

const CAMERA_TYPES = new Set([
  'Indoor Cam',
  'Pan/Tilt Cam',
  'Pan/Tilt Cam 2K',
  'Pan/Tilt Cam Plus 2K',
  'Pan/Tilt Cam Plus 3K',
]);

const CLIMATE_TYPES = new Set([
  'Humidifier',
  'Humidifier2',
  'Air Purifier VOC',
  'Air Purifier Table VOC',
  'Air Purifier PM2.5',
  'Air Purifier Table PM2.5',
]);

const FAN_TYPES = new Set(['Battery Circulator Fan', 'Circulator Fan', 'Standing Circulator Fan']);

const SECURITY_TYPES = new Set([
  'Keypad',
  'Keypad Touch',
  'Keypad Vision',
  'Keypad Vision Pro',
  'Video Doorbell',
]);

const OTHER_PHYSICAL_TYPES = new Set(['Remote', 'Smart Radiator Thermostat', 'Garage Door Opener']);

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
  if (BOT_TYPES.has(type)) return 'bot';
  if (SWITCH_TYPES.has(type)) return 'switch';
  if (LIGHT_TYPES.has(type)) return 'light';
  if (SENSOR_TYPES.has(type)) return 'sensor';
  if (CURTAIN_TYPES.has(type)) return 'curtain';
  if (LOCK_TYPES.has(type)) return 'lock';
  if (HUB_TYPES.has(type)) return 'hub';
  if (VACUUM_TYPES.has(type)) return 'vacuum';
  if (CAMERA_TYPES.has(type)) return 'camera';
  if (CLIMATE_TYPES.has(type)) return 'climate';
  if (FAN_TYPES.has(type)) return 'fan';
  if (SECURITY_TYPES.has(type)) return 'lock';
  if (OTHER_PHYSICAL_TYPES.has(type)) return 'other';

  if (device.isIR) {
    if (type === 'Air Conditioner') return 'ac';
    if (
      type === 'TV' ||
      type === 'IPTV' ||
      type === 'Streamer' ||
      type === 'Set Top Box' ||
      type === 'DVD' ||
      type === 'Projector'
    )
      return 'tv';
    if (type === 'Light' || type === 'DIY Light') return 'light';
    if (type === 'Fan') return 'fan';
    if (type === 'Speaker') return 'other';
    if (type === 'Camera') return 'camera';
    if (type === 'Air Purifier') return 'climate';
    if (type === 'Water Heater') return 'other';
    if (type === 'Robot Vacuum Cleaner') return 'vacuum';
    if (type === 'Others') return 'other';
  }

  return 'other';
}

const DEVICE_ICONS: Record<string, string> = {
  // Bots & Switches
  Bot: '\u{1F916}',
  Plug: '\u{1F50C}',
  'Plug Mini (US)': '\u{1F50C}',
  'Plug Mini (JP)': '\u{1F50C}',
  'Plug Mini (EU)': '\u{1F50C}',
  'Relay Switch 1': '\u{1F50C}',
  'Relay Switch 1PM': '\u{1F50C}',
  'Relay Switch 2PM': '\u{1F50C}',

  // Lighting
  'Color Bulb': '\u{1F4A1}',
  'Strip Light': '\u{1F308}',
  'Strip Light 3': '\u{1F308}',
  'RGBICWW Strip Light': '\u{1F308}',
  'RGBIC Neon Rope Light': '\u{1F308}',
  'RGBIC Neon Wire Rope Light': '\u{1F308}',
  'Ceiling Light': '\u{1F4A1}',
  'Ceiling Light Pro': '\u{1F4A1}',
  'Floor Lamp': '\u{1F4A1}',
  'RGBICWW Floor Lamp': '\u{1F4A1}',
  'Candle Warmer Lamp': '\u{1F56F}\uFE0F',
  'AI Art Frame': '\u{1F5BC}\uFE0F',

  // Sensors
  Meter: '\u{1F321}\uFE0F',
  'Meter Plus': '\u{1F321}\uFE0F',
  MeterPlus: '\u{1F321}\uFE0F',
  MeterPro: '\u{1F321}\uFE0F',
  'MeterPro(CO2)': '\u{1F321}\uFE0F',
  WoIOSensor: '\u{1F321}\uFE0F',
  'Hub 2': '\u{1F321}\uFE0F',
  'Motion Sensor': '\u{1F3C3}',
  'Contact Sensor': '\u{1F6AA}',
  'Presence Sensor': '\u{1F3C3}',
  'Water Detector': '\u{1F4A7}',
  'Home Climate Panel': '\u{1F321}\uFE0F',

  // Curtains & Blinds
  Curtain: '\u{1FA9E}',
  Curtain3: '\u{1FA9E}',
  'Blind Tilt': '\u{1FA9E}',
  'Roller Shade': '\u{1FA9E}',

  // Locks & Security
  'Smart Lock': '\u{1F512}',
  'Smart Lock Pro': '\u{1F512}',
  'Smart Lock Ultra': '\u{1F512}',
  'Lock Lite': '\u{1F512}',
  Keypad: '\u{1F510}',
  'Keypad Touch': '\u{1F510}',
  'Keypad Vision': '\u{1F510}',
  'Keypad Vision Pro': '\u{1F510}',
  'Video Doorbell': '\u{1F514}',

  // Hubs
  Hub: '\u{1F4E1}',
  'Hub Plus': '\u{1F4E1}',
  'Hub Mini': '\u{1F4E1}',
  'Hub 3': '\u{1F4E1}',
  'AI Hub': '\u{1F4E1}',

  // Climate & Air
  Humidifier: '\u{1F4A8}',
  Humidifier2: '\u{1F4A8}',
  'Air Purifier VOC': '\u{1F32C}\uFE0F',
  'Air Purifier Table VOC': '\u{1F32C}\uFE0F',
  'Air Purifier PM2.5': '\u{1F32C}\uFE0F',
  'Air Purifier Table PM2.5': '\u{1F32C}\uFE0F',

  // Fans
  'Battery Circulator Fan': '\u{1F32C}\uFE0F',
  'Circulator Fan': '\u{1F32C}\uFE0F',
  'Standing Circulator Fan': '\u{1F32C}\uFE0F',

  // Robot Vacuums
  'Robot Vacuum Cleaner S1': '\u{1F9F9}',
  'Robot Vacuum Cleaner S1 Plus': '\u{1F9F9}',
  'K10+': '\u{1F9F9}',
  'K10+ Pro': '\u{1F9F9}',
  'Robot Vacuum Cleaner K10+ Pro Combo': '\u{1F9F9}',
  'Robot Vacuum Cleaner S10': '\u{1F9F9}',
  'Robot Vacuum Cleaner S20': '\u{1F9F9}',
  'Robot Vacuum Cleaner K11+': '\u{1F9F9}',
  'Robot Vacuum Cleaner K20 Plus Pro': '\u{1F9F9}',

  // Cameras
  'Indoor Cam': '\u{1F4F7}',
  'Pan/Tilt Cam': '\u{1F4F7}',
  'Pan/Tilt Cam 2K': '\u{1F4F7}',
  'Pan/Tilt Cam Plus 2K': '\u{1F4F7}',
  'Pan/Tilt Cam Plus 3K': '\u{1F4F7}',

  // Other Physical
  Remote: '\u{1F4E1}',
  'Smart Radiator Thermostat': '\u{1F321}\uFE0F',
  'Garage Door Opener': '\u{1F3E0}',

  // IR Devices
  'Air Conditioner': '\u2744\uFE0F',
  TV: '\u{1F4FA}',
  IPTV: '\u{1F4FA}',
  Streamer: '\u{1F4FA}',
  'Set Top Box': '\u{1F4FA}',
  DVD: '\u{1F4C0}',
  Projector: '\u{1F4FD}\uFE0F',
  Fan: '\u{1F32C}\uFE0F',
  Light: '\u{1F4A1}',
  'DIY Light': '\u{1F4A1}',
  Speaker: '\u{1F50A}',
  'Water Heater': '\u{1F6BF}',
  Camera: '\u{1F4F7}',
  'Air Purifier': '\u{1F32C}\uFE0F',
  'Robot Vacuum Cleaner': '\u{1F9F9}',
  Others: '\u{1F4E1}',
};

export function getDeviceIcon(device: Device): string {
  return DEVICE_ICONS[device.deviceType] ?? (device.isIR ? '\u{1F4E1}' : '\u{1F4E6}');
}

export function isStatusAvailable(device: Device): boolean {
  return !device.isIR;
}

export type DeviceGroup = 'controls' | 'sensors';

export function getDeviceGroup(device: Device): DeviceGroup {
  const category = getDeviceCategory(device);
  if (category === 'sensor') return 'sensors';
  if (category === 'hub') return 'sensors';
  return 'controls';
}

const CATEGORY_SORT_ORDER: Record<DeviceCategory, number> = {
  bot: 0,
  switch: 0,
  light: 1,
  curtain: 2,
  lock: 3,
  ac: 4,
  tv: 5,
  fan: 6,
  climate: 7,
  vacuum: 8,
  camera: 9,
  hub: 10,
  other: 11,
  sensor: 12,
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

export function groupDevices(
  devices: Device[],
  options?: { preserveOrder?: boolean },
): GroupedDevices {
  const controls: Device[] = [];
  const sensors: Device[] = [];

  for (const device of devices) {
    if (getDeviceGroup(device) === 'sensors') {
      sensors.push(device);
    } else {
      controls.push(device);
    }
  }

  if (options?.preserveOrder) {
    return { controls, sensors };
  }

  return {
    controls: sortDevicesByCategory(controls),
    sensors: sortDevicesByCategory(sensors),
  };
}

export type OptionsDeviceGroup = 'controls' | 'sensors' | 'ir';

export interface OptionsGroupedDevices {
  controls: Device[];
  sensors: Device[];
  ir: Device[];
}

export function getOptionsDeviceGroup(device: Device): OptionsDeviceGroup {
  if (device.isIR) return 'ir';
  const category = getDeviceCategory(device);
  if (category === 'sensor') return 'sensors';
  if (category === 'hub') return 'sensors';
  return 'controls';
}

export function groupDevicesForOptions(
  devices: Device[],
  options?: { preserveOrder?: boolean },
): OptionsGroupedDevices {
  const controls: Device[] = [];
  const sensors: Device[] = [];
  const ir: Device[] = [];

  for (const device of devices) {
    const group = getOptionsDeviceGroup(device);
    if (group === 'sensors') {
      sensors.push(device);
    } else if (group === 'ir') {
      ir.push(device);
    } else {
      controls.push(device);
    }
  }

  if (options?.preserveOrder) {
    return { controls, sensors, ir };
  }

  return {
    controls: sortDevicesByCategory(controls),
    sensors: sortDevicesByCategory(sensors),
    ir: sortDevicesByCategory(ir),
  };
}
