---
name: task-impl
description: タスクの選定・並列実装・検証・完了・バージョンバンプを一括実行する
disable-model-invocation: true
---

# タスク実装サイクル

依存解決済みの todo タスクを自動選定し、Agent worktree で並列実装 → 検証 → 完了 → バージョンバンプまでを一括実行する。

## 引数

`$ARGUMENTS` にはタスクIDを0個以上渡す。

- `/task-impl` — 実行可能な全 todo タスクを並列実装
- `/task-impl 022` — タスク 022 のみ実装
- `/task-impl 020 022` — タスク 020 と 022 を並列実装

### 解析ルール

- 数字（先頭の `#` は無視）をタスクIDとして解釈
- ID以外のテキストがあれば実装時の追加コンテキストとして扱う

---

## Phase 1: タスク選定・競合チェック

### 1-1. タスク候補の収集

`$ARGUMENTS` にIDが指定されている場合はそのタスクファイルを読む。

指定がない場合は自動選定:

```bash
grep -l 'status: "todo"' tasks/[0-9]*.md
```

### 1-2. 依存チェック

各候補タスクの `depends_on` 配列を確認する。依存先タスクがすべて `status: "done"` でなければ候補から除外する。

除外したタスクがあればユーザーに報告する。

### 1-3. 競合チェック

残った候補タスクの **Affected Files** セクションからファイルパスを抽出し、同一ファイルを変更するタスク群を検出する。

競合が見つかった場合:
- 競合グループ内で `priority` が最も高い（high > medium > low）ものを残す
- 同優先度ならIDが小さいものを優先
- 除外したタスクとその理由をユーザーに報告する

### 1-4. 実行確認

実行対象タスクの一覧（ID・タイトル・優先度）をユーザーに表示し、実装を開始してよいか確認を求める。

対象タスクが0件の場合は「実行可能なタスクがありません」と報告して終了する。

---

## Phase 2: 並列実装

各タスクに対して **Agent tool** を `isolation: "worktree"` で**並列起動**する。

1つのメッセージで複数の Agent tool を呼び出し、同時に起動すること。

### 各 Agent への指示テンプレート

```
以下のタスクを実装してください。

## タスク情報
{タスクファイルの全内容を貼り付け}

## プロジェクト規則
- CLAUDE.md の全ルールに従うこと
- コミットに Co-Authored-By 行を付与しない

## 手順

1. `bun install` を実行
2. タスクファイルの `status` を `"in_progress"` に、`updated` を今日の日付に変更する
3. タスクの Requirements と Affected Files を参考に、コードベースを調査して実装する
   - Affected Files のファイルをまず読む
   - 関連する既存パターンを調査する
   - 変更を実装する
4. 意味のある単位で Conventional Commits（日本語メッセージ）でコミットする
5. `bun run build` を実行する
   - TypeScript エラーがあれば修正して再ビルド（最大3回試行）
   - 修正したらコミットする
   - 3回失敗したら状況を報告して終了
6. `bun run check` を実行する
   - lint エラーがあれば修正して再実行（最大3回試行）
   - 修正したらコミットする
   - 3回失敗したら状況を報告して終了
7. Acceptance Criteria を1つずつ検証する
   - 満たせていない基準があれば手順 3 に戻って追加実装
8. タスクファイルを更新する:
   - `status` → `"done"`
   - `updated` → 今日の日付
   - Acceptance Criteria のチェックボックスをすべて `- [x]` に
9. コミット: `task: complete {id}-{slug}`
```

---

## Phase 3: マージ

1. 各 Agent の完了を待ち、結果（成功/失敗・ブランチ名）を収集する
2. 成功したタスクのブランチを **IDの昇順** で main にマージする:
   ```bash
   git merge {branch} --no-edit
   ```
3. マージ競合が発生した場合はユーザーに報告して手動解決を依頼する
4. マージ成功したブランチの worktree とブランチを削除する:
   ```bash
   git worktree remove .claude/worktrees/agent-{id}
   git branch -d worktree-agent-{id}
   ```

---

## Phase 4: バージョンバンプ

1. 現在の `package.json` の `version` から minor バージョンを +1 する（例: `0.5.0` → `0.6.0`）
2. `wxt.config.ts` の `manifest.version_name` を同期する（例: `0.6.0-beta`）
3. コミット: `chore: バージョンを v{新バージョン}-beta にバンプ`
4. git tag を付与: `v{新バージョン}-beta`（例: `v0.6.0-beta`）

---

## Phase 5: 報告

実行結果をユーザーに報告する:

- 成功したタスクの一覧（ID・タイトル）
- 失敗したタスクの一覧と失敗理由
- 競合により除外されたタスクの一覧
- 依存未解決で除外されたタスクの一覧
- 新バージョン番号
