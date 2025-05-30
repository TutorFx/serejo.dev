/* eslint-disable unused-imports/no-unused-vars */

import process from 'node:process'
import tailwindTypography from '@tailwindcss/typography'
import daisyui from 'daisyui'
import { appDescription, appName, phoneNumber, schedule, siteUrl } from './constants/index'
import * as pkg from './package.json'

const isDev = Boolean(process.env.NODE_ENV !== 'production')
const isProd = Boolean(process.env.NODE_ENV === 'production')

export default defineNuxtConfig({
  modules: [
    // 'nuxt-build-cache',
    // 'nuxt-site-config',
    // 'nuxt-booster',
    // '@nuxtjs/sitemap',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/device',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxt/eslint',
    // '@nuxthq/studio',
    // PWA still redirecting the defaultLocale
    // '@vite-pwa/nuxt',
    // 'nuxt-module-eslint-config',
    'nuxt-icon',
    'nuxt-gtag',
  ],

  // pwa,

  devtools: {
    enabled: true,
  },

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

  site: {
    name: appName,
    description: appDescription,
    url: siteUrl,
  },

  colorMode: {
    preference: 'light',
    dataValue: 'theme',
  },

  content: {
    api: {
      baseURL: '/api/cms',
    },
  },

  runtimeConfig: {
    gemini_api_key: process.env.GEMINI_API_KEY,
    public: {
      version: pkg.version,
      name: pkg.name,
      dev: isDev,
      url: siteUrl,
      phoneNumber,
      schedule,
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
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
    // By default Nuxt overwrites generated route values
    // at build time which breaks custom named routes
    scanPageMeta: true,

    viewTransition: true,
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
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

  typescript: {
    tsConfig: {
      compilerOptions: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    },
    strict: true,
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

    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
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
    customRoutes: 'config',
    langDir: 'locales/',
    pages: {
      'index': {
        'en': '/',
        'pt-BR': '/inicio',
      },
      'blog': {
        'en': '/blog',
        'pt-BR': '/blog',
      },
      'history': {
        'en': '/my-trajectory',
        'pt-BR': '/minha-jornada',
      },
      'projects': {
        'en': '/projects',
        'pt-BR': '/projetos',
      },
      'experience/[item]': {
        'en': '/i-worked-in/[item]',
        'pt-BR': '/trabalhei-na/[item]',
      },
      '/sitemap.xml': {
        'en': '/sitemap.xml',
        'pt-BR': '/sitemap.xml',
      },
    },
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

  pinia: {
    storesDirs: ['./stores/**'],
  },

  tailwindcss: {
    config: {
      plugins: [tailwindTypography, daisyui],
    },
  },
})
