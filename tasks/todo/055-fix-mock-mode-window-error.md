---
id: "055"
title: "モックモード Playwright 実行時の window is not defined エラーを修正する"
status: "todo"
priority: "high"
depends_on: ["054"]
created: "2026-03-11"
updated: "2026-03-11"
---

# モックモード Playwright 実行時の window is not defined エラーを修正する

## Context

`MOCK_MODE=true bun run build` でビルドした拡張機能を Playwright で読み込むと、Popup に「window is not defined」エラーが赤いエラーボックスで表示される。デバイス一覧が描画されず、Settings 画面への遷移もできないため、スクリーンショットがエラー画面のまま撮影される。

## Requirements

- エラーの発生箇所を特定し修正する
  - `src/hooks/useTheme.ts` で `window.matchMedia()` を `typeof window !== 'undefined'` ガード付きで呼び出す
  - `document.documentElement` へのアクセスも同様にガードする
  - その他 `window` / `document` を直接参照している箇所があれば同様に修正する
- モックモードビルド + Playwright 実行でエラーなく Popup が表示されることを確認する
- 通常モード（非モック）の動作に影響を与えないこと

## Affected Files

- `src/hooks/useTheme.ts` — `window.matchMedia()` と `document` アクセスにガードを追加
- その他 `window` / `document` を直接参照しているファイル（調査の上修正）

## Acceptance Criteria

- [ ] モックモードビルド + Playwright でエラーなく Popup が表示される
- [ ] スクリーンショットテストでデバイス一覧が表示される
- [ ] 通常モードのビルドに影響がない
- [ ] `bun run build` が TypeScript エラーなしで成功する
- [ ] `bun run check` で Biome エラーがない

## Notes

- エラー表示は `src/components/DeviceList.tsx` の赤いエラーボックス（`bg-red-50` クラス）
- `@wxt-dev/storage` は `window` を直接参照していないことを確認済み
- Playwright 環境では Chrome 拡張のコンテキストで `window` は通常使えるはずだが、初期化タイミングや Service Worker の起動順序に依存する可能性がある
