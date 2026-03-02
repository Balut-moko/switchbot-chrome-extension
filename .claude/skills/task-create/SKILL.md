---
name: task-create
description: tasks/ ディレクトリに新しいタスクファイルを作成する
disable-model-invocation: true
---

# タスク作成スキル

`tasks/` ディレクトリに新しいタスクファイルを作成する。

## 手順

1. `tasks/` 内の既存タスクファイルの最大IDを取得する:
   ```bash
   ls tasks/[0-9]*.md 2>/dev/null | sed 's|tasks/||;s|-.*||' | sort -n | tail -1
   ```
   ファイルがない場合は `000` とする。
2. 最大ID + 1 を新しいIDとする（ゼロ埋め3桁）
3. `$ARGUMENTS` を分析して、以下の情報を判断する:
   - タイトル（命令形の短い文）
   - 優先度（`high` / `medium` / `low`）— 指定がなければ `medium`
   - フェーズ（1-5）— 指定がなければ省略可
   - 依存タスク — 指定がなければ空配列
4. タイトルからケバブケースの slug を生成する（2-5語、英語）
5. 以下のテンプレートでタスクファイルを作成する:

```markdown
---
id: "{ID}"
title: "{タイトル}"
status: "todo"
priority: "{priority}"
phase: {phase}
depends_on: [{依存タスクID}]
created: "{今日の日付 YYYY-MM-DD}"
updated: "{今日の日付 YYYY-MM-DD}"
---

# {タイトル}

## Context

{このタスクが必要な背景。$ARGUMENTS の内容と、必要に応じてコードベースを調査して記述する}

## Requirements

{具体的な要件を箇条書きで記述}

## Affected Files

{変更対象のファイルパスと変更内容。コードベースを調査して正確に記述する}

## Acceptance Criteria

- [ ] {検証基準1}
- [ ] {検証基準2}
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

{補足情報。不要なら省略可}
```

6. 作成したファイルの内容をユーザーに表示して確認を求める
7. 確認が取れたら `task: create {id}-{slug}` のメッセージでコミットする

## 引数

`$ARGUMENTS` にはタスクの概要を自由記述で渡す。

例:
- `/task-create Popup のデバイスカードにバッテリー残量を表示する`
- `/task-create high priority: chrome.alarms の定期更新が重複しないようにする depends:002`
- `/task-create phase:3 Options ページにテーマ切り替えを追加`

### 引数の解析ルール

- `high` / `medium` / `low` が含まれていれば priority として解釈
- `phase:N` が含まれていれば phase として解釈
- `depends:001,002` が含まれていれば depends_on として解釈
- 上記以外のテキストはタスクの説明として使用

## タスク内容の充実

Context / Requirements / Affected Files セクションを充実させるために:
- `$ARGUMENTS` の記述が簡潔な場合、関連するソースコードを読んで具体的な変更内容を特定する
- 既存の実装パターンや関連ファイルを調査し、Affected Files を正確に記載する
- Acceptance Criteria は検証可能な具体的な基準にする
