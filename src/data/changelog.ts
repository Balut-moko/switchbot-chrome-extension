import type { Locale } from '@/utils/locale';

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: Record<Locale, string[]>;
}

export const changelog: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: '2026-05-29',
    changes: {
      ja: ['フォントスタックを明示し、macOS / Windows / Linux 間で日本語表示を統一'],
      en: ['Explicit font stack for unified Japanese rendering across macOS / Windows / Linux'],
    },
  },
  {
    version: '1.1.0',
    date: '2026-03-29',
    changes: {
      ja: ['Chrome Web Store での拡張機能名・説明の日本語表示に対応'],
      en: ['Added Japanese localization for extension name and description in Chrome Web Store'],
    },
  },
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
