---
id: "037"
title: "APIキー再設定UIを再設定ボタン方式に変更する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-07"
updated: "2026-03-09"
---

# APIキー再設定UIを再設定ボタン方式に変更する

## Context

現在、Options ページの API Settings セクションでは設定済みでも常に ApiKeyForm が表示されている。設定済みの場合はフォームを隠し、「再設定」ボタンを押してからフォームを展開する方式にすることで、誤操作を防ぎ、UIをすっきりさせる。

## Requirements

- 設定済み（`isConfigured === true`）の場合、APIキーフォームを非表示にする
- 代わりに「設定済み」表示と「再設定」ボタンを表示する
- 「再設定」ボタン押下でフォームが展開される
- 未設定（`isConfigured === false`）の場合は従来通りフォームを表示する
- i18n 対応（「再設定」ボタンのラベル等）

## Affected Files

- `src/components/options/ApiKeyForm.tsx` — 設定済み時のボタン表示 / フォーム表示切替ロジック追加
- `src/entrypoints/options/App.tsx` — 必要に応じて状態管理の調整
- `src/utils/i18n.ts` — 「再設定」ボタン等の翻訳キー追加

## Acceptance Criteria

- [x] 設定済みの場合、APIキーフォームが非表示で「設定済み」表示 + 再設定ボタンが表示される
- [x] 再設定ボタン押下でフォームが展開される
- [x] 未設定の場合は従来通りフォームが表示される
- [x] 再設定フォームから保存後、再び設定済み表示に戻る
- [x] `bun run build` が TypeScript エラーなしで成功する
