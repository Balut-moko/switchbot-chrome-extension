---
id: "041"
title: "並び替えボタンをアイコンボタンに変更する"
status: "todo"
priority: "low"
depends_on: []
created: "2026-03-08"
updated: "2026-03-08"
---

# 並び替えボタンをアイコンボタンに変更する

## Context

DeviceListHeader のヘッダーボタン群（テーマ切替・リフレッシュ・検索・設定）はすべてアイコンボタン（`iconBtnClass`）で統一されているが、並び替えボタンだけがテキストボタン（`text-xs px-2 py-1`、i18n テキスト表示）になっており、視覚的に不統一。

## Requirements

- 並び替えボタンを lucide-react のアイコン（`ArrowUpDown` 等）を使用したアイコンボタンに変更する
- 他のヘッダーボタンと同じ `iconBtnClass` スタイルを適用する
- 並び替えモード中はアイコンの色を `text-blue-500` にして活性状態を示す（検索ボタンと同パターン）
- ボタンの `title` 属性に i18n テキスト（`REORDER_MODE` / `REORDER_MODE_DONE`）を表示する
- ダークモードに対応する

## Affected Files

- `src/components/DeviceListHeader.tsx` — 並び替えボタンのマークアップとスタイルを変更、lucide-react アイコンの import 追加

## Acceptance Criteria

- [ ] 並び替えボタンがアイコンボタンとして表示される
- [ ] 他のヘッダーボタンと同じサイズ・スタイルになっている
- [ ] 並び替えモード中はアイコンが青色（`text-blue-500`）で表示される
- [ ] `title` 属性にホバー時のツールチップテキストが表示される
- [ ] ダークモードで正しく表示される
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

- 検索ボタンの活性表示パターン（`searchOpen ? 'text-blue-500 dark:text-blue-400' : ''`）を参考にする
- アイコン候補: `ArrowUpDown`（上下矢印）が並び替えの意味として分かりやすい
