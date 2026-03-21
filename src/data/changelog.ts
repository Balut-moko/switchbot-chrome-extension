import type { Locale } from '@/utils/locale';

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: Record<Locale, string[]>;
}

export const changelog: ChangelogEntry[] = [
  {
    version: '1.0.0',
    date: '2026-03-21',
    changes: {
      ja: [
        'SwitchBot デバイスの操作（照明、ボット、ロック、エアコン、IR リモコン）',
        '高セキュリティモード（マスターパスワードによる API トークン暗号化）',
        'ダークモード対応',
        '日本語/英語の言語切り替え',
        'デバイスの並び替え・検索機能',
        'デバイスステータスの自動更新',
      ],
      en: [
        'Control SwitchBot devices (lights, bots, locks, air conditioners, IR remotes)',
        'High security mode (API token encryption with master password)',
        'Dark mode support',
        'Japanese/English language switching',
        'Device reorder and search',
        'Automatic device status updates',
      ],
    },
  },
];
