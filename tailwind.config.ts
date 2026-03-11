import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        gold: {
          50: '#fdf9f0',
          100: '#fbf0d9',
          200: '#f6e0b3',
          300: '#edc67a',
          400: '#e3a947',
          500: '#d4902a',
          600: '#b87620',
          700: '#945c1d',
          800: '#7a4d1e',
          900: '#663f1b',
        },
      },
    },
  },
  plugins: [],
}

export default config
