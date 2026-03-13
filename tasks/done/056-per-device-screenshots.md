---
id: "056"
title: "デバイスごとのスクリーンショットをライト/ダークモードで撮影する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-13"
updated: "2026-03-13"
---

# デバイスごとのスクリーンショットをライト/ダークモードで撮影する

## Context

現在の `tests/e2e/screenshots.spec.ts` はストア掲載用の2枚（Popup デバイス一覧 + Settings 画面）のみ撮影しており、ライトモードのみ。UI の変更があった際にデバイスごとの見た目を確認・記録する仕組みがない。

デバイスカテゴリごと × テーマ（light/dark）のスクリーンショットを自動撮影し、UI 変更時に差分を確認できるようにする。

## Requirements

- 全モックデバイス（`src/lib/mock-data.ts` の `MOCK_DEVICES`）のカード単体スクリーンショットをライト/ダーク両モードで撮影する
- デバイス一覧（Popup）と Settings 画面のスクリーンショットもライト/ダーク両モードで撮影する
- テーマ切り替えは `page.evaluate()` で `document.documentElement.classList` を操作して行う
- 出力先は `tests/e2e/screenshots/light/` と `tests/e2e/screenshots/dark/`
- `tests/e2e/screenshots/` は `.gitignore` に追加する（生成物のため）
- `store-assets/` の既存スクリーンショットはそのまま維持する
- デバイスカードには `data-testid="device-card-{deviceId}"` を追加し、Playwright で確実にロケートできるようにする

## Affected Files

- `tests/e2e/screenshots.spec.ts` — テーマ切り替えヘルパー追加、デバイスごとの撮影テスト追加、出力先を `tests/e2e/screenshots/` に変更
- `src/components/DeviceCard.tsx` — ルート要素に `data-testid="device-card-{deviceId}"` を追加
- `.gitignore` — `tests/e2e/screenshots/` を追加

## Acceptance Criteria

- [x] 全モックデバイス（19種）のカード単体スクリーンショットがライト/ダーク両モードで撮影される
- [x] デバイス一覧と Settings のスクリーンショットがライト/ダーク両モードで撮影される
- [x] `bun run test:e2e:screenshots` で `tests/e2e/screenshots/` に全スクリーンショットが自動生成される
- [x] `tests/e2e/screenshots/` が `.gitignore` に含まれている
- [x] DeviceCard に `data-testid` が付与されている
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- 撮影対象デバイス一覧（mock-data.ts より）:
  - Bot (Press) / Bot (Switch) → `BotControl`
  - Plug Mini → `SwitchControl`
  - Color Bulb / Strip Light → `LightControl`
  - Meter / Meter Pro (CO2) → `SensorDisplay`
  - Motion Sensor / Contact Sensor → `SensorDisplay`
  - Hub 2 → `SensorDisplay`
  - Curtain / Blind Tilt → `CurtainControl`
  - Smart Lock → `LockControl`
  - Humidifier / Robot Vacuum → `FallbackControl`
  - IR: AC → `ACControl`
  - IR: TV → `TVControl`
  - IR: Light / IR: Fan → `IRRemoteControl`
- `element.screenshot()` でカード単体を撮影する際、スクロールで画面外にあるカードも対象とする
