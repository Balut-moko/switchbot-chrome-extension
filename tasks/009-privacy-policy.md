---
id: "009"
title: "プライバシーポリシーを作成する"
status: "todo"
priority: "high"
phase: 5
depends_on: ["001"]
created: "2026-03-03"
updated: "2026-03-03"
---

# プライバシーポリシーを作成する

## Context

Chrome Web Store 公開にはプライバシーポリシーが必須。
この拡張機能は SwitchBot API キーを扱うため、データの取り扱いを明示する必要がある。

## Requirements

- プライバシーポリシーを作成（日本語・英語）
- 以下を明記:
  - 収集するデータ: SwitchBot API トークン・シークレット（ユーザーが入力）
  - データの保存先: ローカルの chrome.storage のみ（外部送信なし）
  - 通信先: SwitchBot API (api.switch-bot.com) のみ
  - 外部サーバーへのデータ送信なし
  - 暗号化オプション（高セキュリティモード）の説明
- GitHub Pages 等で公開可能な形式

## Affected Files

- `privacy-policy.md` — 新規作成（リポジトリルート）

## Acceptance Criteria

- [ ] プライバシーポリシーが作成されている
- [ ] 収集データ、保存方法、通信先が明記されている
- [ ] 日本語版と英語版がある（1ファイル内で両方、または別ファイル）
- [ ] Chrome Web Store の要件を満たしている

## Notes

`docs/chrome-web-store-requirements.md` にストア公開要件の詳細がある。
GitHub リポジトリの README やウェブページとしてホストする想定。
