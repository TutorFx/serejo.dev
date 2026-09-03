import { hash } from 'ohash'
import enUS from '../../../i18n/locales/en-US'
import ptBR from '../../../i18n/locales/pt-BR'
import { LOCALE_KEYS, LOCALES } from '../cms/cms.constants'
import type { AppLocale, RouteMeta, StaticRouteDocument } from './routes.constants'

/**
 * Retorna a URL pública completa da rota estática para determinado locale,
 * considerando a estratégia prefix_except_default (en-US sem prefixo).
 */
export function getStaticRouteUrl(path: string, locale: AppLocale): string {
  if (locale === LOCALE_KEYS.EN_US) {
    return path
  }

  if (path === '/') {
    return `/${locale}`
  }

  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Constrói o texto formatado em Markdown para uma rota estática para indexação no RAG.
 */
export function getStaticRouteContentFromMeta(meta: RouteMeta, routeUrl: string, locale: AppLocale): string {
  const parts = [
    `# [Page / Route] ${meta.title}`,
    `- Page Route URL: ${routeUrl}`,
    `- Language / Locale: ${locale}`,
    `- Title: ${meta.title}`,
    `- Description: ${meta.description}`,
  ]

  if (meta.keywords) {
    parts.push(`- Keywords / Tags: ${meta.keywords}`)
  }

  if (meta.summary) {
    parts.push(`\n## Page Content & Overview\n${meta.summary}`)
  }

  return parts.join('\n')
}

/**
 * Gera dinamicamente a lista de todos os documentos de rotas estáticas
 * para todos os locales configurados diretamente a partir da API do i18n
 * da mesma forma que é feito no server/utils/chat.ts para o resume.
 */
export async function getStaticRouteDocuments(): Promise<StaticRouteDocument[]> {
  const documents: StaticRouteDocument[] = []

  const enMessages = (await enUS('en-US')) as { meta?: Record<string, RouteMeta> }
  const ptMessages = (await ptBR('pt-BR')) as { meta?: Record<string, RouteMeta> }

  const localeMessagesMap = {
    [LOCALE_KEYS.EN_US]: enMessages,
    [LOCALE_KEYS.PT_BR]: ptMessages,
  }

  const enMeta = enMessages.meta || {}
  const routeKeys = Object.keys(enMeta)

  for (const name of routeKeys) {
    for (const locale of LOCALES) {
      const messages = localeMessagesMap[locale]
      const meta = messages.meta?.[name]
      if (!meta) {
        continue
      }

      const path = meta.path
      const route = getStaticRouteUrl(path, locale)
      const content = getStaticRouteContentFromMeta(meta, route, locale)
      const id = `routes/${locale}/${name}`
      const keywords = meta.keywords || ''
      const summary = meta.summary || ''

      const payload = {
        id,
        collection: 'routes' as const,
        route,
        locale,
        name,
        title: meta.title,
        description: meta.description,
        keywords,
        summary,
        content,
      }

      documents.push({
        ...payload,
        hashMd5: hash(payload),
      })
    }
  }

  return documents
}
