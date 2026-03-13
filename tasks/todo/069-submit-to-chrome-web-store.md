---
id: "069"
title: "Chrome Web Store 開発者アカウント登録とストア提出を行う"
status: "todo"
priority: "high"
phase: 5
depends_on: ["065", "066", "067", "068"]
created: "2026-03-13"
updated: "2026-03-13"
---

# Chrome Web Store 開発者アカウント登録とストア提出を行う

## Context

すべての準備タスク完了後の最終ステップ。プライバシーポリシーのホスティング（065）、プロモ画像（066）、ビルド検証（067）、バージョンバンプ（068）がすべて完了している前提で、Chrome Web Store に提出する。

## Requirements

- **開発者アカウント登録**（未登録の場合）:
  - $5 USD の登録料を支払う
  - 2段階認証（2FA）を有効にする
- **zip ファイルのアップロード**: `bun run zip` で生成した最新の zip
- **ストアリスティング情報の入力**:
  - Name: "SwitchBot Controller (Unofficial)"
  - Short description: `store-assets/listing.md` の Short Description（109文字）
  - Detailed description: `store-assets/listing.md` の Detailed Description
  - Category: Productivity
  - Language: English
- **アセットのアップロード**:
  - Screenshots（`store-assets/screenshot-popup.png`, `screenshot-settings.png`）
  - Small promo tile 440x280（`store-assets/promo-small-440x280.png`）
- **権限の正当性説明**: `store-assets/listing.md` の Permission Justifications を入力
- **Single Purpose Description**: `store-assets/listing.md` の内容を入力
- **Privacy Policy URL**: タスク 065 で取得した HTTPS URL を設定
- **Privacy Practices タブ**: データ使用開示を入力
- **提出**

## Affected Files

- なし（すべて Chrome Web Store ダッシュボード上での操作）

## Acceptance Criteria

- [ ] Chrome Web Store 開発者アカウントが有効である
- [ ] 拡張機能が提出され "Pending review" ステータスである
- [ ] すべての必須フィールドがバリデーションエラーなしで入力されている

## Notes

- 審査期間は初回提出で2〜5営業日（最小権限の場合）
- リジェクト時はリジェクトコード付きメールを確認し、修正後に再提出
- このタスクはすべて Chrome Web Store ダッシュボード上で手動実施
