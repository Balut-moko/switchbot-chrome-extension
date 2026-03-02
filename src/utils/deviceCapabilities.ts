export interface DeviceCapability {
  canToggle: boolean;
  canSetPosition: boolean;
  canSetTemperature: boolean;
  hasTemperature: boolean;
  hasHumidity: boolean;
  hasBattery: boolean;
  hasBrightness: boolean;
  hasColor: boolean;
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
  commands: [],
};

function cap(overrides: Partial<DeviceCapability>): DeviceCapability {
  return { ...defaults, ...overrides };
}

export const DEVICE_CAPABILITIES: Record<string, DeviceCapability> = {
  // Physical switch devices
  Bot: cap({ canToggle: true, hasBattery: true, commands: ['turnOn', 'turnOff', 'press'] }),
  Plug: cap({ canToggle: true, commands: ['turnOn', 'turnOff'] }),
  'Plug Mini (US)': cap({ canToggle: true, commands: ['turnOn', 'turnOff'] }),
  'Plug Mini (JP)': cap({ canToggle: true, commands: ['turnOn', 'turnOff'] }),

  // Lights
  'Color Bulb': cap({ canToggle: true, hasBrightness: true, hasColor: true, commands: ['turnOn', 'turnOff', 'setBrightness', 'setColor'] }),
  'Strip Light': cap({ canToggle: true, hasBrightness: true, hasColor: true, commands: ['turnOn', 'turnOff', 'setBrightness', 'setColor'] }),
  'Ceiling Light': cap({ canToggle: true, hasBrightness: true, commands: ['turnOn', 'turnOff', 'setBrightness'] }),
  'Ceiling Light Pro': cap({ canToggle: true, hasBrightness: true, hasColor: true, commands: ['turnOn', 'turnOff', 'setBrightness'] }),

  // Sensors
  Meter: cap({ hasTemperature: true, hasHumidity: true, hasBattery: true }),
  'Meter Plus': cap({ hasTemperature: true, hasHumidity: true, hasBattery: true }),
  MeterPlus: cap({ hasTemperature: true, hasHumidity: true, hasBattery: true }),
  WoIOSensor: cap({ hasTemperature: true, hasHumidity: true, hasBattery: true }),
  'Hub 2': cap({ hasTemperature: true, hasHumidity: true }),
  'Motion Sensor': cap({ hasBattery: true }),
  'Contact Sensor': cap({ hasBattery: true }),

  // Curtain / Blind
  Curtain: cap({ canSetPosition: true, hasBattery: true, commands: ['setPosition', 'turnOn', 'turnOff'] }),
  Curtain3: cap({ canSetPosition: true, hasBattery: true, commands: ['setPosition', 'turnOn', 'turnOff'] }),
  'Blind Tilt': cap({ canSetPosition: true, hasBattery: true, commands: ['setPosition'] }),
  'Roller Shade': cap({ canSetPosition: true, hasBattery: true, commands: ['setPosition'] }),

  // Lock
  'Smart Lock': cap({ canToggle: true, hasBattery: true, commands: ['lock', 'unlock'] }),
  'Smart Lock Pro': cap({ canToggle: true, hasBattery: true, commands: ['lock', 'unlock'] }),

  // IR Devices
  'Air Conditioner': cap({ canToggle: true, canSetTemperature: true, commands: ['turnOn', 'turnOff', 'setAll'] }),
  TV: cap({ canToggle: true, commands: ['turnOn', 'turnOff', 'SetChannel', 'volumeAdd', 'volumeSub'] }),
  IPTV: cap({ canToggle: true, commands: ['turnOn', 'turnOff', 'SetChannel', 'volumeAdd', 'volumeSub'] }),
  'Set Top Box': cap({ canToggle: true, commands: ['turnOn', 'turnOff', 'SetChannel', 'volumeAdd', 'volumeSub'] }),
  Light: cap({ canToggle: true, hasBrightness: true, commands: ['turnOn', 'turnOff', 'brightnessUp', 'brightnessDown'] }),
  'DIY Light': cap({ canToggle: true, hasBrightness: true, commands: ['turnOn', 'turnOff', 'brightnessUp', 'brightnessDown'] }),
  Fan: cap({ canToggle: true, commands: ['turnOn', 'turnOff', 'swing', 'lowSpeed', 'middleSpeed', 'highSpeed'] }),
};

export function getCapabilities(deviceType: string): DeviceCapability {
  return DEVICE_CAPABILITIES[deviceType] ?? defaults;
}
