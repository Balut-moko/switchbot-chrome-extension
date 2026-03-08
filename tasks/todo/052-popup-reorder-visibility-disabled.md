---
id: "052"
title: "ポップアップの並び替えモードでカードの非表示・操作不可を変更できるようにする"
status: "todo"
priority: "medium"
depends_on: []
created: "2026-03-09"
updated: "2026-03-09"
---

# ポップアップの並び替えモードでカードの非表示・操作不可を変更できるようにする

## Context

現在、デバイスの非表示（visible）と操作不可（disabled）の設定は、設定画面（`DeviceSettings.tsx`）でのみ変更可能。ポップアップの並び替えモードでもこれらを変更できるようにすることで、ユーザーが設定画面を開かずにポップアップ内で完結して管理できるようになる。

現状の実装:
- `DeviceSettings.tsx` でチェックボックス（visible）とロックアイコン（disabled）で切り替え
- `DevicePreferences` の型: `Record<string, { visible: boolean; order: number; disabled?: boolean }>`
- ポップアップの並び替えモードではドラッグ&ドロップによる順序変更のみ可能
- 非表示デバイスはポップアップに表示されないため、並び替えモードでも見えない

## Requirements

- 並び替えモード中に各カードに非表示トグルと操作不可トグルを表示する
- 並び替えモード中は非表示設定のデバイスも表示する（半透明等で区別）
- トグル操作は `devicePreferencesItem` を通じて即座に保存する
- 通常モードに戻ったとき、非表示デバイスは再び非表示になる
- ドラッグハンドルとトグルボタンが干渉しないレイアウトにする

## Affected Files

- `src/components/DeviceList.tsx` — 並び替えモード中に非表示デバイスも表示するロジック追加
- `src/components/DeviceCard.tsx` — 並び替えモード中のトグルUI追加
- `src/hooks/useDeviceReordering.ts` — 非表示デバイスを含む並び替えロジック
- `src/hooks/useDeviceFiltering.ts` — 並び替えモード中のフィルタリング挙動変更

## Acceptance Criteria

- [ ] 並び替えモード中に各カードの非表示トグルが表示され、切り替えできる
- [ ] 並び替えモード中に各カードの操作不可トグルが表示され、切り替えできる
- [ ] 並び替えモード中に非表示設定のデバイスが視覚的に区別されて表示される
- [ ] 通常モードに戻ると非表示デバイスが非表示になる
- [ ] トグル変更が `chrome.storage.local` に即座に保存される
- [ ] ドラッグ&ドロップと各トグルが干渉しない
- [ ] `bun run build` が TypeScript エラーなしで成功する
