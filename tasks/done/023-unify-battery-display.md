---
id: "023"
title: "バッテリー残量表示をすべてのデバイスカードで統一する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-07"
updated: "2026-03-07"
---

# バッテリー残量表示をすべてのデバイスカードで統一する

## Context

現在、バッテリー残量はセンサー系デバイス（Meter、Motion Sensor、Contact Sensor）のみ `SensorDisplay` のバッジとして表示されている。しかし Bot、Curtain/Curtain3/Blind Tilt/Roller Shade、Smart Lock/Smart Lock Pro も `hasBattery: true` でステータスに `battery` フィールドを持つにもかかわらず、UI にバッテリー情報が表示されない。

バッテリー残量の表示位置・スタイルをデバイスタイプによらず統一し、すべてのバッテリー搭載デバイスで残量を確認できるようにする。

## Requirements

- `hasBattery: true` のすべてのデバイスでバッテリー残量を表示する
- バッテリー表示のスタイル（バッジ: 🔋 XX%、secondary variant）を統一する
- sensor variant カード: 既存の `SensorDisplay` バッジ表示を維持
- controls variant カード（Bot, Curtain, Lock）: コントロール要素と共存する形でバッテリーバッジを追加
- バッテリー情報がステータスに含まれない場合は非表示（グレースフルフォールバック）

## Affected Files

- `src/components/DeviceCard.tsx` — controls variant にバッテリーバッジ表示を追加
- `src/components/controls/BotControl.tsx` — バッテリー表示の統合（または DeviceCard 側で処理）
- `src/components/controls/CurtainControl.tsx` — 同上
- `src/components/controls/LockControl.tsx` — 同上

## Acceptance Criteria

- [x] Bot デバイスカードにバッテリー残量がバッジとして表示される
- [x] Curtain/Curtain3/Blind Tilt/Roller Shade デバイスカードにバッテリー残量が表示される
- [x] Smart Lock/Smart Lock Pro デバイスカードにバッテリー残量が表示される
- [x] センサー系デバイスのバッテリー表示が従来通り動作する
- [x] バッテリー情報がない場合にバッジが表示されない
- [x] `bun run build` が TypeScript エラーなしで成功する
