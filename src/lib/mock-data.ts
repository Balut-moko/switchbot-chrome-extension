/**
 * モックデバイス・ステータスデータ（開発専用）
 *
 * MOCK_MODE=true 時のみ動的 import され、
 * 本番ビルドでは tree-shaking により除外される。
 */

import type { Device, DeviceStatus } from '@/types/switchbot';

// --- Mock Devices ---

export const MOCK_DEVICES: Device[] = [
  // Bot (press mode)
  {
    deviceId: 'mock-bot-press',
    deviceName: 'Bot (Press)',
    deviceType: 'Bot',
    hubDeviceId: 'mock-hub-2',
    isIR: false,
  },
  // Bot (switch mode)
  {
    deviceId: 'mock-bot-switch',
    deviceName: 'Bot (Switch)',
    deviceType: 'Bot',
    hubDeviceId: 'mock-hub-2',
    isIR: false,
  },
  // Plug Mini
  {
    deviceId: 'mock-plug-mini',
    deviceName: 'Plug Mini',
    deviceType: 'Plug Mini (JP)',
    hubDeviceId: '',
    isIR: false,
  },
  // Color Bulb
  {
    deviceId: 'mock-color-bulb',
    deviceName: 'Color Bulb',
    deviceType: 'Color Bulb',
    hubDeviceId: '',
    isIR: false,
  },
  // Strip Light
  {
    deviceId: 'mock-strip-light',
    deviceName: 'Strip Light',
    deviceType: 'Strip Light',
    hubDeviceId: '',
    isIR: false,
  },
  // Meter
  {
    deviceId: 'mock-meter',
    deviceName: 'Meter',
    deviceType: 'Meter',
    hubDeviceId: 'mock-hub-2',
    isIR: false,
  },
  // Meter Pro (CO2)
  {
    deviceId: 'mock-meter-pro-co2',
    deviceName: 'Meter Pro (CO2)',
    deviceType: 'MeterPro(CO2)',
    hubDeviceId: '',
    isIR: false,
  },
  // Motion Sensor
  {
    deviceId: 'mock-motion-sensor',
    deviceName: 'Motion Sensor',
    deviceType: 'Motion Sensor',
    hubDeviceId: 'mock-hub-2',
    isIR: false,
  },
  // Contact Sensor
  {
    deviceId: 'mock-contact-sensor',
    deviceName: 'Contact Sensor',
    deviceType: 'Contact Sensor',
    hubDeviceId: 'mock-hub-2',
    isIR: false,
  },
  // Hub 2
  {
    deviceId: 'mock-hub-2',
    deviceName: 'Hub 2',
    deviceType: 'Hub 2',
    hubDeviceId: '',
    isIR: false,
  },
  // Curtain
  {
    deviceId: 'mock-curtain',
    deviceName: 'Curtain',
    deviceType: 'Curtain3',
    hubDeviceId: 'mock-hub-2',
    isIR: false,
  },
  // Blind Tilt
  {
    deviceId: 'mock-blind-tilt',
    deviceName: 'Blind Tilt',
    deviceType: 'Blind Tilt',
    hubDeviceId: 'mock-hub-2',
    isIR: false,
  },
  // Smart Lock
  {
    deviceId: 'mock-smart-lock',
    deviceName: 'Smart Lock',
    deviceType: 'Smart Lock',
    hubDeviceId: 'mock-hub-2',
    isIR: false,
  },
  // Humidifier (未対応カテゴリ)
  {
    deviceId: 'mock-humidifier',
    deviceName: 'Humidifier',
    deviceType: 'Humidifier',
    hubDeviceId: '',
    isIR: false,
  },
  // Robot Vacuum (未対応カテゴリ)
  {
    deviceId: 'mock-robot-vacuum',
    deviceName: 'Robot Vacuum S1',
    deviceType: 'Robot Vacuum Cleaner S1',
    hubDeviceId: '',
    isIR: false,
  },
  // IR: Air Conditioner
  {
    deviceId: 'mock-ir-ac',
    deviceName: 'Living Room AC',
    deviceType: 'Air Conditioner',
    hubDeviceId: 'mock-hub-2',
    isIR: true,
  },
  // IR: TV
  {
    deviceId: 'mock-ir-tv',
    deviceName: 'Living Room TV',
    deviceType: 'TV',
    hubDeviceId: 'mock-hub-2',
    isIR: true,
  },
  // IR: Light
  {
    deviceId: 'mock-ir-light',
    deviceName: 'Ceiling Light (IR)',
    deviceType: 'Light',
    hubDeviceId: 'mock-hub-2',
    isIR: true,
  },
  // IR: Fan
  {
    deviceId: 'mock-ir-fan',
    deviceName: 'Fan (IR)',
    deviceType: 'Fan',
    hubDeviceId: 'mock-hub-2',
    isIR: true,
  },
];

// --- Mock Statuses ---

export const MOCK_STATUSES: Record<string, DeviceStatus> = {
  'mock-bot-press': {
    deviceId: 'mock-bot-press',
    deviceType: 'Bot',
    hubDeviceId: 'mock-hub-2',
    power: 'off',
    battery: 85,
    deviceMode: 'pressMode',
  },
  'mock-bot-switch': {
    deviceId: 'mock-bot-switch',
    deviceType: 'Bot',
    hubDeviceId: 'mock-hub-2',
    power: 'on',
    battery: 72,
    deviceMode: 'switchMode',
  },
  'mock-plug-mini': {
    deviceId: 'mock-plug-mini',
    deviceType: 'Plug Mini (JP)',
    hubDeviceId: '',
    power: 'on',
    voltage: 121.5,
    weight: 45.2,
    electricityOfDay: 320,
    electricCurrent: 0.37,
  },
  'mock-color-bulb': {
    deviceId: 'mock-color-bulb',
    deviceType: 'Color Bulb',
    hubDeviceId: '',
    power: 'on',
    brightness: 80,
    color: '255:128:0',
    colorTemperature: 3500,
  },
  'mock-strip-light': {
    deviceId: 'mock-strip-light',
    deviceType: 'Strip Light',
    hubDeviceId: '',
    power: 'on',
    brightness: 60,
    color: '0:128:255',
  },
  'mock-meter': {
    deviceId: 'mock-meter',
    deviceType: 'Meter',
    hubDeviceId: 'mock-hub-2',
    temperature: 23.5,
    humidity: 48,
    battery: 90,
  },
  'mock-meter-pro-co2': {
    deviceId: 'mock-meter-pro-co2',
    deviceType: 'MeterPro(CO2)',
    hubDeviceId: '',
    temperature: 22.1,
    humidity: 55,
    battery: 95,
    CO2: 620,
  },
  'mock-motion-sensor': {
    deviceId: 'mock-motion-sensor',
    deviceType: 'Motion Sensor',
    hubDeviceId: 'mock-hub-2',
    moveDetected: false,
    battery: 88,
  },
  'mock-contact-sensor': {
    deviceId: 'mock-contact-sensor',
    deviceType: 'Contact Sensor',
    hubDeviceId: 'mock-hub-2',
    moveDetected: false,
    openState: 'close',
    battery: 76,
  },
  'mock-hub-2': {
    deviceId: 'mock-hub-2',
    deviceType: 'Hub 2',
    hubDeviceId: '',
    temperature: 24.0,
    humidity: 50,
    battery: 100,
  },
  'mock-curtain': {
    deviceId: 'mock-curtain',
    deviceType: 'Curtain3',
    hubDeviceId: 'mock-hub-2',
    calibrate: true,
    group: false,
    moving: false,
    slidePosition: 30,
    battery: 65,
  },
  'mock-blind-tilt': {
    deviceId: 'mock-blind-tilt',
    deviceType: 'Blind Tilt',
    hubDeviceId: 'mock-hub-2',
    calibrate: true,
    group: false,
    moving: false,
    slidePosition: 50,
    battery: 80,
  },
  'mock-smart-lock': {
    deviceId: 'mock-smart-lock',
    deviceType: 'Smart Lock',
    hubDeviceId: 'mock-hub-2',
    lockState: 'locked',
    doorState: 'closed',
    battery: 92,
  },
  'mock-humidifier': {
    deviceId: 'mock-humidifier',
    deviceType: 'Humidifier',
    hubDeviceId: '',
  },
  'mock-robot-vacuum': {
    deviceId: 'mock-robot-vacuum',
    deviceType: 'Robot Vacuum Cleaner S1',
    hubDeviceId: '',
  },
};
