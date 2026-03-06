---
id: "018"
title: "デバイスの操作不可モードを追加する"
status: "done"
priority: "medium"
phase: 3
depends_on: ["006"]
created: "2026-03-04"
updated: "2026-03-07"
---

# デバイスの操作不可モードを追加する

## Context

タスク 005/006 でデバイスの表示/非表示と並び順は対応済み（006 は未着手）。
しかし「デバイスは見えるが操作はさせたくない」ケースに対応できない。
例: 誤操作防止のためロックや特定のボットの操作を無効化したい場合。

`devicePreferences` に `disabled` フラグを追加し、Options UI で設定、Popup で操作無効化を適用する。

## Requirements

### ストレージスキーマ拡張
- `devicePreferencesItem` の型を `{ visible: boolean; order: number; disabled: boolean }` に拡張
- 既存データとの後方互換: `disabled` が未定義の場合は `false` として扱う

### Options UI（DeviceSettings.tsx）
- 各デバイス行に操作不可トグルを追加（表示/非表示チェックボックスの隣）
- 非表示のデバイスは操作不可の設定をグレーアウト（非表示なら操作不可は無意味）

### Popup UI
- `disabled: true` のデバイスはコントロールを無効化（グレーアウト表示）
- デバイス名やステータスは通常表示する（見えるが操作できない状態）
- 各コントロールコンポーネント（`SwitchControl`, `LightControl`, `CurtainControl` 等）に `disabled` prop を伝播

## Affected Files

- `src/lib/storage.ts` — `devicePreferencesItem` の型に `disabled` を追加
- `src/components/options/DeviceSettings.tsx` — 操作不可トグル UI を追加
- `src/components/DeviceCard.tsx` — `disabled` prop を受け取りコントロールに伝播
- `src/components/DeviceList.tsx` — preferences から `disabled` を読み取り DeviceCard に渡す
- `src/components/controls/*.tsx` — 各コントロールに `disabled` prop を追加しボタン等を無効化

## Acceptance Criteria

- [x] Options で各デバイスの操作不可を切り替えられる
- [x] 操作不可に設定したデバイスが Popup で表示されるが操作ボタンが無効化される
- [x] 非表示設定のデバイスは操作不可の設定が無効になる
- [x] 既存の `devicePreferences` データ（`disabled` 未定義）で正常動作する
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- タスク 006（Popup での表示設定適用）が前提。006 で preferences を Popup に反映する基盤ができた上で `disabled` を追加する
- `disabled` の視覚表現: `opacity-50 pointer-events-none` またはボタンの `disabled` 属性で対応
