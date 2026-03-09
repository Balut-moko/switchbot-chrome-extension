import { describe, expect, it } from 'vitest';
import type { Device, SwitchBotDevice, SwitchBotIRDevice } from '@/types/switchbot';
import {
  getDeviceCategory,
  getDeviceGroup,
  getOptionsDeviceGroup,
  groupDevices,
  groupDevicesForOptions,
  isIRDevice,
  isStatusAvailable,
  sortDevicesByCategory,
  toUnifiedDevice,
} from '@/utils/device';

const makeDevice = (overrides: Partial<Device> = {}): Device => ({
  deviceId: 'test-id',
  deviceName: 'Test Device',
  deviceType: 'Bot',
  hubDeviceId: '',
  isIR: false,
  ...overrides,
});

const makePhysicalDevice = (overrides: Partial<SwitchBotDevice> = {}): SwitchBotDevice => ({
  deviceId: 'physical-id',
  deviceName: 'Physical Device',
  deviceType: 'Bot',
  hubDeviceId: '',
  enableCloudService: true,
  ...overrides,
});

const makeIRDevice = (overrides: Partial<SwitchBotIRDevice> = {}): SwitchBotIRDevice => ({
  deviceId: 'ir-id',
  deviceName: 'IR Device',
  remoteType: 'Air Conditioner',
  hubDeviceId: 'hub-1',
  ...overrides,
});

describe('isIRDevice', () => {
  it('returns true for IR devices (has remoteType)', () => {
    expect(isIRDevice(makeIRDevice())).toBe(true);
  });

  it('returns false for physical devices (no remoteType)', () => {
    expect(isIRDevice(makePhysicalDevice())).toBe(false);
  });
});

describe('toUnifiedDevice', () => {
  it('converts a physical device to unified format', () => {
    const device = makePhysicalDevice({
      deviceId: 'bot-1',
      deviceName: 'My Bot',
      deviceType: 'Bot',
    });
    const result = toUnifiedDevice(device);
    expect(result).toEqual({
      deviceId: 'bot-1',
      deviceName: 'My Bot',
      deviceType: 'Bot',
      hubDeviceId: '',
      isIR: false,
    });
  });

  it('converts an IR device to unified format with remoteType as deviceType', () => {
    const device = makeIRDevice({
      deviceId: 'ac-1',
      deviceName: 'AC',
      remoteType: 'Air Conditioner',
    });
    const result = toUnifiedDevice(device);
    expect(result).toEqual({
      deviceId: 'ac-1',
      deviceName: 'AC',
      deviceType: 'Air Conditioner',
      hubDeviceId: 'hub-1',
      isIR: true,
    });
  });
});

describe('getDeviceCategory', () => {
  it('returns "bot" for Bot type', () => {
    expect(getDeviceCategory(makeDevice({ deviceType: 'Bot' }))).toBe('bot');
  });

  it('returns "switch" for Plug types', () => {
    expect(getDeviceCategory(makeDevice({ deviceType: 'Plug' }))).toBe('switch');
    expect(getDeviceCategory(makeDevice({ deviceType: 'Plug Mini (JP)' }))).toBe('switch');
  });

  it('returns "light" for lighting devices', () => {
    expect(getDeviceCategory(makeDevice({ deviceType: 'Color Bulb' }))).toBe('light');
    expect(getDeviceCategory(makeDevice({ deviceType: 'Strip Light' }))).toBe('light');
  });

  it('returns "sensor" for sensor devices', () => {
    expect(getDeviceCategory(makeDevice({ deviceType: 'Meter' }))).toBe('sensor');
    expect(getDeviceCategory(makeDevice({ deviceType: 'Meter Plus' }))).toBe('sensor');
    expect(getDeviceCategory(makeDevice({ deviceType: 'Motion Sensor' }))).toBe('sensor');
  });

  it('returns "curtain" for curtain/blind types', () => {
    expect(getDeviceCategory(makeDevice({ deviceType: 'Curtain' }))).toBe('curtain');
    expect(getDeviceCategory(makeDevice({ deviceType: 'Blind Tilt' }))).toBe('curtain');
  });

  it('returns "lock" for lock and security types', () => {
    expect(getDeviceCategory(makeDevice({ deviceType: 'Smart Lock' }))).toBe('lock');
    expect(getDeviceCategory(makeDevice({ deviceType: 'Keypad' }))).toBe('lock');
  });

  it('returns "hub" for hub types', () => {
    expect(getDeviceCategory(makeDevice({ deviceType: 'Hub Mini' }))).toBe('hub');
  });

  it('returns "vacuum" for robot vacuum types', () => {
    expect(getDeviceCategory(makeDevice({ deviceType: 'K10+' }))).toBe('vacuum');
  });

  it('returns "ac" for IR Air Conditioner', () => {
    expect(getDeviceCategory(makeDevice({ deviceType: 'Air Conditioner', isIR: true }))).toBe('ac');
  });

  it('returns "tv" for IR TV-related types', () => {
    expect(getDeviceCategory(makeDevice({ deviceType: 'TV', isIR: true }))).toBe('tv');
    expect(getDeviceCategory(makeDevice({ deviceType: 'Projector', isIR: true }))).toBe('tv');
  });

  it('returns "light" for IR Light', () => {
    expect(getDeviceCategory(makeDevice({ deviceType: 'Light', isIR: true }))).toBe('light');
  });

  it('returns "other" for unknown types', () => {
    expect(getDeviceCategory(makeDevice({ deviceType: 'UnknownDevice' }))).toBe('other');
  });
});

describe('isStatusAvailable', () => {
  it('returns true for physical devices', () => {
    expect(isStatusAvailable(makeDevice({ isIR: false }))).toBe(true);
  });

  it('returns false for IR devices', () => {
    expect(isStatusAvailable(makeDevice({ isIR: true }))).toBe(false);
  });
});

describe('getDeviceGroup', () => {
  it('returns "sensors" for sensor devices', () => {
    expect(getDeviceGroup(makeDevice({ deviceType: 'Meter' }))).toBe('sensors');
  });

  it('returns "sensors" for hub devices', () => {
    expect(getDeviceGroup(makeDevice({ deviceType: 'Hub Mini' }))).toBe('sensors');
  });

  it('returns "controls" for other devices', () => {
    expect(getDeviceGroup(makeDevice({ deviceType: 'Bot' }))).toBe('controls');
    expect(getDeviceGroup(makeDevice({ deviceType: 'Smart Lock' }))).toBe('controls');
  });
});

describe('sortDevicesByCategory', () => {
  it('sorts devices by category order', () => {
    const devices = [
      makeDevice({ deviceId: '1', deviceName: 'Sensor', deviceType: 'Meter' }),
      makeDevice({ deviceId: '2', deviceName: 'Bot', deviceType: 'Bot' }),
      makeDevice({ deviceId: '3', deviceName: 'Light', deviceType: 'Color Bulb' }),
    ];
    const sorted = sortDevicesByCategory(devices);
    expect(sorted.map((d) => d.deviceType)).toEqual(['Bot', 'Color Bulb', 'Meter']);
  });

  it('sorts alphabetically within the same category', () => {
    const devices = [
      makeDevice({ deviceId: '1', deviceName: 'Z Bot', deviceType: 'Bot' }),
      makeDevice({ deviceId: '2', deviceName: 'A Bot', deviceType: 'Bot' }),
    ];
    const sorted = sortDevicesByCategory(devices);
    expect(sorted.map((d) => d.deviceName)).toEqual(['A Bot', 'Z Bot']);
  });

  it('does not mutate the original array', () => {
    const devices = [
      makeDevice({ deviceId: '1', deviceName: 'Sensor', deviceType: 'Meter' }),
      makeDevice({ deviceId: '2', deviceName: 'Bot', deviceType: 'Bot' }),
    ];
    const original = [...devices];
    sortDevicesByCategory(devices);
    expect(devices).toEqual(original);
  });
});

describe('groupDevices', () => {
  it('groups devices into controls and sensors', () => {
    const devices = [
      makeDevice({ deviceId: '1', deviceType: 'Bot' }),
      makeDevice({ deviceId: '2', deviceType: 'Meter' }),
      makeDevice({ deviceId: '3', deviceType: 'Smart Lock' }),
      makeDevice({ deviceId: '4', deviceType: 'Hub Mini' }),
    ];
    const grouped = groupDevices(devices);
    expect(grouped.controls).toHaveLength(2);
    expect(grouped.sensors).toHaveLength(2);
  });

  it('preserves order when preserveOrder option is set', () => {
    const devices = [
      makeDevice({ deviceId: '1', deviceName: 'Z Meter', deviceType: 'Meter' }),
      makeDevice({ deviceId: '2', deviceName: 'A Meter', deviceType: 'Meter Plus' }),
    ];
    const grouped = groupDevices(devices, { preserveOrder: true });
    expect(grouped.sensors.map((d) => d.deviceName)).toEqual(['Z Meter', 'A Meter']);
  });
});

describe('getOptionsDeviceGroup', () => {
  it('returns "ir" for IR devices', () => {
    expect(getOptionsDeviceGroup(makeDevice({ isIR: true, deviceType: 'Air Conditioner' }))).toBe(
      'ir',
    );
  });

  it('returns "sensors" for sensor devices', () => {
    expect(getOptionsDeviceGroup(makeDevice({ deviceType: 'Meter' }))).toBe('sensors');
  });

  it('returns "controls" for other physical devices', () => {
    expect(getOptionsDeviceGroup(makeDevice({ deviceType: 'Bot' }))).toBe('controls');
  });
});

describe('groupDevicesForOptions', () => {
  it('groups into controls, sensors, and ir', () => {
    const devices = [
      makeDevice({ deviceId: '1', deviceType: 'Bot' }),
      makeDevice({ deviceId: '2', deviceType: 'Meter' }),
      makeDevice({ deviceId: '3', deviceType: 'Air Conditioner', isIR: true }),
    ];
    const grouped = groupDevicesForOptions(devices);
    expect(grouped.controls).toHaveLength(1);
    expect(grouped.sensors).toHaveLength(1);
    expect(grouped.ir).toHaveLength(1);
  });
});
