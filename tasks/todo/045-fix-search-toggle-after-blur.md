---
id: "045"
title: "blur 後の検索ボタン押下でトグルが正しく動作しない問題を修正する"
status: "todo"
priority: "medium"
depends_on: []
created: "2026-03-08"
updated: "2026-03-08"
---

# blur 後の検索ボタン押下でトグルが正しく動作しない問題を修正する

## Context

検索フォームが開いている状態で入力欄からフォーカスが外れると `handleSearchBlur` により `searchOpen` が `false` にリセットされる。この直後に検索ボタンをクリックすると、blur イベントで `false` → ボタンの `toggleSearch` で `!false` → `true` となり、検索フォームが閉じずに再び開いてしまう。

ユーザーの期待は「検索フォームが見えている状態で検索ボタンを押したら閉じる」こと。blur とクリックのイベント順序の競合が原因。

## Requirements

- 検索フォームが開いている状態で検索ボタンを押したら、フォームが閉じる
- blur によるフォーム非表示と、ボタンクリックによるトグルが競合しないようにする
- 解決策の候補:
  - blur ハンドラで `relatedTarget` を確認し、検索ボタンへのフォーカス移動時は blur を無視する
  - blur ハンドラを削除し、検索ボタンのトグルのみで開閉を制御する
  - `setTimeout` で blur を遅延させてクリックイベントを先に処理する

## Affected Files

- `src/components/DeviceList.tsx` — `handleSearchBlur` の修正または削除、`toggleSearch` ロジックの調整
- `src/components/SearchBar.tsx` — `onBlur` prop の使用箇所（必要に応じて）

## Acceptance Criteria

- [ ] 検索フォームが開いている状態で検索ボタンを押すとフォームが閉じる
- [ ] 検索フォームが閉じている状態で検索ボタンを押すとフォームが開く
- [ ] 検索フォームからフォーカスが外れた場合の挙動が自然である
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

- `relatedTarget` アプローチが最もクリーン: blur イベントの `relatedTarget` が検索ボタンなら blur を無視し、ボタンの `toggleSearch` に閉じ処理を委ねる
- blur で閉じる機能自体を廃止して、検索ボタンのトグルのみで制御するのも選択肢
