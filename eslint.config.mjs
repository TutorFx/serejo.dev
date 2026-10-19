// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier/flat'
import pluginTailwindCSS from 'eslint-plugin-tailwindcss'

export default withNuxt(
  // JS/TS files are linted by oxlint (.oxlintrc.json, generated with @oxlint/migrate). ESLint keeps the .vue files
  // (oxlint has no Vue template linting yet) and the markdown link checks. Drop this ignore before re-running the migration
  {
    ignores: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      // Set by the Nuxt stylistic preset, which is off now that oxfmt formats the code
      'vue/one-component-per-file': 'off',
      'vue/require-default-prop': 'off',
      'import/newline-after-import': ['error', { count: 1 }],
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
  // Turns off the rules that conflict with oxfmt, as the oxfmt docs recommend; keep it after the other configs
  prettier,
  {
    // Turned off by eslint-config-prettier, whose docs say it usually works with the formatter. It guards
    // semicolon-less code and oxlint keeps it for JS/TS
    rules: {
      'no-unexpected-multiline': 'error',
    },
  }
)
