# Existing SwitchBot Chrome Extensions - Detailed Analysis

## 1. my-switchbot-controler (noripi10)

- **Chrome Web Store**: https://chromewebstore.google.com/detail/my-switchbot-controler/ajhnghbfoleadocfplnfkfnkcbcamehl
- **GitHub**: https://github.com/noripi10/chrome-switchbot-controler
- **License**: MIT
- **Last Update**: 2022年8月 (v1.1.0)

### Tech Stack
- Vite + React 18 + TypeScript (95.8%)
- Chakra UI + Emotion (CSS-in-JS)
- date-fns (日付差分計算のみ)
- framer-motion (Chakra 依存)
- react-icons
- chrome-extension-boilerplate-react-vite ベース

### Architecture
```
src/
├── manifest.ts              # MV3 manifest (プログラム的に生成)
├── libs/
│   ├── constants.ts         # ストレージキー、メッセージタイプ
│   ├── day.ts               # date-fns ユーティリティ
│   └── storage.ts           # chrome.storage.local ラッパー
├── components/
│   ├── layout/
│   │   ├── PopUpHeader.tsx  # ヘッダー + ダークモード
│   │   └── PopUpMain.tsx    # トークンゲート
│   └── parts/
│       ├── SwitchBotItem.tsx # デバイスカード (ON/OFF)
│       ├── SwitchBotList.tsx # デバイスリスト + キャッシュ
│       ├── TokenInputForm.tsx
│       ├── EditModal.tsx
│       └── ReloadButton.tsx
└── pages/
    ├── background/
    │   ├── index.ts         # Service Worker (メッセージリスナー)
    │   └── fetcher.ts       # SwitchBot API クライアント
    ├── popup/               # React エントリー
    ├── options/             # 未実装 (placeholder)
    └── content/             # 不要な content script
```

### API Implementation
- **API v1.0** を使用（`https://api.switch-bot.com/v1.0/devices`）
- 認証: `Authorization` ヘッダーに生トークンのみ（HMAC-SHA256 なし）
- **v1.0 は deprecated** → 現在動作しない可能性が高い

### Data Flow
1. Popup → `chrome.runtime.sendMessage({ type, token })` → Service Worker
2. Service Worker → `fetch()` → SwitchBot API
3. レスポンス → `sendResponse(callback)` → Popup で状態更新

### Caching
- デバイスリスト: `chrome.storage.local` に保存
- TTL: 1分間（`differenceInMinutes` で判定）
- キー: `MY_SWITC_BOT_DEVICES`, `DEVICE_INFO_LAST_GET_TIME`

### Problems & Anti-patterns

#### Critical
1. **API v1.0 使用** → deprecated、HMAC-SHA256 未対応で動作しない
2. **トークン平文保存** → `chrome.storage.local` に暗号化なし
3. **トークンがメッセージに含まれる** → storage から直接読むべき
4. **Content script が全ページに注入** (`<all_urls>`) → 不要・攻撃面拡大
5. **web_accessible_resources が `*://*/*`** → フィンガープリント可能

#### Code Quality
6. **N+1 API コール** → デバイスリスト取得後、各デバイスの status を個別に取得
7. **`flushSync` の誤用** → async コールバック内で不要な同期レンダリング
8. **module-level `isFirst` フラグ** → React 18 StrictMode 対策だが脆弱
9. **`Object.keys(item)` のバグ** → 常に truthy（`.length` チェック漏れ）
10. **エラーハンドリング不在** → HTTP ステータス未チェック、ネットワークエラー未処理
11. **Options ページ未実装** → ビルドエントリーにも未含
12. **ファイル名タイポ多数** → `EditBotton.tsx`, `MY_SWITC_BOT_*`, `"Deviece"`

---

## 2. SwitchBot Dashboard (UDteach / kdevelopk)

- **GitHub**: https://github.com/UDteach/SwitchBotChromeExtension
- **Qiita**: https://qiita.com/kdevelopk/items/b0fc96a099f19ecb8799
- **License**: MIT
- **Last Update**: 2025年12月
- **Status**: Beta版（ストア未公開）

### Tech Stack
- バニラ HTML + CSS + JavaScript（フレームワークなし）
- ビルドステップなし（トランスパイルなし）
- TypeScript なし

### Architecture
```
extension/
├── manifest.json     # MV3 manifest
├── index.html        # 新規タブ置換ページ
├── script.js         # 全ロジック (~750行)
├── style.css         # 全スタイル (~750行)
└── wallpaper.js      # ランダム壁紙
```

- **Background service worker なし** → 全ロジックが新規タブページで実行
- **新規タブ置換型** → `chrome_url_overrides.newtab`
- 単一ファイル monolithic アーキテクチャ

### API Implementation (v1.1)
- **HMAC-SHA256 認証を正しく実装**
- `crypto.subtle.importKey()` → `crypto.subtle.sign()` → `btoa()` で base64
- Headers: `Authorization`, `sign`, `nonce`, `t`

```javascript
async function generateAuthHeader(token, secret) {
    const t = Date.now();
    const nonce = "requestID" + t;  // 問題: 非ランダム
    const data = token + t + nonce;
    // ... HMAC-SHA256 signing
}
```

### Device Support
30+ デバイスタイプのアイコンマッピングあり。ステータス表示対応:
- Meter/MeterPlus: 温度、湿度、バッテリー
- Hub 2: 温度、湿度、照度
- Plug Mini: ON/OFF、電圧、電流、ワット数
- Bot: ON/OFF、バッテリー
- Light/Bulb: ON/OFF、明るさ、色温度
- Curtain: ポジション%、バッテリー
- Lock: 施錠/解錠、バッテリー、ドア状態
- Motion/Contact Sensor: 検知状態、バッテリー
- Robot Vacuum: 動作状態、バッテリー

### Features
- お気に入り（ピン留め）
- デバイス非表示
- ドラッグ&ドロップでタイル並び替え
- 自動リフレッシュ（デフォルト30秒、スタガードリクエスト200ms間隔）
- 天気ウィジェット（wttr.in）
- カレンダー、メモ帳、ポモドーロタイマー
- システムモニター（CPU/メモリ）
- Glassmorphism UI（backdrop-filter blur）

### Problems & Anti-patterns

#### Critical
1. **CORS proxy でクレデンシャル漏洩** → `corsproxy.io` 経由でトークン送信
2. **Nonce が非ランダム** → `"requestID" + timestamp`（予測可能）
3. **API クレデンシャル平文保存** → `chrome.storage.local` / `localStorage`
4. **HTML injection 可能** → デバイス名が `innerHTML` で直接挿入

#### Architecture
5. **Background service worker なし** → 新規タブが開いていないと全機能停止
6. **Monolithic 単一ファイル** → 750行の script.js にすべて集約
7. **コマンドがトグルなし** → 常に `turnOn` / `press` / `lock` のみ送信
8. **localStorage と chrome.storage の混在** → split-brain ストレージ
9. **HTTP ステータス未チェック** → `response.ok` 確認なし
10. **Console に API レスポンス全体をログ出力**

---

## Comparison Matrix

| Feature | noripi10 | UDteach | Our Plan |
|---------|----------|---------|----------|
| API Version | v1.0 (broken) | v1.1 | v1.1 |
| Auth | Token only | HMAC-SHA256 | HMAC-SHA256 |
| Framework | React + Chakra | Vanilla JS | React + Tailwind |
| TypeScript | Yes | No | Yes |
| Build Tool | Vite | None | WXT (Vite) |
| UI Type | Popup | New Tab | Popup |
| Background SW | Yes | No | Yes |
| Device Commands | ON/OFF only | ON only (no toggle) | Full control |
| Token Security | Plaintext | Plaintext | AES-GCM encrypted |
| Nonce | N/A (v1.0) | Predictable | crypto.randomUUID() |
| Error Handling | Minimal | Minimal | Comprehensive |
| Maintained | No (2022~) | Beta (2025~) | Active |

## Reusable Patterns from Existing Extensions

### From UDteach (recommended reference)
- HMAC-SHA256 signature generation with Web Crypto API (fix nonce)
- Device type → icon mapping (expand coverage)
- Status field rendering per device type
- Staggered API requests to avoid rate limiting
- Glassmorphism CSS variables (adapt for popup size)

### From noripi10 (limited reuse)
- Message passing pattern (Popup ↔ Service Worker)
- Device cache with TTL
- Dark mode toggle with Chakra colorMode
