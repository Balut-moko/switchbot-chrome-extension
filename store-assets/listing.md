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

### Changelog

**1.2.0** (2026-05-29)
- Explicit font stack for unified Japanese rendering across macOS / Windows / Linux

**1.1.0** (2026-03-29)
- Added Japanese localization for the extension name and description in Chrome Web Store

**1.0.0** (2026-03-21)
- Initial release: control physical SwitchBot devices and IR remotes, high-security mode, dark mode, Japanese / English localization, device reorder and search, automatic status refresh

### Disclaimer

This is an unofficial, third-party extension. Not affiliated with SwitchBot or Wonderlabs Inc.

## Detailed Description — Japanese (日本語)

ブラウザから SwitchBot スマートホームデバイスを操作・監視できる拡張機能です。SwitchBot Controller は、SwitchBot API v1.1 を利用して、ツールバーのポップアップから物理デバイスや IR リモコンを操作できます。

### 対応デバイス

**物理デバイス** — 操作とリアルタイムステータス表示:
- ボット（スイッチ押下）
- プラグ / プラグミニ
- カーテン / カーテン3 / ブラインドチルト / ローラーシェード
- スマートロック / スマートロック Pro
- カラー電球 / テープライト / シーリングライト
- 温湿度計 / 温湿度計プラス / Hub 2（温度・湿度）
- 人感センサー / 開閉センサー

**IR リモコンデバイス** — SwitchBot ハブ経由でコマンド送信:
- エアコン（温度・モード・風量の制御）
- テレビ / IPTV / セットトップボックス
- 照明 / DIY ライト
- 扇風機
- その他の学習済み IR リモコン

### 主な機能

- ブラウザのツールバーポップアップからワンクリックでデバイス操作
- 物理デバイスのリアルタイムステータス監視（電源、温度、湿度、バッテリー、施錠状態、カーテン位置など）
- エアコンのフルコントロール: 温度（16〜30℃）、モード（自動 / 冷房 / 除湿 / 送風 / 暖房）、風量（自動 / 弱 / 中 / 強）
- chrome.alarms による5分間隔の自動ステータス更新
- ローカルデバイスキャッシュによるポップアップの即時表示
- API 認証情報の接続テスト

### セキュリティとプライバシー

API 認証情報はローカルに保存され、公式 SwitchBot API との通信以外でブラウザ外に送信されることはありません。

**通常モード** — 認証情報は chrome.storage.local にそのまま保存されます。

**高セキュリティモード** — マスターパスワードを使用し、PBKDF2（600,000回反復）による鍵導出と AES-GCM 暗号化で認証情報を暗号化します。復号された認証情報は chrome.storage.session にのみ保持され、ブラウザを閉じると消去されます。

- https://api.switch-bot.com（SwitchBot API v1.1）とのみ通信
- テレメトリ、アナリティクス、トラッキングなし
- 開発者や第三者へのデータ収集・共有なし
- 完全オープンソース

### セットアップ

1. 拡張機能をインストール
2. ツールバーアイコンをクリックし、SwitchBot API トークンとシークレットキーを入力（SwitchBot アプリの 設定 > 開発者向けオプション から取得）
3. 通常モードまたは高セキュリティモードを選択
4. デバイスが自動的に表示されます

### 更新履歴

**1.2.0**（2026-05-29）
- フォントスタックを明示し、macOS / Windows / Linux 間で日本語表示を統一

**1.1.0**（2026-03-29）
- Chrome Web Store での拡張機能名・説明の日本語表示に対応

**1.0.0**（2026-03-21）
- 初回リリース: SwitchBot 物理デバイス・IR リモコンの操作、高セキュリティモード、ダークモード、日本語 / 英語切り替え、デバイス並び替え・検索、ステータス自動更新

### 免責事項

本拡張機能は非公式のサードパーティ製です。SwitchBot および Wonderlabs Inc. とは提携していません。

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

## URLs

| Field | URL |
|-------|-----|
| Homepage URL | https://github.com/Balut-moko/switchbot-chrome-extension |
| Support URL | https://github.com/Balut-moko/switchbot-chrome-extension/issues |

## Privacy Practices

Responses for the Chrome Web Store "Privacy Practices" tab.

| Question | Answer |
|----------|--------|
| Does your extension collect or use personal data? | Yes |
| Data type: Authentication info | Yes — SwitchBot API Token and Secret Key (user-provided) |
| Data type: Personally identifiable info | No |
| Data type: Health info | No |
| Data type: Financial info | No |
| Data type: Location | No |
| Data type: Web history | No |
| Data type: User activity | No |
| Data type: Website content | No |
| Is this data transmitted off the device? | Yes — to api.switch-bot.com only (for API authentication) |
| Is this data used for purposes unrelated to the extension? | No |
| Is this data sold to third parties? | No |
| Is this data transferred for creditworthiness or lending? | No |

## Reviewer Testing Instructions

The following steps allow a Chrome Web Store reviewer to verify the extension's functionality.

### Prerequisites

1. Install the **SwitchBot** mobile app (iOS / Android) and create an account.
2. In the SwitchBot app, go to **Profile > Preferences > Developer Options**.
3. Tap **Generate** to create an **API Token** and **Secret Key**. Copy both values.

> If you do not have a physical SwitchBot device, you can still verify the credential validation and connection-test flow described below.

### Testing Steps

1. **Install the extension** and click the SwitchBot Controller icon in the Chrome toolbar.
2. On the Settings page, paste the **API Token** and **Secret Key** obtained above.
3. Choose either **Standard** or **High Security** mode (High Security requires setting a master password).
4. Click **Connection Test** — you should see a success message confirming the API credentials are valid.
5. Navigate to the **Devices** tab — your registered SwitchBot devices should appear in a list.
6. For any physical device (e.g., Bot, Plug Mini), tap the device card to view its real-time status (power state, temperature, humidity, battery level, etc.).
7. If an IR remote device is registered (e.g., Air Conditioner), tap its card to verify the command UI is displayed (temperature slider, mode selector, fan speed).
