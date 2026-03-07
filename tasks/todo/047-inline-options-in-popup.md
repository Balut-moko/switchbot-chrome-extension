---
id: "047"
title: "オプション画面をポップアップ内の画面切り替えで表示する"
status: "todo"
priority: "medium"
depends_on: []
created: "2026-03-08"
updated: "2026-03-08"
---

# オプション画面をポップアップ内の画面切り替えで表示する

## Context

現在、設定ボタン（歯車アイコン）をクリックすると `browser.runtime.openOptionsPage()` で別タブにオプションページが開く。ユーザーはポップアップ内で画面を切り替えてオプションを表示・操作したい。

Options ページは独立したエントリーポイント（`src/entrypoints/options/`）として存在し、以下のコンポーネントを含む:
- `DeviceSettings` — デバイスの表示/非表示設定
- `LanguageSettings` — 言語設定
- `SecuritySettings` — セキュリティモード設定
- `ApiKeyForm` — API キー入力フォーム
- `ConnectionTest` — 接続テスト

これらのコンポーネントは `src/components/options/` に配置されており、popup からも再利用可能。

## Requirements

- ポップアップ内にデバイスリスト画面とオプション画面の2画面を切り替えるナビゲーションを実装する
- 設定ボタン押下で別タブを開く代わりに、ポップアップ内でオプション画面に切り替える
- オプション画面から戻るボタンでデバイスリスト画面に戻れる
- `src/components/options/` の既存コンポーネントをポップアップ内でそのまま再利用する
- ポップアップのサイズ内に収まるよう、オプション画面のレイアウトを調整する（`max-w-xl mx-auto p-6` → ポップアップ幅に合わせる）
- Options エントリーポイント（`src/entrypoints/options/`）は引き続き維持する（`chrome_url_overrides` や直接アクセス用）

## Affected Files

- `src/entrypoints/popup/App.tsx` — 画面切り替えステート（`'devices' | 'options'`）の追加、オプション画面のレンダリング
- `src/components/DeviceListHeader.tsx` — 設定ボタンの `onClick` を `openOptionsPage()` からコールバックに変更
- `src/components/DeviceList.tsx` — 設定画面切り替えコールバックの受け渡し
- `src/entrypoints/popup/style.css` — オプション画面用のスクロール調整（必要に応じて）

## Acceptance Criteria

- [ ] 設定ボタン押下でポップアップ内にオプション画面が表示される
- [ ] オプション画面に戻るボタンがあり、デバイスリスト画面に戻れる
- [ ] API キー設定、言語設定、デバイス設定、セキュリティ設定が正しく動作する
- [ ] オプション画面がポップアップのサイズ内に収まり、スクロール可能である
- [ ] Options エントリーポイント（別タブ）が引き続き動作する
- [ ] ダークモードで正しく表示される
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

- 画面切り替えは React の条件レンダリング（`view === 'options' ? <OptionsView /> : <DeviceList />`）でシンプルに実装可能
- ルーティングライブラリは不要（2画面のみ）
- Options の `App.tsx` のロジック（セキュリティモード取得、認証状態確認等）をポップアップ用のオプションビューコンポーネントに抽出する必要がある
- ポップアップ幅の変更（044 のグリッドレイアウト）と合わせると、オプション画面もより広く使える
