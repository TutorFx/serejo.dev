// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import pluginTailwindCSS from 'eslint-plugin-tailwindcss'
import stylistic from '@stylistic/eslint-plugin'

export default withNuxt(
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': ['error', { singleline: 3 }],
      '@stylistic/comma-dangle': 'off',
      '@stylistic/indent': ['error', 2],
    },
    plugins: {
      '@stylistic': stylistic,
    },
  },
  {
    files: ['**/*.vue'],
    plugins: {
      tailwindcss: pluginTailwindCSS,
    },
    settings: {
      tailwindcss: {
        config: {},
      },
    },
    rules: {
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/enforces-shorthand': 'warn',
      'tailwindcss/no-contradicting-classname': 'error',
    },
  },
)
