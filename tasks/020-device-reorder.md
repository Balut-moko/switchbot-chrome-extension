---
id: "020"
title: "デバイスを並び替え可能にする"
status: "in_progress"
priority: "medium"
depends_on: []
created: "2026-03-06"
updated: "2026-03-07"
---

# デバイスを並び替え可能にする

## Context

現在 Options ページの DeviceSettings に上下ボタンによる並び替え機能があり、`local:devicePreferences` に `order` フィールドとして保存されている。しかし Popup 側の DeviceList はこの設定を参照せず、カテゴリ→名前順で固定表示している。また Options ページの上下ボタンによる並び替えも直感的ではない。

本タスクでは以下を実現する:
1. Options ページで設定した並び順を Popup に反映する
2. Popup 上でもドラッグ＆ドロップでデバイスを並び替え可能にする

## Requirements

- Popup の DeviceList で `local:devicePreferences` の `order` を参照してデバイスを並べる
- `visible: false` のデバイスは Popup に表示しない
- Popup に「並び替えモード」の切り替えボタンを設置する（誤操作防止）
- 通常時はデバイス操作のみ、並び替えモード中のみドラッグ＆ドロップが有効になる
- 並び替えモード中はデバイス操作（ボタン押下等）を無効化する
- 並び替え結果は `local:devicePreferences` に保存し、Options ページと同期する
- ドラッグ＆ドロップライブラリとして `@dnd-kit/core` + `@dnd-kit/sortable` を導入する
- デバイスグループ（Controls / Sensors）内での並び替えとする
- ドラッグ中の視覚フィードバック（ドラッグハンドル、プレースホルダー等）を提供する
- ダークモードに対応する

## Affected Files

- `src/components/DeviceList.tsx` — `devicePreferences` の `order` / `visible` を反映、ドラッグ＆ドロップの統合
- `src/components/DeviceSection.tsx` — Sortable コンテナの導入
- `src/components/DeviceCard.tsx` — ドラッグハンドルの追加
- `src/utils/device.ts` — `groupDevices` / `sortDevicesByCategory` をプリファレンス順に対応
- `src/hooks/useDevices.ts` — デバイスプリファレンスの読み込み統合（必要に応じて）
- `package.json` — `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` の追加

## Acceptance Criteria

- [ ] Options ページで設定した並び順が Popup に反映される
- [ ] `visible: false` のデバイスが Popup に表示されない
- [ ] 並び替えボタンを押すと並び替えモードに入り、ドラッグ＆ドロップが有効になる
- [ ] 並び替えモード中はデバイス操作が無効化される
- [ ] 並び替えモードを終了すると通常操作に戻る
- [ ] 並び替え結果が `local:devicePreferences` に永続化される
- [ ] Options ページと Popup で並び順が同期している
- [ ] ドラッグ中に視覚フィードバックがある
- [ ] ダークモードで正しく表示される
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

- `@dnd-kit` は React 18/19 対応かつ軽量で、Chrome 拡張の Popup に適している
- 既存の `groupDevices()` はカテゴリ分類ロジックを残しつつ、ソート順をプリファレンスベースに切り替える
- Options ページの上下ボタン UI は既存のまま維持する（将来的にドラッグ化は別タスク）
