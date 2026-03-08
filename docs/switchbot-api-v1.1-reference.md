# SwitchBot API v1.1 Reference

**Base URL**: `https://api.switch-bot.com/v1.1`
**Rate Limit**: 10,000 calls/day
**Last Updated**: 2025年12月12日（GitHub）
**Official Docs**: https://github.com/OpenWonderLabs/SwitchBotAPI

## Authentication

Every request requires 4 headers:

| Header | Value |
|--------|-------|
| `Authorization` | Open Token (string) |
| `t` | 13桁 Unix timestamp (ms) |
| `sign` | Base64(HMAC-SHA256(secret, token + t + nonce)) |
| `nonce` | UUID v4 推奨 |

### Web Crypto API Implementation

```javascript
async function generateAuthHeaders(token, secret) {
    const t = Date.now().toString();
    const nonce = crypto.randomUUID();
    const data = token + t + nonce;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    const sign = btoa(String.fromCharCode(...new Uint8Array(signature)));

    return {
        'Authorization': token,
        'sign': sign,
        't': t,
        'nonce': nonce,
        'Content-Type': 'application/json; charset=utf8'
    };
}
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/devices` | デバイス一覧取得 |
| GET | `/devices/{id}/status` | デバイスステータス取得 |
| POST | `/devices/{id}/commands` | デバイスコマンド送信 |
| GET | `/scenes` | シーン一覧取得 |
| POST | `/scenes/{id}/execute` | シーン実行 |
| POST | `/webhook/setupWebhook` | Webhook 登録 |
| POST | `/webhook/queryWebhook` | Webhook 照会 |
| POST | `/webhook/updateWebhook` | Webhook 更新 |
| POST | `/webhook/deleteWebhook` | Webhook 削除 |

## Response Format

```json
{
    "statusCode": 100,
    "message": "success",
    "body": { ... }
}
```

### Status Codes (API Body)
| Code | Meaning |
|------|---------|
| 100 | Success |
| 190 | System error |

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

## GET /devices Response

```json
{
    "body": {
        "deviceList": [
            {
                "deviceId": "ABCDEF123456",
                "deviceName": "My Bot",
                "deviceType": "Bot",
                "enableCloudService": true,
                "hubDeviceId": "FEDCBA654321"
            }
        ],
        "infraredRemoteList": [
            {
                "deviceId": "IR-ID",
                "deviceName": "My AC",
                "remoteType": "Air Conditioner",
                "hubDeviceId": "FEDCBA654321"
            }
        ]
    }
}
```

## Physical Device Types

### Hubs
`Hub`, `Hub Plus`, `Hub Mini`, `Hub 2`, `Hub 3`, `AI Hub`

### Bots & Switches
`Bot`, `Relay Switch 1`, `Relay Switch 1PM`, `Relay Switch 2PM`

### Curtains & Blinds
`Curtain`, `Curtain3`, `Blind Tilt`, `Roller Shade`

### Locks & Security
`Smart Lock`, `Smart Lock Pro`, `Smart Lock Ultra`, `Lock Lite`, `Keypad`, `Keypad Touch`, `Keypad Vision`, `Keypad Vision Pro`, `Video Doorbell`

### Sensors
`Meter`, `MeterPlus`, `WoIOSensor`, `MeterPro`, `MeterPro(CO2)`, `Motion Sensor`, `Contact Sensor`, `Presence Sensor`, `Water Detector`, `Home Climate Panel`

### Lighting
`Color Bulb`, `Strip Light`, `Strip Light 3`, `RGBICWW Strip Light`, `RGBIC Neon Rope Light`, `RGBIC Neon Wire Rope Light`, `Ceiling Light`, `Ceiling Light Pro`, `Floor Lamp`, `RGBICWW Floor Lamp`, `Candle Warmer Lamp`, `AI Art Frame`

### Plugs
`Plug`, `Plug Mini (US)`, `Plug Mini (JP)`, `Plug Mini (EU)`

### Climate & Air
`Humidifier`, `Humidifier2`, `Air Purifier VOC`, `Air Purifier Table VOC`, `Air Purifier PM2.5`, `Air Purifier Table PM2.5`

### Fans
`Battery Circulator Fan`, `Circulator Fan`, `Standing Circulator Fan`

### Robot Vacuums
`Robot Vacuum Cleaner S1`, `Robot Vacuum Cleaner S1 Plus`, `K10+`, `K10+ Pro`, `Robot Vacuum Cleaner K10+ Pro Combo`, `Robot Vacuum Cleaner S10`, `Robot Vacuum Cleaner S20`, `Robot Vacuum Cleaner K11+`, `Robot Vacuum Cleaner K20 Plus Pro`

### Cameras
`Indoor Cam`, `Pan/Tilt Cam`, `Pan/Tilt Cam 2K`, `Pan/Tilt Cam Plus 2K`, `Pan/Tilt Cam Plus 3K`

### Other
`Remote`, `Smart Radiator Thermostat`, `Garage Door Opener`

## Commands by Device Type

### Common (多くのデバイス共通)
| Command | Parameter | Description |
|---------|-----------|-------------|
| `turnOn` | `default` | 電源 ON |
| `turnOff` | `default` | 電源 OFF |
| `toggle` | `default` | トグル |

### Bot
| Command | Parameter |
|---------|-----------|
| `press` | `default` |
| `turnOn` | `default` |
| `turnOff` | `default` |

### Curtain / Curtain3
| Command | Parameter | Description |
|---------|-----------|-------------|
| `setPosition` | `index,mode,position` | index:0, mode:0=Performance/1=Silent/ff=default, position:0(open)-100(closed) |
| `pause` | `default` | 停止 |

### Blind Tilt
| Command | Parameter | Description |
|---------|-----------|-------------|
| `setPosition` | `direction;position` | direction: up/down, position: 0-100 (2の倍数) |
| `fullyOpen` | `default` | |
| `closeUp` | `default` | |
| `closeDown` | `default` | |

### Roller Shade
| Command | Parameter |
|---------|-----------|
| `setPosition` | `0-100` (0=open, 100=closed) |
| `pause` | `default` |

### Smart Lock (全バリアント)
| Command | Parameter |
|---------|-----------|
| `lock` | `default` |
| `unlock` | `default` |

### Color Bulb
| Command | Parameter | Description |
|---------|-----------|-------------|
| `setBrightness` | `1-100` | 明るさ |
| `setColor` | `"R:G:B"` | RGB (例: `"255:100:0"`) |
| `setColorTemperature` | `2700-6500` | 色温度 (K) |

### Strip Light
| Command | Parameter |
|---------|-----------|
| `setBrightness` | `1-100` |
| `setColor` | `"R:G:B"` |

### Ceiling Light
| Command | Parameter |
|---------|-----------|
| `setBrightness` | `1-100` |
| `setColorTemperature` | `2700-6500` |

### Humidifier
| Command | Parameter | Description |
|---------|-----------|-------------|
| `setMode` | `auto/101/102/103/0-100` | auto, low(101), medium(102), high(103), or % |

### Robot Vacuum
| Command | Parameter | Description |
|---------|-----------|-------------|
| `start` | `default` | 清掃開始 |
| `stop` | `default` | 停止 |
| `dock` | `default` | 充電ドックへ戻る |
| `pow` | `0-3` | 吸引力: 0=Quiet, 1=Standard, 2=Strong, 3=Max |

## IR Remote Device Types (infraredRemoteList)

`Air Conditioner`, `TV`, `Light`, `Streamer`, `Set Top Box`, `DVD`, `Fan`, `Projector`, `Camera`, `Air Purifier`, `Speaker`, `Water Heater`, `Robot Vacuum Cleaner`, `Others`

### IR Common Commands (`commandType: "command"`)
| Command | Applicable Devices |
|---------|-------------------|
| `turnOn` | All |
| `turnOff` | All |
| `SetChannel` (param: number) | TV, IPTV/Streamer, Set Top Box |
| `volumeAdd` / `volumeSub` | TV, IPTV/Streamer, Set Top Box, Speaker |
| `channelAdd` / `channelSub` | TV, IPTV/Streamer, Set Top Box |
| `setMute` | DVD, Speaker |
| `FastForward` / `Rewind` | DVD, Speaker |
| `Next` / `Previous` | DVD, Speaker |
| `Pause` / `Play` / `Stop` | DVD, Speaker |
| `brightnessUp` / `brightnessDown` | Light, Projector |
| `swing` / `timer` | Fan |
| `lowSpeed` / `middleSpeed` / `highSpeed` | Fan |

### Air Conditioner `setAll`
```
parameter: "temperature,mode,fanSpeed,powerState"
```
| Field | Values |
|-------|--------|
| temperature | 16-30 (integer) |
| mode | 1=Auto, 2=Cool, 3=Dry, 4=Fan, 5=Heat |
| fanSpeed | 1=Auto, 2=Low, 3=Medium, 4=High |
| powerState | `on` / `off` |

Example: `"24,2,1,on"` = 24度, 冷房, 自動風量, ON

### Custom Learned Buttons
```json
{
    "command": "ボタン名",
    "parameter": "default",
    "commandType": "customize"
}
```

## Device Status Fields

### Bot
`power` (on/off), `battery` (0-100), `deviceMode` (pressMode/switchMode/customizeMode)

### Curtain / Curtain3
`calibrate`, `group`, `moving`, `battery`, `slidePosition` (0=open, 100=closed)

### Meter / MeterPlus / WoIOSensor / MeterPro
`temperature`, `humidity`, `battery`
MeterPro(CO2): + `CO2`

### Smart Lock
`lockState` (locked/unlocked/jammed), `doorState` (closed/opened), `battery`, `calibrate`

### Motion Sensor
`moveDetected` (boolean), `brightness` (bright/dim), `battery`

### Contact Sensor
`moveDetected`, `openState` (open/close/timeOutNotClose), `brightness`, `battery`

### Plug / Plug Mini
`power` (on/off)
Plug Mini PM: + `voltage`, `weight` (watts), `electricityOfDay`, `electricCurrent`

### Color Bulb
`power`, `brightness` (1-100), `color` ("R:G:B"), `colorTemperature` (2700-6500)

### Strip Light
`power`, `brightness`, `color`

### Ceiling Light
`power`, `brightness`, `colorTemperature`

### Humidifier
`power`, `humidity`, `temperature`, `nebulizationEfficiency`, `auto`, `childLock`, `sound`, `lackWater`

### Robot Vacuum
`workingStatus` (StandBy/Clearing/Paused/GotoChargeBase/Charging/ChargeDone/Dormant/InTrouble/InRemoteControl/InDustCollecting), `onlineStatus`, `battery`

### Hub 2
`temperature`, `humidity`, `lightLevel`

### Water Detector
`status` (0=no leak, 1=leak), `battery`

## Scenes API

```
GET /scenes → [{ sceneId, sceneName }]
POST /scenes/{sceneId}/execute → (no body needed)
```

## Webhook

### Setup
```json
POST /webhook/setupWebhook
{ "action": "setupWebhook", "url": "https://...", "deviceList": "ALL" }
```

### Webhook Payload
```json
{
    "eventType": "changeReport",
    "eventVersion": "1",
    "context": {
        "deviceType": "WoHand",
        "deviceMac": "AABBCCDDEEFF",
        "timeOfSample": 1234567890123,
        "power": "on"
    }
}
```

Webhook deviceType identifiers: `WoHand`(Bot), `WoCurtain`(Curtain), `WoPresence`(Motion), `WoContact`(Contact), `WoLock`(Lock), `WoBulb`(Bulb), `WoStrip`(Strip), `WoPlugUS`/`WoPlugJP`(Plug), `WoMeter`(Meter), `WoHub2`(Hub2)

## Chrome Extension Notes
- API calls must be from **service worker** (CORS)
- Use `host_permissions: ["https://api.switch-bot.com/*"]`
- Use `crypto.subtle` for HMAC (not Node.js crypto)
- Use `crypto.randomUUID()` for nonce
- Cache device list to reduce API calls
- IR devices cannot report status → manage state in UI
- Stagger status requests (200ms+) to avoid rate limits
- Service Worker stops when idle → persist all state to chrome.storage
