import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060a12',
          900: '#0a0f1d',
          850: '#0e1626',
          800: '#131e33',
          700: '#1e293b',
          600: '#334155',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        '3d-logo': '0 8px 24px -4px rgba(59, 130, 246, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.35)',
        'cyan-glow': '0 0 25px -4px rgba(6, 182, 212, 0.35)',
        'warning-glow': '0 0 25px -4px rgba(245, 158, 11, 0.25)',
      },
    },
  },
  plugins: [typography],
};
