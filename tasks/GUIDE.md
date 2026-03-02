# Task Management Guide

このディレクトリはプロジェクトのタスクトラッカー。各 `.md` ファイル（この GUIDE.md を除く）が1つのタスクを表す。

## 構造

各タスクファイルは YAML frontmatter + markdown 本体:

| フィールド | 型 | 値 | 用途 |
|-----------|----|----|------|
| `id` | string | `"001"` ~ `"999"` | ゼロ埋め3桁。ファイル名プレフィックスと一致 |
| `title` | string | 短い命令形 | タスクの要約 |
| `status` | string | `"todo"` / `"in_progress"` / `"done"` / `"blocked"` | 現在の状態 |
| `priority` | string | `"high"` / `"medium"` / `"low"` | 優先度 |
| `phase` | number | `1` ~ `5` | CHROME_EXTENSION_MIGRATION_PLAN.md のフェーズに対応 |
| `depends_on` | string[] | `["001", "005"]` | 先に `"done"` になる必要があるタスクID |
| `created` | string | ISO date | 作成日 |
| `updated` | string | ISO date | 最終更新日 |

## ファイル命名規則

```
{id}-{slug}.md
```

例: `003-device-preferences-ui.md`

- `id`: ゼロ埋め3桁の連番（作成順）
- `slug`: ケバブケースの2-5語の要約

## ステータス

| Status | 意味 |
|--------|------|
| `todo` | 未着手 |
| `in_progress` | 作業中 |
| `done` | 完了。Acceptance Criteria をすべて満たした |
| `blocked` | 進行不可。Notes セクションに理由を記載 |

## ワークフロー

### タスクを探す

1. todo タスクを一覧: `grep -l 'status: "todo"' tasks/[0-9]*.md`
2. 各タスクの `depends_on` のIDがすべて `status: "done"` か確認
3. 対象の中で priority が最も高い（high > medium > low）、同優先度ならIDが最小のものを選択

### タスクを完了する

1. Acceptance Criteria がすべて満たされていることを確認
2. `status` → `"done"` に変更
3. Acceptance Criteria のチェックボックスをすべて `- [x]` に変更
4. `updated` を更新
5. コミット: `task: complete {id}-{slug}`

### タスクを新規作成する

1. `tasks/` 内の最大IDを確認して +1
2. 下記テンプレートでファイル作成
3. コミット: `task: create {id}-{slug}`

### タスクをブロックする

1. `status` → `"blocked"` に変更
2. Notes セクションにブロック理由を追記
3. コミット: `task: block {id}-{slug}`

## テンプレート

```markdown
---
id: "{ID}"
title: "{TITLE}"
status: "todo"
priority: "{high|medium|low}"
phase: {1-5}
depends_on: []
created: "{YYYY-MM-DD}"
updated: "{YYYY-MM-DD}"
---

# {TITLE}

## Context

このタスクが必要な背景。

## Requirements

- 具体的な成果物 1
- 具体的な成果物 2

## Affected Files

- `path/to/file.ts` — 変更内容
- `path/to/other.ts` — 変更内容

## Acceptance Criteria

- [ ] 基準 1
- [ ] 基準 2
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

補足情報、検討した代替案、注意点など。
```

## コミットメッセージ規則

タスク管理のコミットには `task:` プレフィックスを使用:

- `task: create 016-fix-status-stagger`
- `task: complete 003-device-preferences-ui`
- `task: block 007-some-task`

実装コミットは通常のプロジェクト規則に従う（`task:` プレフィックスなし）。

## ワークツリー並列作業

Agent tool の `isolation: "worktree"` を使い、複数タスクを並列実行する。

### 並列実行フロー

1. **タスク選定**: 依存が解決済みの todo タスクを複数選ぶ
2. **Agent 起動**: 各タスクに対して `isolation: "worktree"` で Agent を並列起動
   - Agent はタスクファイルの内容に従って実装・コミットする
   - 各 Agent は独立した worktree（リポジトリのコピー）で作業するため競合しない
3. **マージ**: Agent 完了後、返されたブランチを main にマージ
4. **タスク完了**: `status` を `"done"` に更新してコミット

### 注意事項

- 各 worktree は独立した作業コピーのため `bun install` が必要（Agent に指示すること）
- `.output/`, `.wxt/`, `dist/` は `.gitignore` 対象 → worktree ごとに独立ビルド
- 同じファイルを変更するタスク（例: 002, 003, 004 → `background.ts`）はマージ時に競合する可能性がある
  - 競合リスクが高いタスクは順次実行を検討する
