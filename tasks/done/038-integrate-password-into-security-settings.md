---
id: "038"
title: "パスワード設定を SecuritySettings に統合する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-07"
updated: "2026-03-08"
---

# パスワード設定を SecuritySettings に統合する

## Context

現在、ハイセキュリティモードのマスターパスワード入力フィールドは ApiKeyForm コンポーネント内にある。セキュリティモードの選択（SecuritySettings）とパスワード設定が別のセクションに分散しているため、ユーザーにとってわかりにくい。パスワード設定をセキュリティモード選択と同じ SecuritySettings セクションに統合し、セキュリティ関連の設定を一箇所にまとめる。

## Requirements

- SecuritySettings コンポーネントにパスワード入力フィールド（パスワード + 確認）を追加する
- ハイセキュリティモード選択時のみパスワードフィールドを表示する
- ApiKeyForm からパスワード関連のフィールドとロジックを削除する
- パスワードのバリデーション（一致確認）を SecuritySettings 側に移動する
- `saveCredentials` メッセージにパスワードを渡すフローを調整する
- i18n 対応

## Affected Files

- `src/components/options/SecuritySettings.tsx` — パスワード入力フィールド追加、バリデーション追加
- `src/components/options/ApiKeyForm.tsx` — パスワード関連のフィールド・ロジック削除
- `src/entrypoints/options/App.tsx` — パスワード状態の受け渡し調整
- `src/utils/i18n.ts` — 必要に応じて翻訳キーの移動・追加

## Acceptance Criteria

- [x] ハイセキュリティモード選択時、SecuritySettings セクション内にパスワード入力フィールドが表示される
- [x] スタンダードモード選択時はパスワードフィールドが非表示
- [x] ApiKeyForm にパスワード関連のフィールドが存在しない
- [x] パスワードの一致バリデーションが正常に動作する
- [x] ハイセキュリティモードでの認証情報保存・復号が正常に動作する
- [x] `bun run build` が TypeScript エラーなしで成功する
