---
id: "013"
title: "Biome と lefthook で開発環境を整備する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-03"
updated: "2026-03-03"
---

# Biome と lefthook で開発環境を整備する

## Context

現在プロジェクトに linter / formatter が未導入で、コードスタイルの一貫性が保証されていない。
Biome（Rust 製の高速 linter + formatter）を導入し、lefthook で pre-commit hook を設定して、
コミット前に自動チェックを行う開発環境を構築する。

## Requirements

### Biome
- `@biomejs/biome` を devDependencies に追加
- `biome.json` をプロジェクトルートに作成
  - TypeScript + React/JSX のルールを有効化
  - インデント: タブ or スペース2（既存コードに合わせる）
  - `node_modules/`, `.wxt/`, `.output/`, `dist/` を除外
- `package.json` にスクリプト追加:
  - `lint`: `biome lint .`
  - `format`: `biome format --write .`
  - `check`: `biome check .`（lint + format 一括チェック）
  - `check:fix`: `biome check --write .`（自動修正）

### lefthook
- `lefthook` を devDependencies に追加
- `lefthook.yml` をプロジェクトルートに作成
  - pre-commit: ステージ済みファイルに対して `biome check` を実行
- `package.json` の `postinstall` に lefthook install を追加（既存の `wxt prepare` と共存）

### その他
- `.editorconfig` を作成（インデント、改行コード、末尾空白の統一）
- 既存コードを Biome で format して統一

## Affected Files

- `package.json` — devDependencies 追加、scripts 追加、postinstall 更新
- `biome.json` — 新規作成（Biome 設定）
- `lefthook.yml` — 新規作成（Git hooks 設定）
- `.editorconfig` — 新規作成
- `src/**/*.{ts,tsx}` — Biome format による自動整形（初回のみ）

## Acceptance Criteria

- [x] `bun run lint` がエラーなしで完了する
- [x] `bun run format` が全ファイルを整形できる
- [x] `bun run check` が lint + format 一括チェックを実行できる
- [x] `git commit` 時に lefthook が pre-commit hook を実行する
- [x] pre-commit hook が lint/format 違反を検出してコミットを阻止できる
- [x] `.editorconfig` が存在する
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- Biome は Tailwind CSS クラスのソート（`useSortedClasses`）もサポートしているので、必要に応じて有効化を検討
- 既存コードの初回 format は差分が大きくなるため、専用コミットで分離する
- WXT が自動生成する `.wxt/` 配下は Biome の対象外にする
