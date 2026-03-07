import {
  Activity,
  AirVent,
  Bell,
  BlindsIcon,
  Bot,
  BrushCleaning,
  Camera,
  Disc3,
  DoorOpen,
  Droplets,
  Fan,
  Flame,
  Frame,
  Gauge,
  Home,
  KeyRound,
  Lightbulb,
  Lock,
  type LucideIcon,
  Monitor,
  Plug,
  Projector,
  Radio,
  Rainbow,
  Router,
  ShowerHead,
  Snowflake,
  Speaker,
  Thermometer,
  ToggleLeft,
  Tv,
  Volume2,
} from 'lucide-react';
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

const DEVICE_ICONS: Record<string, LucideIcon> = {
  // Bots & Switches
  Bot: Bot,
  Plug: Plug,
  'Plug Mini (US)': Plug,
  'Plug Mini (JP)': Plug,
  'Plug Mini (EU)': Plug,
  'Relay Switch 1': ToggleLeft,
  'Relay Switch 1PM': ToggleLeft,
  'Relay Switch 2PM': ToggleLeft,

  // Lighting
  'Color Bulb': Lightbulb,
  'Strip Light': Rainbow,
  'Strip Light 3': Rainbow,
  'RGBICWW Strip Light': Rainbow,
  'RGBIC Neon Rope Light': Rainbow,
  'RGBIC Neon Wire Rope Light': Rainbow,
  'Ceiling Light': Lightbulb,
  'Ceiling Light Pro': Lightbulb,
  'Floor Lamp': Lightbulb,
  'RGBICWW Floor Lamp': Lightbulb,
  'Candle Warmer Lamp': Flame,
  'AI Art Frame': Frame,

  // Sensors
  Meter: Thermometer,
  'Meter Plus': Thermometer,
  MeterPlus: Thermometer,
  MeterPro: Thermometer,
  'MeterPro(CO2)': Thermometer,
  WoIOSensor: Thermometer,
  'Hub 2': Thermometer,
  'Motion Sensor': Activity,
  'Contact Sensor': DoorOpen,
  'Presence Sensor': Activity,
  'Water Detector': Droplets,
  'Home Climate Panel': Gauge,

  // Curtains & Blinds
  Curtain: BlindsIcon,
  Curtain3: BlindsIcon,
  'Blind Tilt': BlindsIcon,
  'Roller Shade': BlindsIcon,

  // Locks & Security
  'Smart Lock': Lock,
  'Smart Lock Pro': Lock,
  'Smart Lock Ultra': Lock,
  'Lock Lite': Lock,
  Keypad: KeyRound,
  'Keypad Touch': KeyRound,
  'Keypad Vision': KeyRound,
  'Keypad Vision Pro': KeyRound,
  'Video Doorbell': Bell,

  // Hubs
  Hub: Router,
  'Hub Plus': Router,
  'Hub Mini': Router,
  'Hub 3': Router,
  'AI Hub': Router,

  // Climate & Air
  Humidifier: Droplets,
  Humidifier2: Droplets,
  'Air Purifier VOC': AirVent,
  'Air Purifier Table VOC': AirVent,
  'Air Purifier PM2.5': AirVent,
  'Air Purifier Table PM2.5': AirVent,

  // Fans
  'Battery Circulator Fan': Fan,
  'Circulator Fan': Fan,
  'Standing Circulator Fan': Fan,

  // Robot Vacuums
  'Robot Vacuum Cleaner S1': BrushCleaning,
  'Robot Vacuum Cleaner S1 Plus': BrushCleaning,
  'K10+': BrushCleaning,
  'K10+ Pro': BrushCleaning,
  'Robot Vacuum Cleaner K10+ Pro Combo': BrushCleaning,
  'Robot Vacuum Cleaner S10': BrushCleaning,
  'Robot Vacuum Cleaner S20': BrushCleaning,
  'Robot Vacuum Cleaner K11+': BrushCleaning,
  'Robot Vacuum Cleaner K20 Plus Pro': BrushCleaning,

  // Cameras
  'Indoor Cam': Camera,
  'Pan/Tilt Cam': Camera,
  'Pan/Tilt Cam 2K': Camera,
  'Pan/Tilt Cam Plus 2K': Camera,
  'Pan/Tilt Cam Plus 3K': Camera,

  // Other Physical
  Remote: Radio,
  'Smart Radiator Thermostat': Thermometer,
  'Garage Door Opener': Home,

  // IR Devices
  'Air Conditioner': Snowflake,
  TV: Tv,
  IPTV: Tv,
  Streamer: Monitor,
  'Set Top Box': Tv,
  DVD: Disc3,
  Projector: Projector,
  Fan: Fan,
  Light: Lightbulb,
  'DIY Light': Lightbulb,
  Speaker: Volume2,
  'Water Heater': ShowerHead,
  Camera: Camera,
  'Air Purifier': AirVent,
  'Robot Vacuum Cleaner': BrushCleaning,
  Others: Radio,
};

export type { LucideIcon };

export function getDeviceIcon(device: Device): LucideIcon {
  return DEVICE_ICONS[device.deviceType] ?? (device.isIR ? Radio : Speaker);
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

export function sortDevicesByCategory(devices: Device[]): Device[] {
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
