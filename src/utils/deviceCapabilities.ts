export interface DeviceCapability {
  canToggle: boolean;
  canSetPosition: boolean;
  canSetTemperature: boolean;
  hasTemperature: boolean;
  hasHumidity: boolean;
  hasBattery: boolean;
  hasBrightness: boolean;
  hasColor: boolean;
  hasCO2: boolean;
  commands: string[];
}

const defaults: DeviceCapability = {
  canToggle: false,
  canSetPosition: false,
  canSetTemperature: false,
  hasTemperature: false,
  hasHumidity: false,
  hasBattery: false,
  hasBrightness: false,
  hasColor: false,
  hasCO2: false,
  commands: [],
};

function cap(overrides: Partial<DeviceCapability>): DeviceCapability {
  return { ...defaults, ...overrides };
}

export const DEVICE_CAPABILITIES: Record<string, DeviceCapability> = {
  // Bots
  Bot: cap({ canToggle: true, hasBattery: true, commands: ['turnOn', 'turnOff', 'press'] }),

  // Plugs
  Plug: cap({ canToggle: true, commands: ['turnOn', 'turnOff'] }),
  'Plug Mini (US)': cap({ canToggle: true, commands: ['turnOn', 'turnOff'] }),
  'Plug Mini (JP)': cap({ canToggle: true, commands: ['turnOn', 'turnOff'] }),
  'Plug Mini (EU)': cap({ canToggle: true, commands: ['turnOn', 'turnOff'] }),

  // Relay Switches
  'Relay Switch 1': cap({ canToggle: true, commands: ['turnOn', 'turnOff'] }),
  'Relay Switch 1PM': cap({ canToggle: true, commands: ['turnOn', 'turnOff'] }),
  'Relay Switch 2PM': cap({ canToggle: true, commands: ['turnOn', 'turnOff'] }),

  // Lights
  'Color Bulb': cap({
    canToggle: true,
    hasBrightness: true,
    hasColor: true,
    commands: ['turnOn', 'turnOff', 'setBrightness', 'setColor'],
  }),
  'Strip Light': cap({
    canToggle: true,
    hasBrightness: true,
    hasColor: true,
    commands: ['turnOn', 'turnOff', 'setBrightness', 'setColor'],
  }),
  'Strip Light 3': cap({
    canToggle: true,
    hasBrightness: true,
    hasColor: true,
    commands: ['turnOn', 'turnOff', 'setBrightness', 'setColor'],
  }),
  'RGBICWW Strip Light': cap({
    canToggle: true,
    hasBrightness: true,
    hasColor: true,
    commands: ['turnOn', 'turnOff', 'setBrightness', 'setColor'],
  }),
  'RGBIC Neon Rope Light': cap({
    canToggle: true,
    hasBrightness: true,
    hasColor: true,
    commands: ['turnOn', 'turnOff', 'setBrightness', 'setColor'],
  }),
  'RGBIC Neon Wire Rope Light': cap({
    canToggle: true,
    hasBrightness: true,
    hasColor: true,
    commands: ['turnOn', 'turnOff', 'setBrightness', 'setColor'],
  }),
  'Ceiling Light': cap({
    canToggle: true,
    hasBrightness: true,
    commands: ['turnOn', 'turnOff', 'setBrightness'],
  }),
  'Ceiling Light Pro': cap({
    canToggle: true,
    hasBrightness: true,
    hasColor: true,
    commands: ['turnOn', 'turnOff', 'setBrightness'],
  }),
  'Floor Lamp': cap({
    canToggle: true,
    hasBrightness: true,
    commands: ['turnOn', 'turnOff', 'setBrightness'],
  }),
  'RGBICWW Floor Lamp': cap({
    canToggle: true,
    hasBrightness: true,
    hasColor: true,
    commands: ['turnOn', 'turnOff', 'setBrightness', 'setColor'],
  }),
  'Candle Warmer Lamp': cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff'],
  }),
  'AI Art Frame': cap({
    canToggle: true,
    hasBrightness: true,
    commands: ['turnOn', 'turnOff', 'setBrightness'],
  }),

  // Sensors
  Meter: cap({ hasTemperature: true, hasHumidity: true, hasBattery: true }),
  'Meter Plus': cap({ hasTemperature: true, hasHumidity: true, hasBattery: true }),
  MeterPlus: cap({ hasTemperature: true, hasHumidity: true, hasBattery: true }),
  WoIOSensor: cap({ hasTemperature: true, hasHumidity: true, hasBattery: true }),
  MeterPro: cap({ hasTemperature: true, hasHumidity: true, hasBattery: true }),
  'MeterPro(CO2)': cap({ hasTemperature: true, hasHumidity: true, hasBattery: true, hasCO2: true }),
  'Hub 2': cap({ hasTemperature: true, hasHumidity: true }),
  'Motion Sensor': cap({ hasBattery: true }),
  'Contact Sensor': cap({ hasBattery: true }),
  'Presence Sensor': cap({ hasBattery: true }),
  'Water Detector': cap({ hasBattery: true }),
  'Home Climate Panel': cap({ hasTemperature: true, hasHumidity: true }),

  // Curtain / Blind
  Curtain: cap({
    canSetPosition: true,
    hasBattery: true,
    commands: ['setPosition', 'turnOn', 'turnOff'],
  }),
  Curtain3: cap({
    canSetPosition: true,
    hasBattery: true,
    commands: ['setPosition', 'turnOn', 'turnOff'],
  }),
  'Blind Tilt': cap({ canSetPosition: true, hasBattery: true, commands: ['setPosition'] }),
  'Roller Shade': cap({ canSetPosition: true, hasBattery: true, commands: ['setPosition'] }),

  // Locks
  'Smart Lock': cap({ canToggle: true, hasBattery: true, commands: ['lock', 'unlock'] }),
  'Smart Lock Pro': cap({ canToggle: true, hasBattery: true, commands: ['lock', 'unlock'] }),
  'Smart Lock Ultra': cap({ canToggle: true, hasBattery: true, commands: ['lock', 'unlock'] }),
  'Lock Lite': cap({ canToggle: true, hasBattery: true, commands: ['lock', 'unlock'] }),

  // Security
  Keypad: cap({ hasBattery: true }),
  'Keypad Touch': cap({ hasBattery: true }),
  'Keypad Vision': cap({ hasBattery: true }),
  'Keypad Vision Pro': cap({ hasBattery: true }),
  'Video Doorbell': cap({ hasBattery: true }),

  // Hubs (no controllable features via API)
  Hub: cap({}),
  'Hub Plus': cap({}),
  'Hub Mini': cap({}),
  'Hub 3': cap({}),
  'AI Hub': cap({}),

  // Climate & Air
  Humidifier: cap({
    canToggle: true,
    hasTemperature: true,
    hasHumidity: true,
    commands: ['turnOn', 'turnOff', 'setMode'],
  }),
  Humidifier2: cap({
    canToggle: true,
    hasTemperature: true,
    hasHumidity: true,
    commands: ['turnOn', 'turnOff', 'setMode'],
  }),
  'Air Purifier VOC': cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff'],
  }),
  'Air Purifier Table VOC': cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff'],
  }),
  'Air Purifier PM2.5': cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff'],
  }),
  'Air Purifier Table PM2.5': cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff'],
  }),

  // Fans
  'Battery Circulator Fan': cap({
    canToggle: true,
    hasBattery: true,
    commands: ['turnOn', 'turnOff'],
  }),
  'Circulator Fan': cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff'],
  }),
  'Standing Circulator Fan': cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff'],
  }),

  // Robot Vacuums
  'Robot Vacuum Cleaner S1': cap({
    canToggle: true,
    hasBattery: true,
    commands: ['start', 'stop', 'dock'],
  }),
  'Robot Vacuum Cleaner S1 Plus': cap({
    canToggle: true,
    hasBattery: true,
    commands: ['start', 'stop', 'dock'],
  }),
  'K10+': cap({
    canToggle: true,
    hasBattery: true,
    commands: ['start', 'stop', 'dock'],
  }),
  'K10+ Pro': cap({
    canToggle: true,
    hasBattery: true,
    commands: ['start', 'stop', 'dock'],
  }),
  'Robot Vacuum Cleaner K10+ Pro Combo': cap({
    canToggle: true,
    hasBattery: true,
    commands: ['start', 'stop', 'dock'],
  }),
  'Robot Vacuum Cleaner S10': cap({
    canToggle: true,
    hasBattery: true,
    commands: ['start', 'stop', 'dock'],
  }),
  'Robot Vacuum Cleaner S20': cap({
    canToggle: true,
    hasBattery: true,
    commands: ['start', 'stop', 'dock'],
  }),
  'Robot Vacuum Cleaner K11+': cap({
    canToggle: true,
    hasBattery: true,
    commands: ['start', 'stop', 'dock'],
  }),
  'Robot Vacuum Cleaner K20 Plus Pro': cap({
    canToggle: true,
    hasBattery: true,
    commands: ['start', 'stop', 'dock'],
  }),

  // Cameras (no controllable features via API status)
  'Indoor Cam': cap({}),
  'Pan/Tilt Cam': cap({}),
  'Pan/Tilt Cam 2K': cap({}),
  'Pan/Tilt Cam Plus 2K': cap({}),
  'Pan/Tilt Cam Plus 3K': cap({}),

  // Other Physical
  Remote: cap({}),
  'Smart Radiator Thermostat': cap({
    canSetTemperature: true,
    hasTemperature: true,
    commands: ['setTemperature'],
  }),
  'Garage Door Opener': cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff'],
  }),

  // IR Devices
  'Air Conditioner': cap({
    canToggle: true,
    canSetTemperature: true,
    commands: ['turnOn', 'turnOff', 'setAll'],
  }),
  TV: cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff', 'SetChannel', 'volumeAdd', 'volumeSub'],
  }),
  IPTV: cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff', 'SetChannel', 'volumeAdd', 'volumeSub'],
  }),
  'Set Top Box': cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff', 'SetChannel', 'volumeAdd', 'volumeSub'],
  }),
  Streamer: cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff', 'play', 'pause', 'stop', 'fastForward', 'rewind'],
  }),
  DVD: cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff', 'play', 'pause', 'stop', 'fastForward', 'rewind'],
  }),
  Projector: cap({
    canToggle: true,
    hasBrightness: true,
    commands: ['turnOn', 'turnOff', 'brightnessUp', 'brightnessDown'],
  }),
  Light: cap({
    canToggle: true,
    hasBrightness: true,
    commands: ['turnOn', 'turnOff', 'brightnessUp', 'brightnessDown'],
  }),
  'DIY Light': cap({
    canToggle: true,
    hasBrightness: true,
    commands: ['turnOn', 'turnOff', 'brightnessUp', 'brightnessDown'],
  }),
  Fan: cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff', 'swing', 'lowSpeed', 'middleSpeed', 'highSpeed'],
  }),
  Speaker: cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff', 'volumeAdd', 'volumeSub', 'setMute'],
  }),
  'Water Heater': cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff'],
  }),
  Camera: cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff'],
  }),
  'Air Purifier': cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff'],
  }),
  'Robot Vacuum Cleaner': cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff'],
  }),
  Others: cap({
    canToggle: true,
    commands: ['turnOn', 'turnOff'],
  }),
};

export function getCapabilities(deviceType: string): DeviceCapability {
  return DEVICE_CAPABILITIES[deviceType] ?? defaults;
}
