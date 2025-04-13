/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'helden': {
          purple: {
            light: '#e9d5ff',
            DEFAULT: '#8a5cf6',
            dark: '#6b46c1',
          },
          pink: {
            light: '#fce7f3',
            DEFAULT: '#f8c4d9',
            dark: '#ec4899',
          },
          gold: {
            light: '#fef3c7',
            DEFAULT: '#d4af37',
            dark: '#b45309',
          },
          beige: {
            light: '#fffbeb',
            DEFAULT: '#fffcf5',
            dark: '#f7f4e9',
          },
          error: {
            light: '#fee2e2',
            DEFAULT: '#ef4444',
            dark: '#b91c1c',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 