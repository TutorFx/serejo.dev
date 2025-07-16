import process from 'node:process'
import tailwindcss from "@tailwindcss/vite";

import {
  APP_DESCRIPTION,
  APP_NAME,
  PHONE_NUMBER,
  SCHEDULE,
  SITE_URL,
} from './shared/utils/constants'

import * as pkg from './package.json'

const isDev = Boolean(process.env.NODE_ENV !== 'production')

export default defineNuxtConfig({
  modules: [
    // '@nuxtjs/device',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
    'nuxt-gtag',
  ],

  devtools: {
    enabled: true,
  },

  compatibilityDate: '2025-06-10',

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      titleTemplate: '%s %separator %siteName',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
      ],
    },
  },

  content: {
    build: {
      transformers: [
        '~~/transformers/reading-time.ts',
      ],
      markdown: {}
    },
  },

  site: {
    name: APP_NAME,
    description: APP_DESCRIPTION,
    url: SITE_URL,
  },

  colorMode: {
    classSuffix: '',
    storage: 'localStorage',
  },

  runtimeConfig: {
    gemini_api_key: process.env.GEMINI_API_KEY,
    public: {
      version: pkg.version,
      name: pkg.name,
      dev: isDev,
      url: SITE_URL,
      PHONE_NUMBER,
      SCHEDULE,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/pt-BR/inicio': { prerender: true },
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: true,
    },
    vercel: {
      functions: {
        maxDuration: 300,
      },
    },
  },

  css: [
    './assets/css/tailwind.css',
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      // https://github.com/nuxt-modules/mdc/issues/394
      include: ["debug"],
    },
  },

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },

  googleFonts: {
    families: {
      'Space Grotesk': [300, 400, 700],
      'Mochiy Pop One': true,
    },
  },

  gtag: {
    id: process.env.GTAG,
  },

  i18n: {
    // TODO: Move to `prefix` when the nuxt team fix the issue
    // TODO: Move the app to customRoutes: 'config'
    strategy: 'prefix_except_default',

    defaultLocale: 'en-US',
    locales: [
      {
        code: 'en-US',
        name: 'English',
        language: 'en-US',
        file: 'en-US.ts',
      },
      {
        code: 'pt-BR',
        name: 'Português',
        language: 'pt-BR',
        file: 'pt-BR.ts',
      },
    ],
    customRoutes: 'page',
    langDir: 'locales/',
    experimental: {
      localeDetector: 'localeDetector.ts',
    },
  },

  ogImage: {
    defaults: {},
    fonts: [
      // will load the Noto Sans font from Google fonts
      'Space+Grotesk:300',
      'Space+Grotesk:400',
      'Space+Grotesk:700',
    ],
  },

  

  icon: {
    mode: 'css',
    cssLayer: 'base',
  }
})