---
id: "005"
title: "Options ページにデバイス表示設定 UI を追加する"
status: "todo"
priority: "medium"
phase: 3
depends_on: ["001"]
created: "2026-03-03"
updated: "2026-03-03"
---

# Options ページにデバイス表示設定 UI を追加する

## Context

`src/lib/storage.ts` に `devicePreferencesItem` が定義済み（`Record<string, { visible: boolean; order: number }>`）
だが、これを操作する UI がない。ユーザーがデバイスの表示/非表示と並び順を設定できるようにする。

## Requirements

- Options ページに「デバイス表示設定」セクションを追加（接続テストの下）
- API 認証済みの場合、`getDevices` でデバイス一覧を取得して表示
- 各デバイス行: チェックボックス（表示/非表示）+ デバイス名 + 並び替え（上下ボタン）
- 変更は `devicePreferencesItem` に即座に保存
- 未認証時はセクションを非表示またはメッセージ表示

## Affected Files

- `src/entrypoints/options/App.tsx` — 新セクション追加
- `src/components/options/DeviceSettings.tsx` — 新規コンポーネント作成
- `src/lib/storage.ts` — 既存の `devicePreferencesItem` を使用（変更なし）

## Acceptance Criteria

- [ ] Options ページにデバイス一覧が表示される（認証済み時）
- [ ] 各デバイスの表示/非表示を切り替えられる
- [ ] デバイスの並び順を変更できる
- [ ] 設定が `chrome.storage.local` に保存される
- [ ] 未認証時に適切なフォールバック表示がある
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

ドラッグ＆ドロップは外部ライブラリが必要になるので、上下ボタンでのシンプルな実装を推奨。
