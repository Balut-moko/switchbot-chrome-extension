---
id: "050"
title: "バージョンアップ時のチェンジログ更新手順をドキュメント化する"
status: "in_progress"
priority: "low"
depends_on: []
created: "2026-03-09"
updated: "2026-03-09"
---

# バージョンアップ時のチェンジログ更新手順をドキュメント化する

## Context

バージョンバンプ時に `src/data/changelog.ts` を手動で更新しているが、手順が明文化されていないため更新を忘れるリスクがある。CLAUDE.md の Versioning セクションに手順を追記するか、専用スキルを作成して、バージョンバンプ時にチェンジログの更新漏れを防ぐ。

## Requirements

- バージョンバンプ時に `src/data/changelog.ts` に新エントリを追加する手順を明文化する
- エントリのフォーマット（version, date, changes の ja/en 両方）を記載する
- CLAUDE.md の Versioning セクションに手順を追記する、またはバージョンバンプ用スキルを作成する
- 既存の `changelog.ts` の `ChangelogEntry` 型に準拠すること

## Affected Files

- `CLAUDE.md` — Versioning セクションにチェンジログ更新手順を追記
- または `.claude/skills/` — バージョンバンプスキルを新規作成
- 参考: `src/data/changelog.ts` — 既存のチェンジログデータ構造

## Acceptance Criteria

- [ ] バージョンバンプ時にチェンジログを更新する手順が明文化されている
- [ ] `ChangelogEntry` のフォーマット（version, date, ja/en changes）が記載されている
- [ ] `bun run build` が TypeScript エラーなしで成功する
