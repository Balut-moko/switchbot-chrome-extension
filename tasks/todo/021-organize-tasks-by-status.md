---
id: "021"
title: "タスクをステータス別にフォルダ分けする"
status: "in_progress"
priority: "low"
depends_on: []
created: "2026-03-06"
updated: "2026-03-07"
---

# タスクをステータス別にフォルダ分けする

## Context

現在 `tasks/` ディレクトリにすべてのタスクファイルがフラットに配置されており、各タスクのステータス（todo / done / blocked）はファイルを開いて frontmatter を確認しないとわからない。タスク数が 20 を超えてきたため、一覧性を改善したい。

## Requirements

- `tasks/` 配下にステータス別のサブディレクトリを作成する:
  - `tasks/todo/` — 未着手タスク
  - `tasks/done/` — 完了済みタスク
  - `tasks/blocked/` — ブロック中タスク（該当があれば）
- 既存タスクファイルを現在のステータスに応じて移動する
- `tasks/GUIDE.md` のワークフロー説明を更新する:
  - ステータス変更時にファイルを該当フォルダに移動する手順を追加
  - `grep` コマンド例をフォルダ構造に合わせて更新
- `CLAUDE.md` の Quick Reference（`grep -l` コマンド例）を更新する
- タスク作成・完了スキル（`.claude/skills/`）のパスを更新する

## Affected Files

- `tasks/*.md` — ステータスに応じてサブディレクトリへ移動
- `tasks/GUIDE.md` — フォルダ構造の説明・ワークフロー手順の更新
- `CLAUDE.md` — Quick Reference のコマンド例更新
- `.claude/skills/task-create/skill.md` — タスク作成先パスの更新
- `.claude/skills/commit-default/skill.md` — 影響確認（変更不要の可能性）

## Acceptance Criteria

- [ ] 完了済みタスクが `tasks/done/` に移動されている
- [ ] 未着手タスクが `tasks/todo/` に配置されている
- [ ] `tasks/GUIDE.md` がフォルダ構造に合わせて更新されている
- [ ] CLAUDE.md の Quick Reference が更新されている
- [ ] タスク関連スキルのパスが正しく更新されている
- [ ] `in_progress` のタスクは `tasks/todo/` に置く（作業中は todo 扱い）

## Notes

- `in_progress` は一時的な状態のため専用フォルダは不要、`todo/` に置く
- ファイル名の `{id}-{slug}.md` 命名規則は維持する
- GUIDE.md はタスクのルートに残す（`tasks/GUIDE.md`）
