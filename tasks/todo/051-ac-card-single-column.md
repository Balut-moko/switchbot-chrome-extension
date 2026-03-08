---
id: "051"
title: "エアコンカードを他のデバイスと同じ1列幅に収める"
status: "todo"
priority: "medium"
depends_on: []
created: "2026-03-09"
updated: "2026-03-09"
---

# エアコンカードを他のデバイスと同じ1列幅に収める

## Context

現在、ポップアップのデバイスリストでエアコン（AC）カードだけが `col-span-2` で2列幅を占有しており、他のデバイスカード（1列幅）と統一感がない。ACカードを他のデバイスと同じ1列幅に収めることで、レイアウトの一貫性を改善する。

現状の実装:
- `DeviceList.tsx:54` で `isAC ? 'col-span-2' : ''` により AC カードが2列幅
- `ACControl.tsx` の温度表示（4xl）、モードセレクタ（5列グリッド）、ファンスピード（4列グリッド）が横幅を前提としたレイアウト

## Requirements

- AC カードの `col-span-2` を削除し、他のデバイスと同じ1列幅にする
- `ACControl.tsx` のUIをコンパクト化して1列幅に収まるようにする
  - 温度表示のフォントサイズを調整
  - モードセレクタ・ファンスピードセレクタのレイアウトを最適化
  - パワーボタンのサイズを調整
- 操作性を損なわないよう、ボタンのタップ領域を十分に確保する

## Affected Files

- `src/components/DeviceList.tsx` — `col-span-2` の削除
- `src/components/ACControl.tsx` — UIレイアウトのコンパクト化
- `src/components/DeviceCard.tsx` — AC カード固有のスタイル調整（必要に応じて）

## Acceptance Criteria

- [ ] AC カードが他のデバイスカードと同じ1列幅で表示される
- [ ] 温度調整、モード切替、ファンスピード切替が1列幅で正常に操作できる
- [ ] パワーボタンが正常に動作する
- [ ] 2列グリッド内で AC カードと他のカードが並んで表示される
- [ ] `bun run build` が TypeScript エラーなしで成功する
