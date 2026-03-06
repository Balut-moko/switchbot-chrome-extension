---
id: "019"
title: "設定画面で API 設定セクションを折りたたみ可能にする"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-06"
updated: "2026-03-07"
---

# 設定画面で API 設定セクションを折りたたみ可能にする

## Context

現在の設定画面（Options ページ）では、API Token / API Secret の入力フォームとセキュリティモード選択がメインコンテンツとして常に表示されている。しかし API 設定は初回セットアップ時に一度入力すれば、その後はほとんど変更しない。日常的に使うのはデバイス表示設定やテーマ切り替えなどであり、API 設定が画面上部を占有していると使い勝手が悪い。

## Requirements

- API 設定（SecuritySettings + ApiKeyForm）を折りたたみ可能な Collapsible セクションにする
- 認証済みの場合はデフォルトで折りたたまれた状態にする
- 未認証の場合はデフォルトで展開された状態にする
- 折りたたみ時に「API 設定済み」などのステータスを表示する
- shadcn/ui の Collapsible コンポーネントを活用する
- デバイス表示設定やテーマ設定など日常的に使う設定を上部に配置することを検討する

## Affected Files

- `src/entrypoints/options/App.tsx` — レイアウト構造の変更、Collapsible の導入
- `src/components/options/ApiKeyForm.tsx` — 必要に応じて調整
- `src/components/options/SecuritySettings.tsx` — 必要に応じて調整
- `src/components/ui/collapsible.tsx` — shadcn/ui Collapsible コンポーネントの追加（未導入の場合）

## Acceptance Criteria

- [x] 認証済みの場合、API 設定セクションがデフォルトで折りたたまれている
- [x] 未認証の場合、API 設定セクションがデフォルトで展開されている
- [x] 折りたたみの開閉がスムーズにアニメーションする
- [x] 折りたたみ時に設定済みステータスが視認できる
- [x] ダークモードで正しく表示される
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- shadcn/ui の Collapsible が未導入の場合は `bunx shadcn@latest add collapsible` で追加する
- セクション順序の変更（デバイス設定を上に移動）は、この変更と合わせて実施するか別タスクにするか要検討
