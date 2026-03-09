import { describe, expect, it } from 'vitest';
import type { Device, SwitchBotDevice, SwitchBotIRDevice } from '@/types/switchbot';
import {
  getDeviceCategory,
  getDeviceGroup,
  getDeviceIcon,
  getOptionsDeviceGroup,
  groupDevices,
  groupDevicesForOptions,
  isIRDevice,
  isStatusAvailable,
  sortDevicesByCategory,
  toUnifiedDevice,
} from '@/utils/device';

// --- Test helpers ---

function makeDevice(overrides: Partial<Device> = {}): Device {
  return {
    deviceId: 'test-id',
    deviceName: 'Test Device',
    deviceType: 'Bot',
    hubDeviceId: 'hub-id',
    isIR: false,
    ...overrides,
  };
}

function makePhysicalDevice(overrides: Partial<SwitchBotDevice> = {}): SwitchBotDevice {
  return {
    deviceId: 'physical-id',
    deviceName: 'Physical Device',
    deviceType: 'Bot',
    hubDeviceId: 'hub-id',
    enableCloudService: true,
    ...overrides,
  };
}

function makeIRDevice(overrides: Partial<SwitchBotIRDevice> = {}): SwitchBotIRDevice {
  return {
    deviceId: 'ir-id',
    deviceName: 'IR Device',
    remoteType: 'Air Conditioner',
    hubDeviceId: 'hub-id',
    ...overrides,
  };
}

// --- Tests ---

describe('isIRDevice', () => {
  it('physical device を false と判定する', () => {
    expect(isIRDevice(makePhysicalDevice())).toBe(false);
  });

  it('IR device を true と判定する', () => {
    expect(isIRDevice(makeIRDevice())).toBe(true);
  });
});

describe('toUnifiedDevice', () => {
  it('physical device を統一形式に変換する', () => {
    const device = makePhysicalDevice({ deviceType: 'Plug Mini (JP)' });
    const unified = toUnifiedDevice(device);
    expect(unified).toEqual({
      deviceId: 'physical-id',
      deviceName: 'Physical Device',
      deviceType: 'Plug Mini (JP)',
      hubDeviceId: 'hub-id',
      isIR: false,
    });
  });

  it('IR device を統一形式に変換する（remoteType → deviceType）', () => {
    const device = makeIRDevice({ remoteType: 'TV' });
    const unified = toUnifiedDevice(device);
    expect(unified).toEqual({
      deviceId: 'ir-id',
      deviceName: 'IR Device',
      deviceType: 'TV',
      hubDeviceId: 'hub-id',
      isIR: true,
    });
  });
});

describe('getDeviceCategory', () => {
  const cases: [string, boolean, string][] = [
    ['Bot', false, 'bot'],
    ['Plug', false, 'switch'],
    ['Plug Mini (JP)', false, 'switch'],
    ['Color Bulb', false, 'light'],
    ['Strip Light', false, 'light'],
    ['Meter', false, 'sensor'],
    ['Meter Plus', false, 'sensor'],
    ['MeterPro(CO2)', false, 'sensor'],
    ['Hub 2', false, 'sensor'],
    ['Curtain', false, 'curtain'],
    ['Curtain3', false, 'curtain'],
    ['Blind Tilt', false, 'curtain'],
    ['Smart Lock', false, 'lock'],
    ['Hub Mini', false, 'hub'],
    ['Robot Vacuum Cleaner S1', false, 'vacuum'],
    ['K10+', false, 'vacuum'],
    ['Indoor Cam', false, 'camera'],
    ['Humidifier', false, 'climate'],
    ['Battery Circulator Fan', false, 'fan'],
    ['Keypad', false, 'lock'],
    ['Remote', false, 'other'],
    ['Air Conditioner', true, 'ac'],
    ['TV', true, 'tv'],
    ['IPTV', true, 'tv'],
    ['DVD', true, 'tv'],
    ['Light', true, 'light'],
    ['Fan', true, 'fan'],
    ['Camera', true, 'camera'],
    ['Air Purifier', true, 'climate'],
    ['Robot Vacuum Cleaner', true, 'vacuum'],
    ['Others', true, 'other'],
    ['Unknown Device', false, 'other'],
    ['Unknown IR', true, 'other'],
  ];

  it.each(cases)('%s (isIR=%s) → %s', (deviceType, isIR, expected) => {
    const device = makeDevice({ deviceType, isIR });
    expect(getDeviceCategory(device)).toBe(expected);
  });
});

describe('getDeviceIcon', () => {
  it('既知のデバイスタイプにアイコンを返す', () => {
    const device = makeDevice({ deviceType: 'Bot' });
    const icon = getDeviceIcon(device);
    expect(icon).toBeDefined();
    expect(typeof icon).toBe('object'); // LucideIcon is a ForwardRefExoticComponent
  });

  it('不明な physical device にデフォルトアイコンを返す', () => {
    const device = makeDevice({ deviceType: 'Unknown', isIR: false });
    const icon = getDeviceIcon(device);
    expect(icon).toBeDefined();
  });

  it('不明な IR device にデフォルトアイコンを返す', () => {
    const device = makeDevice({ deviceType: 'Unknown', isIR: true });
    const icon = getDeviceIcon(device);
    expect(icon).toBeDefined();
  });
});

describe('isStatusAvailable', () => {
  it('physical device は true', () => {
    expect(isStatusAvailable(makeDevice({ isIR: false }))).toBe(true);
  });

  it('IR device は false', () => {
    expect(isStatusAvailable(makeDevice({ isIR: true }))).toBe(false);
  });
});

describe('getDeviceGroup', () => {
  it('sensor カテゴリは sensors グループ', () => {
    expect(getDeviceGroup(makeDevice({ deviceType: 'Meter' }))).toBe('sensors');
  });

  it('hub カテゴリは sensors グループ', () => {
    expect(getDeviceGroup(makeDevice({ deviceType: 'Hub Mini' }))).toBe('sensors');
  });

  it('bot カテゴリは controls グループ', () => {
    expect(getDeviceGroup(makeDevice({ deviceType: 'Bot' }))).toBe('controls');
  });

  it('light カテゴリは controls グループ', () => {
    expect(getDeviceGroup(makeDevice({ deviceType: 'Color Bulb' }))).toBe('controls');
  });
});

describe('sortDevicesByCategory', () => {
  it('カテゴリ順にソートする', () => {
    const devices = [
      makeDevice({ deviceName: 'Sensor', deviceType: 'Meter' }),
      makeDevice({ deviceName: 'Bot', deviceType: 'Bot' }),
      makeDevice({ deviceName: 'Light', deviceType: 'Color Bulb' }),
    ];
    const sorted = sortDevicesByCategory(devices);
    expect(sorted.map((d) => d.deviceName)).toEqual(['Bot', 'Light', 'Sensor']);
  });

  it('同カテゴリ内は名前順にソートする', () => {
    const devices = [
      makeDevice({ deviceName: 'Z Plug', deviceType: 'Plug' }),
      makeDevice({ deviceName: 'A Plug', deviceType: 'Plug Mini (JP)' }),
    ];
    const sorted = sortDevicesByCategory(devices);
    expect(sorted.map((d) => d.deviceName)).toEqual(['A Plug', 'Z Plug']);
  });

  it('元の配列を変更しない', () => {
    const devices = [
      makeDevice({ deviceName: 'B', deviceType: 'Meter' }),
      makeDevice({ deviceName: 'A', deviceType: 'Bot' }),
    ];
    const original = [...devices];
    sortDevicesByCategory(devices);
    expect(devices).toEqual(original);
  });
});

describe('groupDevices', () => {
  it('controls と sensors に分類する', () => {
    const devices = [
      makeDevice({ deviceName: 'Bot', deviceType: 'Bot' }),
      makeDevice({ deviceName: 'Meter', deviceType: 'Meter' }),
      makeDevice({ deviceName: 'Hub', deviceType: 'Hub Mini' }),
      makeDevice({ deviceName: 'Light', deviceType: 'Color Bulb' }),
    ];
    const grouped = groupDevices(devices);
    expect(grouped.controls.map((d) => d.deviceName)).toContain('Bot');
    expect(grouped.controls.map((d) => d.deviceName)).toContain('Light');
    expect(grouped.sensors.map((d) => d.deviceName)).toContain('Meter');
    expect(grouped.sensors.map((d) => d.deviceName)).toContain('Hub');
  });

  it('preserveOrder: true でソートしない', () => {
    const devices = [
      makeDevice({ deviceName: 'Z Meter', deviceType: 'Meter' }),
      makeDevice({ deviceName: 'A Meter', deviceType: 'Meter Plus' }),
    ];
    const grouped = groupDevices(devices, { preserveOrder: true });
    expect(grouped.sensors.map((d) => d.deviceName)).toEqual(['Z Meter', 'A Meter']);
  });
});

describe('getOptionsDeviceGroup', () => {
  it('IR device は ir グループ', () => {
    expect(getOptionsDeviceGroup(makeDevice({ isIR: true, deviceType: 'TV' }))).toBe('ir');
  });

  it('sensor は sensors グループ', () => {
    expect(getOptionsDeviceGroup(makeDevice({ deviceType: 'Meter' }))).toBe('sensors');
  });

  it('その他は controls グループ', () => {
    expect(getOptionsDeviceGroup(makeDevice({ deviceType: 'Bot' }))).toBe('controls');
  });
});

describe('groupDevicesForOptions', () => {
  it('controls, sensors, ir に3分類する', () => {
    const devices = [
      makeDevice({ deviceName: 'Bot', deviceType: 'Bot' }),
      makeDevice({ deviceName: 'Meter', deviceType: 'Meter' }),
      makeDevice({ deviceName: 'AC', deviceType: 'Air Conditioner', isIR: true }),
    ];
    const grouped = groupDevicesForOptions(devices);
    expect(grouped.controls).toHaveLength(1);
    expect(grouped.sensors).toHaveLength(1);
    expect(grouped.ir).toHaveLength(1);
  });
});
