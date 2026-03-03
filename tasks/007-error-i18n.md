---
id: "007"
title: "エラーメッセージの日英対応を実装する"
status: "done"
priority: "medium"
phase: 5
depends_on: ["001"]
created: "2026-03-03"
updated: "2026-03-03"
---

# エラーメッセージの日英対応を実装する

## Context

CHROME_EXTENSION_MIGRATION_PLAN.md Phase 5 に「エラーメッセージの日英対応」がある。
現在のコードではエラーメッセージが英語ハードコードされている（例: `api.ts` の `'INVALID_CREDENTIALS'`、
`background.ts` の `'NO_CREDENTIALS'` 等）。

## Requirements

- エラーコードから表示メッセージへのマッピングを作成（日本語・英語）
- `navigator.language` または `chrome.i18n` でロケール判定
- Popup と Options の両方で対応
- 最低限: API エラー、認証エラー、ネットワークエラーのメッセージを対応

## Affected Files

- `src/utils/i18n.ts` — 新規: エラーメッセージマッピング + ロケール判定ユーティリティ
- `src/lib/api.ts` — エラーコードの定数化（既にほぼできている）
- `src/components/` 配下 — エラー表示箇所でマッピングを使用

## Acceptance Criteria

- [x] 日本語ブラウザでエラーメッセージが日本語で表示される
- [x] 英語ブラウザでエラーメッセージが英語で表示される
- [x] API エラー、認証エラー、ネットワークエラーが網羅されている
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

chrome.i18n API（`_locales/` ディレクトリ）を使う方法もあるが、
エラーメッセージだけの対応なら軽量な自前実装で十分。
将来的に UI 全体の i18n が必要になったら `_locales/` に移行を検討。
