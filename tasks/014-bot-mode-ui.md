---
id: "014"
title: "Bot の deviceMode に応じた UI 自動切替"
status: "done"
priority: "medium"
phase: 2
depends_on: []
created: "2026-03-04"
updated: "2026-03-04"
---

# Bot の deviceMode に応じた UI 自動切替

## Context

SwitchBot Bot デバイスには物理的に 2 つの動作モードがある:
- **switchMode（トグルモード）**: アームが位置を保持し、ON/OFF を切り替える
- **pressMode（押すモード）**: アームが押して元に戻る（ボタン押下動作）

現在の UI（`SwitchControl.tsx`）は `turnOn`/`turnOff` のトグル操作のみ対応しており、
Bot のステータスに含まれる `deviceMode` フィールドや、capabilities に定義済みの `press` コマンドが UI に反映されていない。

Bot の `deviceMode` をステータスから取得し、モードに応じた適切な操作 UI を自動表示する。

## Requirements

- Bot デバイスを `switch` カテゴリから分離し、専用の `bot` カテゴリを作成する
- `BotControl` コンポーネントを新規作成し、`deviceMode` に応じた UI を描画する
  - `switchMode`: ON/OFF トグル UI（既存の `SwitchControl` と同様の動作）
  - `pressMode`: 「押す」ボタン UI（`press` コマンドを送信）
  - フォールバック: `deviceMode` が取得できない場合はトグル UI をデフォルト表示
- `BotStatus.deviceMode` の型をユニオンリテラルに強化する

## Affected Files

- `src/utils/device.ts` — `DeviceCategory` に `'bot'` 追加、`SWITCH_TYPES` から `'Bot'` を除外、ソート順追加
- `src/components/controls/BotControl.tsx` — 新規作成（Bot 専用コントロール）
- `src/components/DeviceCard.tsx` — `case 'bot'` ルーティング追加
- `src/types/switchbot.ts` — `BotStatus.deviceMode` の型をリテラルユニオンに変更

## Acceptance Criteria

- [x] Bot デバイスが `pressMode` のとき「押す」ボタンが表示される
- [x] Bot デバイスが `switchMode` のとき ON/OFF トグルが表示される
- [x] `deviceMode` が不明な場合、トグル UI がフォールバック表示される
- [x] Plug デバイスは従来通り `SwitchControl` で動作する
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- SwitchBot Bot には `customizeMode` も存在するが、動作は `pressMode` と同じ（押して戻る）ため、`pressMode` と同じ UI で対応する
- API の `press` コマンドは `parameter: 'default'` で送信する
- Bot のステータス取得は物理デバイスなので `useDeviceStatus` で取得可能（IR デバイスではない）
