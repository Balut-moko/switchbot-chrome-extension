---
id: "017"
title: "ダークモードに対応する"
status: "todo"
priority: "medium"
phase: 5
depends_on: []
created: "2026-03-04"
updated: "2026-03-04"
---

# ダークモードに対応する

## Context

現在すべてのコンポーネントでライトテーマの色が Tailwind クラスにハードコードされている（`bg-white`, `text-gray-600`, `border-gray-100` 等）。
CSS 変数やダークモード設定は未導入。システム設定に応じたダークモード対応を追加する。

## Requirements

### Tailwind 設定
- `tailwind.config.js` に `darkMode: 'class'` を追加
- `src/assets/tailwind.css` に CSS カスタムプロパティでテーマカラーを定義（ライト/ダーク）

### テーマ切替ロジック
- システムの `prefers-color-scheme` を検出し、`<html>` に `dark` クラスを付与
- ユーザーの手動切替（ライト/ダーク/システム準拠）を提供
- 設定を `chrome.storage.local` に保存

### コンポーネント更新
- 全コンポーネントのハードコード色クラスに `dark:` バリアントを追加
- 対象コンポーネント:
  - Popup: `App.tsx`
  - Options: `App.tsx`, `ApiKeyForm.tsx`, `SecuritySettings.tsx`, `ConnectionTest.tsx`, `DeviceSettings.tsx`
  - デバイス: `DeviceCard.tsx`, `DeviceList.tsx`, `DeviceSection.tsx`, `SearchBar.tsx`
  - コントロール: `SwitchControl.tsx`, `ACControl.tsx`, `CurtainControl.tsx`, `LightControl.tsx`, `LockControl.tsx`, `TVControl.tsx`, `SensorDisplay.tsx`
  - 認証: `UnlockPrompt.tsx`

### テーマ切替 UI
- Popup ヘッダーにテーマ切替ボタンを追加（ライト/ダーク/システムの3択）

## Affected Files

- `tailwind.config.js` — `darkMode: 'class'` 追加
- `src/assets/tailwind.css` — CSS カスタムプロパティ定義
- `src/hooks/useTheme.ts` — 新規: テーマ管理フック
- `src/components/**/*.tsx` — 全コンポーネントに `dark:` バリアント追加
- `src/entrypoints/popup/App.tsx` — テーマ初期化、ルート要素にクラス付与
- `src/entrypoints/options/App.tsx` — 同上

## Acceptance Criteria

- [ ] システムがダークモードのとき、自動でダークテーマが適用される
- [ ] ユーザーがテーマを手動切替できる（ライト/ダーク/システム準拠）
- [ ] テーマ設定がブラウザ再起動後も保持される
- [ ] Popup と Options の両画面でダークモードが正しく表示される
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

- shadcn/ui は未導入なので、CSS カスタムプロパティ + Tailwind `dark:` バリアントで対応する
- CLAUDE.md に「Tailwind CSS v3（v4 は WXT 互換性問題あり）」とあるので v3 の `darkMode: 'class'` を使用
- コンポーネント数が多いため、CSS カスタムプロパティで共通色を定義し `dark:` バリアントの記述量を抑える方針も検討
