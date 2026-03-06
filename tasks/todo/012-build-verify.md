---
id: "012"
title: "ビルド検証と E2E 動作確認を実施する"
status: "todo"
priority: "high"
phase: 5
depends_on: ["002", "003", "005", "006", "007"]
created: "2026-03-03"
updated: "2026-03-03"
---

# ビルド検証と E2E 動作確認を実施する

## Context

全タスク完了後、リリース前にビルドの成功と基本的な動作確認を実施する。

## Requirements

- `bun run build` が警告なしで成功する
- ビルド出力の `manifest.json` に必要な permissions がすべて含まれている
- Chrome に開発者モードで読み込み、以下を確認:
  - Options ページで API キー設定が動作する
  - 接続テストが成功する
  - Popup でデバイス一覧が表示される
  - デバイス操作（トグル等）が動作する
  - 検索フィルタが動作する
  - 高セキュリティモードのロック/アンロックが動作する
- `bun run zip` で配布用 zip が生成される

## Affected Files

- ビルド出力全体の検証（ソース変更は原則なし、問題発見時は修正）

## Acceptance Criteria

- [ ] `bun run build` がエラー・警告なしで成功する
- [ ] `manifest.json` に `storage`, `alarms` パーミッションが含まれている
- [ ] Chrome へのサイドロードが成功する
- [ ] Options ページの全機能が動作する
- [ ] Popup の全機能が動作する
- [ ] 高セキュリティモードが動作する
- [ ] `bun run zip` が成功する

## Notes

このタスクは依存タスクがすべて完了してから実施する。
問題発見時は新規タスクを作成して修正し、再度検証する。
