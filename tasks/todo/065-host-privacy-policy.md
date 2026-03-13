---
id: "065"
title: "プライバシーポリシーを GitHub Pages でホストする"
status: "todo"
priority: "high"
phase: 5
depends_on: ["064"]
created: "2026-03-13"
updated: "2026-03-13"
---

# プライバシーポリシーを GitHub Pages でホストする

## Context

Chrome Web Store はプライバシーポリシーの HTTPS URL を必須としている。`privacy-policy.md` は作成済みだが、公開 URL でホストされていない。GitHub Pages を使えば無料で HTTPS ホスティングが可能。

## Requirements

- GitHub Pages を有効化する（リポジトリ設定 or `gh` CLI）
- `privacy-policy.md` が HTTPS URL でアクセス可能にする
- 最終的な URL を記録する（ストア提出時に使用）
- 必要に応じて Jekyll 設定（`_config.yml`）やリダイレクトを追加する

## Affected Files

- 必要に応じて `_config.yml` — Jekyll 設定（GitHub Pages 用）
- `privacy-policy.md` の内容自体は変更なし

## Acceptance Criteria

- [ ] プライバシーポリシーが公開 HTTPS URL でアクセス可能
- [ ] 英語・日本語両セクションが正しく表示される
- [ ] URL がストア提出用に記録されている
