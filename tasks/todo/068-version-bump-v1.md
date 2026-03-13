---
id: "068"
title: "バージョンを v1.0.0 にバンプする"
status: "todo"
priority: "medium"
phase: 5
depends_on: ["067"]
created: "2026-03-13"
updated: "2026-03-13"
---

# バージョンを v1.0.0 にバンプする

## Context

現在 v0.23.0-beta。ストア公開を正式リリースとして扱い、beta を外して v1.0.0 にバンプする。最終ビルド検証（067）完了後に実施し、検証で見つかった問題の修正を含めた最終バージョンとする。

## Requirements

- `package.json` の `version` を `"1.0.0"` に更新
- `wxt.config.ts` の `manifest.version_name` を `"1.0.0"` に更新
- `src/data/changelog.ts` の `changelog` 配列の先頭に v1.0.0 エントリを追加
  - ja/en 両方の変更点を記載
  - 主要な変更点: 正式リリース、Chrome Web Store 公開
- コミット: `chore: バージョンを v1.0.0 にバンプ`
- git tag: `v1.0.0`

## Affected Files

- `package.json` — `version: "1.0.0"`
- `wxt.config.ts` — `version_name: "1.0.0"`
- `src/data/changelog.ts` — v1.0.0 チェンジログエントリ追加

## Acceptance Criteria

- [ ] `package.json` の version が `"1.0.0"` である
- [ ] `wxt.config.ts` の version_name が `"1.0.0"` である
- [ ] `src/data/changelog.ts` に v1.0.0 エントリが先頭にある
- [ ] git tag `v1.0.0` が付与されている
- [ ] `bun run build` が TypeScript エラーなしで成功する
