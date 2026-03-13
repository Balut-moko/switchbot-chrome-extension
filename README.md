# SwitchBot Controller (Unofficial)

SwitchBot デバイスをブラウザのツールバーから操作・監視できる Chrome 拡張機能です。

> **Note**: これは非公式のサードパーティ拡張機能です。SwitchBot / Wonderlabs Inc. とは一切関係ありません。

## 機能

### 対応デバイス

**物理デバイス** — リアルタイムのステータス表示と操作:
- Bot（スイッチ押下）
- Plug / Plug Mini
- Curtain / Curtain 3 / Blind Tilt / Roller Shade
- Smart Lock / Smart Lock Pro
- Color Bulb / Strip Light / Ceiling Light
- Meter / Meter Plus / Hub 2（温度・湿度）
- Motion Sensor / Contact Sensor

**IR リモートデバイス** — SwitchBot Hub 経由でコマンド送信:
- エアコン（温度・モード・風量制御）
- テレビ / IPTV / セットトップボックス
- ライト / DIY ライト
- 扇風機
- その他の学習済み IR リモコン

### 主な機能

- ツールバーポップアップからワンクリックでデバイス操作
- 物理デバイスのリアルタイムステータス監視（電源、温度、湿度、バッテリー、施錠状態、カーテン位置など）
- エアコンの完全制御（温度 16-30°C、モード、風量）
- `chrome.alarms` による5分間隔の自動ステータス更新
- ローカルデバイスキャッシュによる高速なポップアップ表示
- ダークモード対応
- 日本語 / 英語 切り替え

## インストール

### Chrome Web Store から（準備中）

公開後、Chrome Web Store からインストールできます。

### 開発者向け

```bash
git clone https://github.com/Balut-moko/switchbot-chrome-extension.git
cd switchbot-chrome-extension
bun install
bun run dev
```

`chrome://extensions` を開き、「デベロッパーモード」を有効にして、`.output/chrome-mv3-dev` フォルダを「パッケージ化されていない拡張機能を読み込む」で追加してください。

## セットアップ

1. SwitchBot アプリを開く
2. **プロフィール** → **設定** → **Developer Options** に移動
3. API Token と Secret Key を取得
4. 拡張機能のツールバーアイコンをクリックし、取得した認証情報を入力

## セキュリティ

API 認証情報はローカルに保存され、公式 SwitchBot API との通信以外でブラウザの外に送信されることはありません。

### Standard モード

認証情報は `chrome.storage.local` にデバイス上で保存されます。

### High Security モード

認証情報はマスターパスワードを使用して暗号化されます:
- **PBKDF2**（600,000 回反復）による鍵導出
- **AES-GCM** による暗号化
- 復号済み認証情報は `chrome.storage.session` にのみ保持され、ブラウザ終了時にクリアされます

### プライバシー

- 通信先は `https://api.switch-bot.com`（SwitchBot API v1.1）のみ
- テレメトリー、アナリティクス、トラッキングなし
- 開発者や第三者へのデータ収集・共有なし

## 技術スタック

- [WXT](https://wxt.dev/) — Vite ベースの拡張機能フレームワーク
- React 18 + TypeScript
- [shadcn/ui](https://ui.shadcn.com/) + Tailwind CSS v3
- SwitchBot API v1.1（HMAC-SHA256 署名、Web Crypto API）

## ライセンス

[GPL-3.0](LICENSE)
