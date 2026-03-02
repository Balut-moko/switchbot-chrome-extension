# Chrome Extension Manifest V3 - Technical Constraints

## 1. Service Worker Lifecycle

### Termination Conditions

| 条件 | タイムアウト | 説明 |
|------|------------|------|
| Idle timeout | **30秒** | イベントなし・API呼び出しなしで30秒経過 |
| Single request | **5分** | 単一イベントハンドラの最大実行時間 |
| Fetch timeout | **30秒** | fetch() レスポンス待ち上限 |

### SW を生存させる方法

| 方法 | 挙動 |
|------|------|
| イベント受信 | 30秒タイマーリセット |
| Chrome API 呼び出し | 30秒タイマーリセット |
| `runtime.connect` ポート | メッセージを30秒以内に送信し続ける必要あり |
| WebSocket メッセージ | 送受信で30秒タイマーリセット（Chrome 116+）|

### 長時間処理の waitUntil パターン

```typescript
async function waitUntil(promise: Promise<unknown>): Promise<void> {
  const keepAlive = setInterval(chrome.runtime.getPlatformInfo, 25 * 1000);
  try {
    await promise;
  } finally {
    clearInterval(keepAlive);
  }
}
```

### State Persistence ガイド

| データ | 保存先 | 理由 |
|--------|--------|------|
| API token/secret (標準) | `chrome.storage.local` | ブラウザ再起動後も永続 |
| 暗号化済み API キー | `chrome.storage.local` | ディスクに永続化 |
| 復号済み API キー | `chrome.storage.session` | メモリのみ、ブラウザ終了で消滅 |
| デバイスリストキャッシュ | `chrome.storage.local` | stale-while-revalidate パターン |
| 最終更新タイムスタンプ | `chrome.storage.local` | リフレッシュ判定用 |
| 一時的 UI 状態 | `chrome.storage.session` | SW 再起動に耐える |
| **グローバル変数** | **使用禁止** | SW 停止で消失する |

```typescript
// BAD - SW 停止で消失
let cachedDevices: Device[] = [];

// GOOD - SW 再起動後も利用可能
async function getCachedDevices(): Promise<Device[]> {
  const { devices } = await chrome.storage.local.get('devices');
  return devices ?? [];
}
```

## 2. chrome.storage.session

| Property | session | local |
|----------|---------|-------|
| 保存先 | RAM のみ | ディスク |
| SW 再起動 | 生存 | 生存 |
| ブラウザ再起動 | **消滅** | 生存 |
| 拡張更新 | **消滅** | 生存 |
| 容量 | 10 MB | 10 MB |
| Content Script | デフォルト不可 | デフォルト可 |
| 暗号化 | なし（メモリ上） | なし |

### 高セキュリティモードでの使用パターン

```
暗号化 API キー → chrome.storage.local（ディスク永続、安全）
復号済み API キー → chrome.storage.session（メモリのみ、ブラウザ終了で消滅）
```

1. ブラウザ起動後、ユーザーがマスターパスワードを入力
2. PBKDF2 で鍵導出 → AES-GCM で復号
3. 復号済み値を `chrome.storage.session` にキャッシュ
4. 以降の API 呼び出しは session storage から読み取り
5. ブラウザ終了で復号済みキーが消滅
6. 次回起動時に再度パスワード入力

## 3. chrome.alarms API

### 基本パターン

```typescript
// entrypoints/background.ts の main() 内、トップレベルに登録

const REFRESH_ALARM = 'refresh-device-status';
const REFRESH_INTERVAL_MINUTES = 5;

// リスナーはトップレベルに登録必須
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === REFRESH_ALARM) {
    const devices = await fetchDeviceStatuses();
    await chrome.storage.local.set({ devices, lastRefresh: Date.now() });
  }
});

// SW 起動時にアラーム存在確認
chrome.alarms.get(REFRESH_ALARM).then(alarm => {
  if (!alarm) {
    chrome.alarms.create(REFRESH_ALARM, {
      delayInMinutes: 0.5,
      periodInMinutes: REFRESH_INTERVAL_MINUTES
    });
  }
});
```

### 制限

| Chrome Version | 最小間隔 |
|---------------|----------|
| Chrome 120+ | **30秒** (0.5分) |
| Chrome 116-119 | 1分 |
| 開発版（unpacked）| 制限なし |

- 最大 **500 アラーム** / 拡張
- アラームは SW 停止中も発火（SW を起動して処理）
- ブラウザ再起動後はアラームが消える可能性 → 起動時に必ず存在確認

## 4. Message Passing

### sendMessage vs connect

| | `sendMessage` | `connect` (Ports) |
|---|---|---|
| パターン | ワンショット request/response | 長時間双方向チャネル |
| 用途 | 単発コマンド | リアルタイムストリーム |
| SW 生存 | レスポンスまで（最大5分） | ポート開放中（要30秒以内メッセージ） |
| **推奨** | **SwitchBot の大半の操作** | 必要なし |

### 推奨通信パターン

```typescript
// === Popup 側 ===

// コマンド送信（ワンショット）
const response = await chrome.runtime.sendMessage({
  type: 'DEVICE_COMMAND', deviceId, command: 'turnOn'
});

// データ読み取り（storage 直接、メッセージ不要）
const { devices } = await chrome.storage.local.get('devices');

// リアルタイム更新（storage 変更リスナー）
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.devices) {
    setDevices(changes.devices.newValue);
  }
});
```

```typescript
// === Service Worker 側 ===

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DEVICE_COMMAND') {
    executeCommand(message.deviceId, message.command)
      .then(async (result) => {
        // 結果を storage に書き込み（popup 閉じ対策）
        await chrome.storage.local.set({
          [`lastCommand_${message.deviceId}`]: { result, timestamp: Date.now() }
        });
        sendResponse({ success: true, data: result });
      })
      .catch(async (error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // 非同期レスポンスのためチャネルを維持
  }
});
```

### Popup 閉じ時の挙動

1. メッセージは SW に正常に到達
2. SW はリクエストを正常に処理（API コール実行）
3. レスポンスは消失（popup のメッセージポートが存在しない）
4. **対策**: SW はコマンド結果を常に `chrome.storage.local` に書き込む

## 5. Fetch from Service Worker

- SW から `fetch()` 直接実行可能
- `host_permissions` で CORS 回避（ブラウザが拡張ページを特別扱い）
- Content Script は CORS 制約あり → SW 経由でリレー必須
- デフォルト CSP に `connect-src` なし → fetch 制限なし
- **CSP カスタマイズ不要**（デフォルトで十分）

## 6. MV3 Security Model

- `chrome.storage.local` は拡張 ID ごとに完全隔離
- Web ページからはアクセス不可
- 物理アクセスに対しては Chrome は保護しない → 高セキュリティモードの価値
- デフォルト CSP: `script-src 'self'; object-src 'self';`
- `'unsafe-eval'` は MV3 で使用不可（インストール時エラー）
- 全 JS はバンドル必須（CDN からのリモートコード読み込み不可）

## 7. 必要な Permissions

```json
{
  "permissions": ["storage", "alarms"],
  "host_permissions": ["https://api.switch-bot.com/*"]
}
```

- `storage`: API 認証情報 + デバイスキャッシュ
- `alarms`: 定期デバイスステータス更新
- `host_permissions`: SwitchBot API へのアクセス
