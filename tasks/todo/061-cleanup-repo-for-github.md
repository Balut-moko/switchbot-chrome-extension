---
id: "061"
title: "GitHub 公開に向けてリポジトリを整理する"
status: "todo"
priority: "high"
phase: 5
depends_on: []
created: "2026-03-13"
updated: "2026-03-13"
---

# GitHub 公開に向けてリポジトリを整理する

## Context

リポジトリを GitHub に公開する前に、公開リポジトリとして適切な状態にする必要がある。README.md と LICENSE が未作成であり、Claude Code 固有のファイル（CLAUDE.md, .claude/skills/, tasks/）は開発ワークフロー専用のため git 追跡から除外する。

## Requirements

- **README.md を作成**:
  - プロジェクト概要（SwitchBot Chrome Extension の説明）
  - 機能一覧（対応デバイス、主要機能）
  - インストール手順（ストアからのインストール + 開発者向けビルド手順）
  - SwitchBot API トークン取得方法
  - セキュリティ・プライバシーの説明（Standard / High Security モード）
  - ライセンス参照
- **LICENSE ファイルを追加**: GPL-3.0
- **.claude/skills/ を git から除外**:
  - `git rm --cached .claude/skills/task-create/SKILL.md .claude/skills/task-impl/SKILL.md`
  - `.gitignore` に `.claude/skills/` を追加
- **tasks/ を git から除外**:
  - `git rm --cached -r tasks/` で追跡停止
  - `.gitignore` に `tasks/` を追加（ローカルには残る）
- **CLAUDE.md を git から除外**:
  - `git rm --cached CLAUDE.md` で追跡停止
  - `.gitignore` に `CLAUDE.md` を追加（ローカルには残る）

## Affected Files

- `README.md` — 新規作成
- `LICENSE` — GPL-3.0 テキストで新規作成
- `.gitignore` — `.claude/skills/`, `tasks/`, `CLAUDE.md` を追加
- `.claude/skills/task-create/SKILL.md` — git tracking 除外
- `.claude/skills/task-impl/SKILL.md` — git tracking 除外
- `tasks/` — git tracking 除外（ディレクトリ全体）
- `CLAUDE.md` — git tracking 除外

## Acceptance Criteria

- [ ] README.md が存在し、プロジェクト概要・機能・インストール手順・セキュリティ説明を含む
- [ ] LICENSE ファイルが GPL-3.0 の全文を含む
- [ ] `git ls-files` に `.claude/skills/`, `tasks/`, `CLAUDE.md` が含まれない
- [ ] `.gitignore` に上記3項目が追加されている
- [ ] `bun run build` が TypeScript エラーなしで成功する
