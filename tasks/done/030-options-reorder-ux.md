---
id: "030"
title: "設定画面のデバイス並び替え UX を改善する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-07"
updated: "2026-03-07"
---

# 設定画面のデバイス並び替え UX を改善する

## Context

Options ページの DeviceSettings では ▲/▼ ボタンでデバイスの並び順を変更できるが、1回のクリックで1つずつしか移動できず、デバイス数が多いと操作が煩雑になる。Popup 側にはタスク 020 で `@dnd-kit` によるドラッグ＆ドロップ並び替えが実装されたが、Options ページは旧来の上下ボタン方式のままとなっている。

また現在の並び替え UI は全デバイスがフラットリストで表示され、カテゴリ（Controls / Sensors）の区別がなく見通しが悪い。

## Requirements

- Options ページの DeviceSettings にドラッグ＆ドロップによる並び替えを導入する
  - Popup と同じ `@dnd-kit/core` + `@dnd-kit/sortable` を使用する
- 既存の ▲/▼ ボタンを削除し、ドラッグハンドル（6点ドットアイコン等）に置き換える
- カテゴリ別（Controls / Sensors / IR Devices）のグループ表示を追加する
  - グループ内での並び替えのみ許可（Popup と同じ挙動）
- 各デバイス行の表示をリッチにする:
  - ドラッグハンドル + 表示チェックボックス + アイコン + デバイス名 + デバイスタイプ + 無効化チェックボックス
- ダークモードに対応する
- 並び替え結果は既存の `devicePreferencesItem` に保存し、Popup と同期する

## Affected Files

- `src/components/options/DeviceSettings.tsx` — ドラッグ＆ドロップ化、カテゴリグループ表示、▲/▼ ボタン削除
- `src/utils/device.ts` — `groupDevices` 関数の再利用（Options でのグループ分け）

## Acceptance Criteria

- [x] ドラッグ＆ドロップでデバイスの並び順を変更できる
- [x] ▲/▼ ボタンが削除されている
- [x] デバイスがカテゴリ別にグループ表示されている
- [x] 並び替え結果が Popup に正しく反映される
- [x] ダークモードで正しく表示される
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- `@dnd-kit` は既にタスク 020 で `package.json` に追加済み
- Popup の `SortableDeviceCard`（`DeviceSection.tsx`）のパターンを参考にする
- Options ページは横幅が広いため、Popup より情報量を多く表示できる
