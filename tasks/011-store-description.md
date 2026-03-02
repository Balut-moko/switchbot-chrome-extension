---
id: "011"
title: "Chrome Web Store 掲載用説明文を作成する"
status: "todo"
priority: "low"
phase: 5
depends_on: ["001"]
created: "2026-03-03"
updated: "2026-03-03"
---

# Chrome Web Store 掲載用説明文を作成する

## Context

Chrome Web Store 公開には、拡張機能の概要説明文、詳細説明、カテゴリ選択が必要。

## Requirements

- 短い説明文（132文字以内）: ツールバーから SwitchBot を操作できる旨
- 詳細説明（英語）: 機能一覧、セキュリティ特徴、サポートデバイス
- カテゴリ: "Productivity" or "Utilities"
- Single Purpose を明確に（Chrome Web Store ポリシー準拠）

## Affected Files

- `store-assets/listing.md` — 新規: ストア掲載テキスト

## Acceptance Criteria

- [ ] 短い説明文（132文字以内）が作成されている
- [ ] 詳細説明が機能・セキュリティ・対応デバイスを網羅している
- [ ] Single Purpose ポリシーに準拠した記述になっている

## Notes

`docs/chrome-web-store-requirements.md` に Single Purpose policy の詳細あり。
「SwitchBot デバイスの操作」が Single Purpose。
