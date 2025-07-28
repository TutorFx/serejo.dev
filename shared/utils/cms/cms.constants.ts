const LANG_PT_BR = 'pt-BR'
const LANG_EN_US = 'en-US'

export const LOCALE_KEYS = {
  PT_BR: LANG_PT_BR,
  EN_US: LANG_EN_US,
} as const

export const D_LOCALE = LOCALE_KEYS.EN_US

export const LOCALES = Object.values(LOCALE_KEYS)

type CmsRoute = `/${string}`;

type CmsRouteList = {
  experience: CmsRoute;
  post: CmsRoute;
}

export const CMS_ROUTE_LIST: Record<(typeof LOCALES)[number], CmsRouteList> = {
  [LOCALE_KEYS.EN_US]: {
    experience: '/i-worked-in/[item]',
    post: '/post/[item]',
  },
  [LOCALE_KEYS.PT_BR]: {
    experience: '/trabalhei-na/[item]',
    post: '/post/[item]',
  },
}