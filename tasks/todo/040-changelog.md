---
id: "040"
title: "チェンジログ表示機能を追加する"
status: "todo"
priority: "low"
depends_on: []
created: "2026-03-07"
updated: "2026-03-07"
---

# チェンジログ表示機能を追加する

## Context

リリース後、ユーザーにバージョンごとの変更内容を伝えるためにチェンジログ表示機能が必要。Options ページまたは Popup にバージョン情報とチェンジログを表示する。

## Requirements

- チェンジログデータの管理方法を決定する（JSON/マークダウン等）
- Options ページまたは Popup にチェンジログ表示セクションを追加する
- バージョン番号と変更内容を一覧表示する
- 更新後の初回表示で新しい変更点をハイライトすることを検討する
- i18n 対応（日本語/英語）

## Affected Files

- 新規: チェンジログデータファイル
- 新規: チェンジログ表示コンポーネント
- `src/entrypoints/options/App.tsx` または Popup — チェンジログセクションの追加
- `src/utils/i18n.ts` — 翻訳キー追加

## Acceptance Criteria

- [ ] チェンジログデータが管理可能な形式で保持されている
- [ ] Options ページまたは Popup でチェンジログが閲覧できる
- [ ] バージョン番号と変更内容が正しく表示される
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

- リリース後に着手するタスク
- 具体的な表示場所・UIデザインは実装時に詳細設計する
