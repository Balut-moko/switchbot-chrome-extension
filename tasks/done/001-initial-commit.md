---
id: "001"
title: "初回 git commit を作成する"
status: "done"
priority: "high"
phase: 1
depends_on: []
created: "2026-03-03"
updated: "2026-03-03"
---

# 初回 git commit を作成する

## Context

現在すべてのファイルが git untracked 状態。並列セッションで作業するには、
共有のベースラインとなるコミットが必要。

## Requirements

- `.gitignore` に `node_modules/`, `.output/`, `.wxt/`, `dist/` 等を含める
- 既存のソースコード、設定ファイル、ドキュメントをすべてステージング
- 機密情報（`.env` など）がコミットに含まれないことを確認
- 意味のあるコミットメッセージで初回コミットを作成

## Affected Files

- `.gitignore` — 確認・必要に応じて拡充
- 全ソースファイル — ステージング

## Acceptance Criteria

- [ ] `git log` で初回コミットが確認できる
- [ ] `node_modules/`, `.output/`, `.wxt/` がトラッキングされていない
- [ ] `git status` がクリーンな状態を示す

## Notes

このタスクが全ての他タスクの前提条件となる。
