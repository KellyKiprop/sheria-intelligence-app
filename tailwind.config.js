/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        code: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        primary: '#1B4332',
        secondary: '#2D6A4F',
        'accent-gold': '#D4A017',
        'accent-gold-light': '#F0C040',
        'dark-surface': '#0D1F17',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
