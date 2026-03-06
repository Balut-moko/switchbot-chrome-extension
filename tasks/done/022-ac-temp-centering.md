---
id: "022"
title: "エアコン UI の温度表示をボタン間の中央に配置する"
status: "done"
priority: "low"
depends_on: []
created: "2026-03-06"
updated: "2026-03-07"
---

# エアコン UI の温度表示をボタン間の中央に配置する

## Context

エアコン操作 UI（ACControl）の温度表示が、マイナスボタンとプラスボタンの間で微妙に左にずれて見える。現在の実装では `flex justify-center gap-6` で3要素（−ボタン、温度表示、+ボタン）を並べているが、温度表示に `°C` サフィックスが含まれるため、数値自体がボタン間の正確な中央に位置しない。

## Requirements

- 温度の数値（例: `24`）がマイナスボタンとプラスボタンの視覚的な中央に来るようにする
- `°C` サフィックスが中央揃えに影響しないようにする
- 温度が1桁（例: `16`→`9` は現仕様では起きないが）や2桁でもセンタリングが崩れないようにする

## Affected Files

- `src/components/controls/ACControl.tsx` — 温度表示部分（126-131行目付近）のレイアウト修正

## Acceptance Criteria

- [x] 温度の数値がマイナス・プラスボタンの中央に見える
- [x] `°C` の表示が維持される
- [x] ダークモードで正しく表示される
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- 温度範囲は AC_TEMP_MIN〜AC_TEMP_MAX（16〜30）なので常に2桁
- 修正方法の候補: 温度表示 div に固定幅を設定する、または `°C` を absolute 配置にして数値のみでセンタリングする
