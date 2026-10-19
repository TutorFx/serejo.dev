import tailwindcss from '@tailwindcss/vite'

import {
  APP_DESCRIPTION,
  APP_NAME,
  PHONE_NUMBER,
  SCHEDULE,
  SITE_URL,
} from './shared/utils/constants'

import * as pkg from './package.json'

const isDev = Boolean(import.meta.dev)

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@comark/nuxt',
    'nuxt-auth-utils',
    'nuxt-csurf',
    'nuxt-gtag',
    '@nuxt/ui',
  ],

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

  css: [
    '~/assets/css/tailwind.css',
  ],

  site: {
    name: APP_NAME,
    description: APP_DESCRIPTION,
    url: SITE_URL,
  },

  colorMode: {
    classSuffix: '',
    storage: 'localStorage',
  },

  content: {
    experimental: {
      // Use Node's built-in `node:sqlite` (Node >= 22.5): the better-sqlite3 native addon bundled by
      // Vercel failed to load on the Node 24 runtime ("Module did not self-register")
      sqliteConnector: 'native',
    },
    build: {
      transformers: [
        '~~/transformers/reading-time.ts',
      ],
      markdown: {},
    },
    preview: {
      api: 'https://api.nuxt.studio',
    },
  },

  runtimeConfig: {
    cohere: {
      apiKey: '',
    },
    gemini: {
      apiKey: '',
    },
    google: {
      // Dedicated calendar where the agent writes meeting requests
      calendarId: '',
      // Main calendar, read as free/busy only (NUXT_GOOGLE_AVAILABILITY_CALENDAR_ID)
      availabilityCalendarId: '',
      clientEmail: '',
      privateKey: '',
    },
    // Kill switches (NUXT_CHAT_ENABLED / NUXT_CHAT_SCHEDULING_ENABLED); Redis flags act without a redeploy
    chat: {
      enabled: true,
      schedulingEnabled: true,
    },
    redisUrl: '',
    databaseUrl: '',
    cronSecret: '',
    public: {
      version: pkg.version,
      name: pkg.name,
      dev: isDev,
      url: SITE_URL,
      PHONE_NUMBER,
      SCHEDULE,
      gtag: {
        id: '',
      },
    },
  },

  routeRules: {
    // Keep `/` server-rendered (no prerender/ISR/SWR): the root locale redirect runs on the server,
    // and a cached English `/` would be switched to pt-BR on the client, breaking hydration.
    // `/pt-BR/inicio` is not prerendered either: the CSRF cookie and meta tag only exist in server-rendered
    // HTML, and the chat popup (mounted on every page) needs them to send messages
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
        // Anti-clickjacking for the meeting approval button; Nuxt Studio previews the site in an iframe
        'Content-Security-Policy': 'frame-ancestors \'self\' https://nuxt.studio',
      },
    },
    // CSRF exemptions: requests made by modules that cannot send the token
    // - Nuxt Content v3 queries collections with `POST /__nuxt_content/<collection>/query` (client and SSR)
    // - nuxt-auth-utils logs out with `DELETE /api/_auth/session`
    // - GitHub OAuth callback
    '/__nuxt_content/**': { csurf: false },
    '/api/_auth/**': { csurf: false },
    '/sso/**': { csurf: false },
    // Playground and unfinished pages: keep them out of search engines (X-Robots-Tag) and the sitemap
    '/test': { robots: false },
    '/pt-BR/test': { robots: false },
    '/projects': { robots: false },
    '/pt-BR/projetos': { robots: false },
    // Not worth indexing: the chat page has almost no static content (and shared chats are visitor content);
    // `/resume` is the print version of `/curriculum`
    '/chat': { robots: false },
    '/chat/**': { robots: false },
    '/pt-BR/chat': { robots: false },
    '/pt-BR/chat/**': { robots: false },
    '/resume': { robots: false },
    '/pt-BR/resume': { robots: false },
    // Old locale prefix still linked externally (404 in Search Console)
    '/en': { redirect: { to: '/', statusCode: 301 } },
    '/en/**': { redirect: { to: '/**', statusCode: 301 } },
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  compatibilityDate: '2026-05-08',

  nitro: {
    vercel: {
      functions: {
        maxDuration: 800,
      },
      config: {},
    },
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      '* * * * *': [
        'db:feed-contextual-chunks',
        'db:feed-embedding-chunks',
      ],
    },
    // The tests join the server TS project (aliases and auto-import types); test/nuxt belongs to the app.
    // Paths are relative to .nuxt/, where tsconfig.server.json is generated
    typescript: {
      tsConfig: {
        include: ['../test/**/*'],
        exclude: ['../test/nuxt/**/*'],
      },
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      // https://github.com/nuxt-modules/mdc/issues/394
      include: ['debug'],
    },
  },

  // CSRF: every mutation needs the `csrf-token` header (from the meta tag rendered by SSR).
  // Production needs NUXT_CSURF_ENCRYPT_SECRET (exactly 32 ASCII chars, e.g. `openssl rand -base64 22`):
  // otherwise a random secret is generated at build time and tokens break on every deploy
  csurf: {
    methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  googleFonts: {
    families: {
      'Space Grotesk': [300, 400, 700],
      'Mochiy Pop One': true,
    },
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
    // The root redirect relies on server-side detection (`nitroContextDetection`); prerendering `/`
    // or changing `redirectOn` reintroduces the hydration mismatch
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
    },
    experimental: {
      localeDetector: 'localeDetector.ts',
      nitroContextDetection: true,
    },
  },

  icon: {
    mode: 'css',
    cssLayer: 'base',
  },

  ogImage: {
    defaults: {},
  },

  seo: {
    // The pt-BR prefix has uppercase letters: a lowercased canonical (`/pt-br/...`) pointed to a different URL
    // than the sitemap, the links and the hreflang alternates (`/pt-BR/...`), so Google skipped those pages.
    // Other casings of the prefix are redirected by `server/middleware/locale-prefix.ts`
    canonicalLowercase: false,
  },

  sitemap: {
    sources: [
      '/api/__sitemap__/urls',
    ],
    // Localized paths are listed explicitly: the routes are defined with `defineI18nRoute`, not `i18n.pages`
    exclude: ['/test', '/pt-BR/test', '/projects', '/pt-BR/projetos', '/chat', '/pt-BR/chat', '/resume', '/pt-BR/resume'],
  },
})
