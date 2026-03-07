---
id: "049"
title: "IR コマンド名のケーシングを公式 API に準拠させる"
status: "todo"
priority: "low"
depends_on: ["048"]
created: "2026-03-08"
updated: "2026-03-08"
---

# IR コマンド名のケーシングを公式 API に準拠させる

## Context

SwitchBot API の IR リモートデバイス向けコマンド名（fastForward, rewind, play, pause, stop 等）のケーシングが公式ドキュメントと一致しているか未検証。公式 README が長大なため WebFetch での自動検証が困難であり、公式ドキュメントを直接確認して修正する必要がある。

## Requirements

- https://github.com/OpenWonderLabs/SwitchBotAPI の IR コマンドセクションを直接確認する
- `deviceCapabilities.ts` の Streamer, DVD, Speaker 等の IR コマンド名を公式に合わせる
- 関連する UI コンポーネント（TVControl.tsx 等）のコマンド送信も確認する

## Affected Files

- `src/utils/deviceCapabilities.ts` — IR デバイスのコマンド名リスト
- `src/components/controls/TVControl.tsx` — IR コマンド送信ロジック
- `docs/switchbot-api-v1.1-reference.md` — IR コマンドセクション

## Acceptance Criteria

- [ ] 公式ドキュメントの IR コマンド名を直接確認済み
- [ ] `deviceCapabilities.ts` のコマンド名が公式と一致する
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

- 実機テストが必要な可能性がある（IR コマンドの大文字小文字の違いで動作しない場合がある）
