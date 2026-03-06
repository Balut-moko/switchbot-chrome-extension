---
id: "031"
title: "言語切り替え機能を追加する"
status: "todo"
priority: "medium"
depends_on: []
created: "2026-03-07"
updated: "2026-03-07"
---

# 言語切り替え機能を追加する

## Context

現在の i18n（`src/utils/i18n.ts`）は `navigator.language` でブラウザの言語を自動検出し、日本語（ja）と英語（en）を切り替えている。しかしユーザーが手動で言語を選択する手段がなく、ブラウザの言語設定と異なる言語で使いたい場合に対応できない。

Options ページに言語選択 UI を追加し、選択結果を `chrome.storage.local` に永続化して Popup・Options 両方に反映する。

## Requirements

- Options ページに言語選択のドロップダウンまたはラジオボタンを追加する
  - 選択肢: `自動（ブラウザ設定に従う）` / `日本語` / `English`
  - デフォルト: `自動`
- 言語設定を `chrome.storage.local` に保存する（キー例: `local:languagePreference`）
- `src/utils/i18n.ts` の `getLocale()` を拡張し、保存された言語設定を優先する
  - `auto` の場合は既存の `navigator.language` ベースの判定を使用
  - `ja` / `en` が明示されている場合はそれを使用
- Popup と Options ページの両方で言語設定が即時反映される
- 言語変更時にページのリロードなしで反映する（React の state 管理で対応）

## Affected Files

- `src/utils/i18n.ts` — `getLocale()` の拡張、言語設定の読み込みロジック追加
- `src/lib/storage.ts` — `languagePreferenceItem` の追加
- `src/components/options/LanguageSettings.tsx` — 新規: 言語選択 UI コンポーネント
- `src/entrypoints/options/App.tsx` — `LanguageSettings` の配置
- `src/components/DeviceList.tsx` — 言語変更時の再レンダリング対応（必要に応じて）

## Acceptance Criteria

- [ ] Options ページで言語を「自動 / 日本語 / English」から選択できる
- [ ] 選択した言語が `chrome.storage.local` に保存される
- [ ] Popup の UI テキストが選択言語で表示される
- [ ] Options ページの UI テキストが選択言語で表示される
- [ ] 「自動」選択時はブラウザ言語設定に従う
- [ ] ダークモードで正しく表示される
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

- 現在の `t()` 関数は同期関数のため、言語設定の初期読み込みタイミングに注意が必要。起動時に storage から一度読み込んでモジュール変数にキャッシュし、変更時にイベントで更新するパターンが適切
- 将来的に対応言語を増やす場合（中国語、韓国語等）に拡張しやすい設計にする
- Chrome 拡張の `chrome.i18n` API（`_locales/` ベース）は manifest 記述用であり、動的な言語切り替えには向かないため、現在の自前 i18n を拡張する方針
