/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep emerald green (Pakistan)
        primary: {
          50: '#e6f7f0',
          100: '#ccefe0',
          200: '#99dfc1',
          300: '#66cfa3',
          400: '#33bf84',
          500: '#00af65',
          600: '#008c51',
          700: '#006b3c',
          800: '#004a28',
          900: '#002914',
        },
        // Warm saffron/orange (India)
        accent: {
          50: '#fff4ed',
          100: '#ffe8d6',
          200: '#ffd1ad',
          300: '#ffba85',
          400: '#ffa35c',
          500: '#ff8c33',
          600: '#ff6b35',
          700: '#f77f00',
          800: '#cc6600',
          900: '#a35200',
        },
        // Rich terracotta & warm gold
        terracotta: {
          50: '#fceef0',
          100: '#f9dde0',
          200: '#f3bbc1',
          300: '#ed99a3',
          400: '#e77784',
          500: '#e15565',
          600: '#d45b5e',
          700: '#b04a4d',
          800: '#8c393b',
          900: '#68292a',
        },
        gold: {
          50: '#faf8ed',
          100: '#f5f1db',
          200: '#ebe3b7',
          300: '#e1d593',
          400: '#d7c76f',
          500: '#d4af37',
          600: '#c49d24',
          700: '#a3821d',
          800: '#826816',
          900: '#614e10',
        },
        // Warm neutrals
        cream: {
          50: '#fffcf5',
          100: '#fff8f0',
          200: '#fef2e0',
          300: '#fdecd1',
          400: '#fce6c2',
          500: '#fbe0b2',
          600: '#f9d89f',
          700: '#f7d08c',
          800: '#f5c879',
          900: '#f3c066',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}