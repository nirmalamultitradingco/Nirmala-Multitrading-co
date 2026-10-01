/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        forest: 'rgb(var(--color-forest) / <alpha-value>)',
        moss: 'rgb(var(--color-moss) / <alpha-value>)',
        gold: 'rgb(var(--color-gold) / <alpha-value>)',
        clay: 'rgb(var(--color-clay) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        content: '1200px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(22,36,28,0.04), 0 12px 30px -18px rgba(22,36,28,0.25)',
      },
    },
  },
  plugins: [],
};
