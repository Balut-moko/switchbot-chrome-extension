---
id: "059"
title: "プライバシーポリシーの GitHub URL プレースホルダーを修正する"
status: "todo"
priority: "high"
phase: 5
depends_on: []
created: "2026-03-13"
updated: "2026-03-13"
---

# プライバシーポリシーの GitHub URL プレースホルダーを修正する

## Context

`privacy-policy.md` の英語・日本語セクションに `https://github.com/placeholder/switchbot-chrome-extension` というプレースホルダー URL が残っている。GitHub リポジトリ公開前に実際の URL に置換する必要がある。

## Requirements

- L82（英語セクション）のプレースホルダー URL を実際のリポジトリ URL に置換する
- L168（日本語セクション）のプレースホルダー URL を実際のリポジトリ URL に置換する
- GitHub ユーザー名をユーザーに確認してから修正する

## Affected Files

- `privacy-policy.md` — プレースホルダー URL を2箇所修正

## Acceptance Criteria

- [ ] `privacy-policy.md` にプレースホルダー URL が残っていない
- [ ] 英語・日本語両方のセクションで正しいリポジトリ URL が設定されている
- [ ] `bun run build` が TypeScript エラーなしで成功する
