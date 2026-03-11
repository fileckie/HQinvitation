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
        serif: ['Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', 'serif'],
        display: ['Noto Serif SC', 'Source Han Serif SC', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'sans-serif'],
      },
      colors: {
        pearl: '#FAF7F2',
        ivory: '#F5F0E8',
        cream: '#EDE8E0',
        charcoal: '#1A1A1A',
        'deep-gray': '#2C2C2C',
        'medium-gray': '#4A4A4A',
        'light-gray': '#8A8A8A',
        'border-gray': '#E5E0D8',
        gold: '#C9A962',
        bronze: '#B87333',
      },
      letterSpacing: {
        'widest': '0.3em',
      },
    },
  },
  plugins: [],
}

export default config
