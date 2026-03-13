---
id: "064"
title: "GitHub リポジトリを作成してプッシュする"
status: "todo"
priority: "high"
phase: 5
depends_on: ["059", "061"]
created: "2026-03-13"
updated: "2026-03-13"
---

# GitHub リポジトリを作成してプッシュする

## Context

git remote が未設定の状態。リポジトリ整理（061）と URL 修正（059）完了後に GitHub リポジトリを作成し、全コミットをプッシュする。プライバシーポリシーの GitHub Pages ホスティング（065）の前提条件。

## Requirements

- `gh repo create` で GitHub リポジトリを作成する（public）
- リモートを追加して全コミットをプッシュする
- リポジトリが正しくアクセス可能であることを確認する
- CI パイプライン（063）が正常に実行されることを確認する

## Affected Files

- なし（git 設定のみ）

## Acceptance Criteria

- [ ] `git remote -v` で有効な GitHub リモートが表示される
- [ ] 全コミットが GitHub にプッシュされている
- [ ] リポジトリが Web ブラウザからアクセス可能
- [ ] GitHub Actions CI が正常に実行される
