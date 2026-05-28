/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/entrypoints/**/*.{html,tsx,ts}', './src/components/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        // OS ごとに UI フォント＋日本語フォントを明示し、Latin/日本語の見た目を統一する
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Hiragino Sans"',
          '"Hiragino Kaku Gothic ProN"',
          '"Yu Gothic UI"',
          '"Yu Gothic"',
          'Meiryo',
          '"Noto Sans CJK JP"',
          '"Noto Sans JP"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [],
};
