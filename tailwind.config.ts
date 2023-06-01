import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // adjust color to match brand color here
      colors: {
        primary: colors.sky,
        secondary: colors.orange,
        success: colors.emerald,
        danger: colors.red,
        info: colors.blue,
        warning: colors.yellow,
        gray: colors.gray, // choose your shade of grey (slate, gray, zinc, neutral, stone)
      },

      // add custom animation
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config
