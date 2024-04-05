/* eslint-disable node/prefer-global/process */
import tailwindTypography from '@tailwindcss/typography'
import daisyui from 'daisyui'
import type { Nitro } from "nitropack"
import { appDescription, appName, phoneNumber, schedule, siteUrl } from './constants/index'
import * as pkg from './package.json'

const isDev = Boolean(process.env.NODE_ENV !== 'production')
const isProd = Boolean(process.env.NODE_ENV === 'production')

export default defineNuxtConfig({
  modules: [
    'nuxt-build-cache',
    'nuxt-site-config',
    'nuxt-speedkit',
    '@nuxtjs/seo',
    '@nuxtjs/sitemap',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxthq/studio',
    // PWA still redirecting the defaultLocale
    // '@vite-pwa/nuxt',
    'nuxt-module-eslint-config',
    'nuxt-icon',
  ],

  i18n: {
    // TODO: Move to `prefix` when the nuxt team fix the issue
    // TODO: Move the app to customRoutes: 'config'
    strategy: 'prefix_except_default',

    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English',
        iso: 'en-US',
        file: 'en-US.ts',
      },
      {
        code: 'pt-BR',
        name: 'Português',
        iso: 'pt-BR',
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
    },
    experimental: {
      localeDetector: './localeDetector.ts',
    },
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

  colorMode: {
    preference: 'light',
    dataValue: 'theme',
  },

  googleFonts: {
    families: {
      'Space Grotesk': [300, 400, 700],
      'Mochiy Pop One': true,
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

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
      ],
      ignore: [],
    },
    preset: isProd ? 'vercel' : 'node',
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

  pinia: {
    storesDirs: ['./stores/**'],
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
    },
    strict: true,
  },

  vite: {
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true
        }
      }
    }
  },

  site: {
    name: appName,
    description: appDescription,
    url: siteUrl,
  },

  // pwa,

  devtools: {
    enabled: true,
  },

  eslintConfig: {
    setup: false,
  },

  content: {
    api: {
      baseURL: '/api/cms',
    },
  },

  hooks: {
    'nitro:build:before': (nitro: Nitro) => {
      nitro.options.moduleSideEffects.push('reflect-metadata')
    }
  },

  tailwindcss: {
    config: {
      plugins: [tailwindTypography, daisyui],
    },
  },
})
