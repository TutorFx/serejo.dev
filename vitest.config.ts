import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Unimport from 'unimport/unplugin'
import { defineConfig } from 'vitest/config'

// Tests run outside Nuxt. The aliases and auto-imports reproduce the server context for code that runs
// without Nitro; useRuntimeConfig, getUserSession, useTranslation etc. only have types: stub them with vi.stubGlobal
export default defineConfig({
  plugins: [
    // Same dirs and h3 preset that Nitro registers
    Unimport.vite({
      dirs: ['server/utils/**/*', 'shared/utils', 'shared/types'],
      presets: [{ package: 'h3', ignore: [/^[A-Z]/, 'use'] }]
    })
  ],
  resolve: {
    alias: {
      '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
      '#server': fileURLToPath(new URL('./server', import.meta.url)),
      '~~': dirname(fileURLToPath(import.meta.url))
    }
  }
})
