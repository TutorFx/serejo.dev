import { pwa } from './config/pwa'
import { appDescription } from './constants/index'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxtjs/seo',
    '@nuxt/image',
    '@nuxt/content',
    '@vite-pwa/nuxt',
    'nuxt-module-eslint-config',
    'nuxt-icon',
  ],

  i18n: {
    defaultLocale: 'pt',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en-US.ts'
      },
      {
        code: 'pt',
        iso: 'pt-BR',
        file: 'pt-BR.ts'
      }
    ],
    langDir: 'locales/',
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  colorMode: {
    preference: "light",
    dataValue: "theme",
  },

  googleFonts: {
    families: {
      "Space Grotesk": [300, 400, 700],
      "Mochiy Pop One": true
    },
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/hi'],
    },
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
      ],
    },
  },

  pwa,

  devtools: {
    enabled: true,
  },

  eslintConfig: {
    setup: false,
  },

  content: {
    api: {
      baseURL: '/api/cms'
    }
  }
})