// --- API Response ---
export interface SwitchBotApiResponse<T> {
  statusCode: number;
  body: T;
  message: string;
}

// --- Physical Device ---
export interface SwitchBotDevice {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  hubDeviceId: string;
  enableCloudService: boolean;
}

// --- IR Remote Device ---
export interface SwitchBotIRDevice {
  deviceId: string;
  deviceName: string;
  remoteType: string;
  hubDeviceId: string;
}

// --- Unified Device ---
export interface Device {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  hubDeviceId: string;
  isIR: boolean;
}

// --- Device List Response ---
export interface DeviceListBody {
  deviceList: SwitchBotDevice[];
  infraredRemoteList: SwitchBotIRDevice[];
}

// --- Device Status ---
export interface BaseDeviceStatus {
  deviceId: string;
  deviceType: string;
  hubDeviceId: string;
}

export interface BotStatus extends BaseDeviceStatus {
  power: 'on' | 'off';
  battery: number;
  deviceMode: 'pressMode' | 'switchMode' | 'customizeMode';
}

export interface MeterStatus extends BaseDeviceStatus {
  temperature: number;
  humidity: number;
  battery: number;
}

export interface PlugStatus extends BaseDeviceStatus {
  power: 'on' | 'off';
  voltage: number;
  weight: number;
  electricityOfDay: number;
  electricCurrent: number;
}

export interface CurtainStatus extends BaseDeviceStatus {
  calibrate: boolean;
  group: boolean;
  moving: boolean;
  slidePosition: number;
  battery: number;
}

export interface LockStatus extends BaseDeviceStatus {
  lockState: 'locked' | 'unlocked' | 'jammed';
  doorState: 'closed' | 'opened';
  battery: number;
}

export interface ColorBulbStatus extends BaseDeviceStatus {
  power: 'on' | 'off';
  brightness: number;
  color: string;
  colorTemperature: number;
}

export interface StripLightStatus extends BaseDeviceStatus {
  power: 'on' | 'off';
  brightness: number;
  color: string;
}

export interface MotionSensorStatus extends BaseDeviceStatus {
  moveDetected: boolean;
  battery: number;
}

export interface ContactSensorStatus extends BaseDeviceStatus {
  moveDetected: boolean;
  openState: 'open' | 'close' | 'timeOutNotClose';
  battery: number;
}

export type DeviceStatus =
  | BotStatus
  | MeterStatus
  | PlugStatus
  | CurtainStatus
  | LockStatus
  | ColorBulbStatus
  | StripLightStatus
  | MotionSensorStatus
  | ContactSensorStatus
  | BaseDeviceStatus;

// --- Device Command ---
export interface DeviceCommand {
  command: string;
  parameter: string;
  commandType?: string;
}

// --- Security ---
export type SecurityMode = 'standard' | 'high';

export interface StoredCredentials {
  token: string;
  secret: string;
}

export interface EncryptedCredentials {
  ciphertext: string;
  iv: string;
  salt: string;
}

// --- AC (IR) State ---
export interface ACState {
  temperature: number;
  mode: number;
  fanSpeed: number;
  power: 'on' | 'off';
}

// --- IR Device State Cache ---
export interface IRDeviceState {
  deviceId: string;
  power: 'on' | 'off';
  lastUpdated: number;
  acState?: ACState;
}
