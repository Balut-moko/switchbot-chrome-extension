---
id: "060"
title: "Chrome Web Store 要件ドキュメントのステータスを更新する"
status: "todo"
priority: "medium"
phase: 5
depends_on: []
created: "2026-03-13"
updated: "2026-03-13"
---

# Chrome Web Store 要件ドキュメントのステータスを更新する

## Context

`docs/chrome-web-store-requirements.md` の Submission Checklist（Section 2）と Pre-Submission Checklist（Section 12）が古い状態のまま。スクリーンショット「未作成」、Single Purpose Description「未作成」等と記載されているが、タスク 008〜011, 025, 056 で完了済み。公開前に正確な状態に更新する。

## Requirements

- Section 2 のテーブルを更新: アイコン（4サイズ完了）、スクリーンショット（2枚完了）、Single Purpose Description（完了）、Permission Justifications（完了）を OK にする
- Section 12 の Pre-Submission Checklist で完了済み項目をチェックする
- 未完了項目（Small promo image, Privacy Policy ホスティング, 開発者アカウント）を明記する
- バージョン表記を現在の体系に合わせる

## Affected Files

- `docs/chrome-web-store-requirements.md` — Section 2, 12 のステータスマーカー更新

## Acceptance Criteria

- [ ] 完了済み項目がすべて OK/チェック済みになっている
- [ ] 未完了項目が明確に識別できる
- [ ] ドキュメントが現在のプロジェクト状態を正確に反映している
- [ ] `bun run build` が TypeScript エラーなしで成功する
