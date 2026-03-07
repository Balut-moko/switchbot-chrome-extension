import type { Locale } from '@/utils/locale';

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: Record<Locale, string[]>;
}

export const changelog: ChangelogEntry[] = [
  {
    version: '0.13.0-beta',
    date: '2026-03-08',
    changes: {
      ja: [
        'デバイスカテゴリセクションを廃止してフラットリストに変更',
        'チェンジログ表示機能を追加',
      ],
      en: ['Replaced device category sections with a flat list', 'Added changelog display feature'],
    },
  },
  {
    version: '0.12.0-beta',
    date: '2026-03-04',
    changes: {
      ja: ['デバイス並び替え機能を追加', 'デバイス検索機能を追加', 'IR リモコン操作の改善'],
      en: [
        'Added device reorder feature',
        'Added device search feature',
        'Improved IR remote control',
      ],
    },
  },
  {
    version: '0.11.0-beta',
    date: '2026-02-25',
    changes: {
      ja: [
        'ロック・解錠デバイスの操作対応',
        'ボット（押すだけ）デバイスの操作対応',
        'エアコン操作 UI の改善',
      ],
      en: [
        'Added lock/unlock device control',
        'Added bot (press) device control',
        'Improved AC control UI',
      ],
    },
  },
  {
    version: '0.10.0-beta',
    date: '2026-02-18',
    changes: {
      ja: [
        '高セキュリティモード（マスターパスワード暗号化）を追加',
        'ダークモード対応',
        '言語設定（日本語/英語）を追加',
      ],
      en: [
        'Added high security mode (master password encryption)',
        'Added dark mode support',
        'Added language settings (Japanese/English)',
      ],
    },
  },
];
