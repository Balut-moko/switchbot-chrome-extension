# Chrome Web Store Listing

## Short Description (manifest `description`, max 132 chars)

> Unofficial extension to control and monitor your SwitchBot smart home devices directly from the Chrome toolbar.

_Character count: 109_

## Detailed Description (Store listing)

Control and monitor your SwitchBot smart home devices without leaving your browser. SwitchBot Controller lets you operate physical devices and IR remotes from a convenient toolbar popup, powered by the SwitchBot API v1.1.

### Supported Devices

**Physical devices** -- operate and view real-time status:
- Bot (switch press)
- Plug / Plug Mini
- Curtain / Curtain 3 / Blind Tilt / Roller Shade
- Smart Lock / Smart Lock Pro
- Color Bulb / Strip Light / Ceiling Light
- Meter / Meter Plus / Hub 2 (temperature & humidity)
- Motion Sensor / Contact Sensor

**IR remote devices** -- send commands via SwitchBot Hub:
- Air Conditioner (temperature, mode, and fan speed control)
- TV / IPTV / Set Top Box
- Light / DIY Light
- Fan
- Other learned IR remotes

### Features

- One-click device control from the browser toolbar popup
- Real-time status monitoring for physical devices (power, temperature, humidity, battery, lock state, curtain position, and more)
- Full air conditioner control: set temperature (16-30 C), mode (Auto / Cool / Dry / Fan / Heat), and fan speed (Auto / Low / Medium / High)
- Automatic status refresh every 5 minutes via chrome.alarms
- Local device cache for instant popup loading
- Connection test to verify API credentials

### Security & Privacy

Your API credentials are stored locally and never leave your browser except to communicate with the official SwitchBot API.

**Standard mode** -- credentials are saved in chrome.storage.local on your device.

**High Security mode** -- credentials are encrypted with a master password using PBKDF2 (600,000 iterations) key derivation and AES-GCM encryption. Decrypted credentials are held only in chrome.storage.session and are cleared when the browser closes.

- Communicates exclusively with https://api.switch-bot.com (SwitchBot API v1.1)
- No telemetry, no analytics, no tracking
- No data is collected or shared with the developer or any third party
- Fully open source

### Setup

1. Install the extension
2. Click the toolbar icon and enter your SwitchBot API Token and Secret Key (available in the SwitchBot app under Settings > Developer Options)
3. Choose Standard or High Security mode
4. Your devices appear automatically

### Disclaimer

This is an unofficial, third-party extension. Not affiliated with SwitchBot or Wonderlabs Inc.

## Single Purpose Statement

Control and monitor SwitchBot smart home devices directly from the Chrome toolbar.

## Category

Productivity

## URLs

| Purpose | URL |
|---|---|
| Privacy Policy | https://balut-moko.github.io/switchbot-chrome-extension/privacy-policy |
| Source Code | https://github.com/Balut-moko/switchbot-chrome-extension |

## Permission Justifications

These notes are for entry in the Chrome Web Store developer dashboard.

| Permission | Justification |
|---|---|
| `storage` | Stores the user's SwitchBot API credentials locally and caches device data for fast popup loading. No data is transmitted to any server other than the official SwitchBot API. |
| `alarms` | Schedules automatic device status refresh every 5 minutes so that the popup displays up-to-date information when opened. |
| `host_permissions: https://api.switch-bot.com/*` | Required to send authenticated API requests to the SwitchBot API v1.1 for retrieving device lists, reading device status, and sending device commands. No other hosts are contacted. |
