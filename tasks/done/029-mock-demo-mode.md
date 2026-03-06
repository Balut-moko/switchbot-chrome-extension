---
id: "029"
title: "UI 開発用のモック/デモモードを実装する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-07"
updated: "2026-03-07"
---

# UI 開発用のモック/デモモードを実装する

## Context

現在、UI の表示確認やデバッグには実際の SwitchBot API キーとデバイスが必要で、手元にないデバイスタイプの UI を確認できない。デバイスタイプの網羅（タスク 028）や配色改善（タスク 027）等の UI 改善タスクを効率的に進めるため、API キーなしでも全デバイスタイプのサンプルデータを表示できるモック/デモモードが必要。

データフローは `SwitchBotAPI → Background SW → chrome.storage → messaging → React hooks → UI` の構成で、Background SW のメッセージハンドラ層でモックデータを注入するのが最も効率的。

## Requirements

- Background SW の `getDevices` / `getDeviceStatus` ハンドラにモックモード分岐を追加する
- モックモードの有効化は `wxt.config.ts` の環境変数（`MOCK_MODE`）で制御する
  - `bun run dev` 時に `MOCK_MODE=true` で起動できるようにする
  - 本番ビルド（`bun run build`）では常に無効
- モックデータファイル `src/lib/mock-data.ts` を作成し、以下のサンプルデバイスを含める:
  - Bot（press/switch 両モード）
  - Plug Mini
  - Color Bulb / Strip Light
  - Meter / Meter Pro (CO2)
  - Motion Sensor / Contact Sensor
  - Hub 2（温湿度センサー付き）
  - Curtain / Blind Tilt
  - Smart Lock
  - IR: Air Conditioner / TV / Light / Fan
  - その他未対応カテゴリの代表（Humidifier、Robot Vacuum 等）
- 各デバイスに対応するモックステータスデータを含める
- モックモード中は `sendCommand` がログ出力のみで成功レスポンスを返す
- モックモード中は認証チェック（`isAuthenticated`）をバイパスする
- モックモード中であることを Popup UI 上に表示する（例: ヘッダーに「Demo Mode」バッジ）

## Affected Files

- `wxt.config.ts` — `MOCK_MODE` 環境変数の定義
- `src/lib/mock-data.ts` — 新規: モックデバイス・ステータスデータ
- `src/entrypoints/background.ts` — `getDevices` / `getDeviceStatus` / `sendCommand` / `isAuthenticated` のモック分岐
- `src/components/DeviceList.tsx` — モックモードバッジの表示
- `package.json` — `dev:mock` スクリプトの追加（任意）

## Acceptance Criteria

- [x] `MOCK_MODE=true` で起動すると API キーなしでデバイス一覧が表示される
- [x] 全カテゴリ（bot, switch, light, sensor, curtain, lock, ac, tv）のサンプルデバイスが表示される
- [x] 各デバイスのステータスが正しくモック表示される
- [x] コマンド送信がエラーなく（ログ出力のみで）成功する
- [x] Popup に「Demo Mode」バッジが表示される
- [x] `bun run build`（本番）ではモックモードが無効でビルド成功する
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- モックデータは開発専用のため、tree-shaking でプロダクションバンドルに含まれないようにする（動的 import 推奨）
- 将来的に Options ページからモックモードを切り替えられるようにする拡張も検討可能だが、本タスクでは環境変数制御のみ
