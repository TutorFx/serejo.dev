/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

import colors from 'tailwindcss/colors'
import typography from '@tailwindcss/typography'

module.exports = {
  darkMode: 'selector',
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}', 'docs/content/**/*.md'],
  plugins: [typography, 'prettier-plugin-tailwindcss', 'daisyui'],

  theme: {
    screen: {
      xs: '630px',
    },
    fontFamily: {
      sans: ['Space Grotesk', ...defaultTheme.fontFamily.sans].join(','),
      logo: ['Mochiy Pop One', ...defaultTheme.fontFamily.sans].join(','),
    },
    extend: {
      height: {
        screen: ['100vh', '100dvh'],
      },
      minHeight: {
        screen: ['100vh', '100dvh'],
      },
      keyframes: {
        'skeleton-loading': {
          '0%': { backgroundPosition: '200% 0' },
          'to': { backgroundPosition: '-200% 0' },
        },
        'marquee-y': {
          '0%': { transform: 'translateY(-10%)' },
          '100%': { transform: 'translateY(-90%)' },
        },
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-y': 'marquee-y 200s linear infinite',
      },
      backgroundImage: () => ({
        'skeleton-gradient':
                    'linear-gradient(45deg, #252035, #2d2a3d, #393545, #2d2a3d, #252035)',
        'brand-gradient':
                    'linear-gradient(45deg, #f72585, #b5179e, #7209b7, #560bad, #480ca8, #3a0ca3, #3f37c9, #4361ee, #4895ef, #4cc9f0)',
        'vue-gradient':
                    'linear-gradient(45deg, #004b23, #006400, #007200, #008000, #38b000, #70e000, #9ef01a, #ccff33)',
      }),
      backgroundSize: {
        400: '400% 100%',
      },
      colors: {

      },
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          'color-scheme': 'dark',
          'primary': '#FCA311',
          'secondary': '#f72585',
          'accent': colors.stone[600],
          'neutral': '#E5E5E5',
          'neutral-content': '#FFFFFF',
          'base-100': colors.stone[950],
          'base-200': '#141414',
          'base-300': '#141414',
          'base-content': '#FFFFFF',
        },
        light: {
          'color-scheme': 'light',
          'primary': '#FCA311',
          'secondary': '#f72585',
          'secondary-content': 'oklch(98.71% 0.0106 342.55)',
          'accent': colors.stone[400],
          'neutral': '#14213D',
          'neutral-content': '#D7DDE4',
          'base-100': 'oklch(100% 0 0)',
          'base-200': '#F2F2F2',
          'base-300': '#E5E6E6',
          'base-content': '#1f2937',
        },
      },
    ],
  },
}
