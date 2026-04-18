import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Support element class toggling for dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#3b82f6', // blue-500
          dark: '#1d4ed8', // blue-700
        },
        secondary: {
          DEFAULT: '#9333ea', // purple-600
          light: '#a855f7', // purple-500
          dark: '#7e22ce', // purple-700
        },
        accent: {
          DEFAULT: '#f59e0b', // amber-500
          light: '#fbbf24', // amber-400
          dark: '#d97706', // amber-600
        },
        background: 'var(--bg-color)',
        surface: 'var(--surface-color)',
        ring: 'var(--ring-color)',
        textMain: 'var(--text-main)',
        textMuted: 'var(--text-muted)'
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      fontSize: {
        'xxs': '0.65rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
