import type { MinimarkNode, MinimarkTree, PageCollections } from '@nuxt/content'
import { CMS_ROUTE_LIST, LOCALE_KEYS } from './cms.constants'

export type ContentDocument = PageCollections[keyof PageCollections]

export function traverseNodes(nodes: MinimarkNode[]): string {
  let text = ''

  for (const node of nodes) {
    if (typeof node === 'string') {
      text += `${node} `
    } else if (Array.isArray(node)) {
      const filhos = node.slice(2) as MinimarkNode[]
      text += traverseNodes(filhos)
    }
  }

  return text
}

export function extractTreeText(tree: MinimarkTree): string {
  const textoCompleto = traverseNodes(tree.value)
  return textoCompleto.trim().replace(/\s+/g, ' ')
}

export function textToSeconds(text: string): number {
  return text.split(' ').length * 0.5
}

export function getLocaleFromPath<T extends Record<string, string>>(
  path: string,
  localesObject: T,
): T[keyof T] | null {
  const availableLocales = Object.values(localesObject)
  const foundLocale = availableLocales.find(locale => path.includes(locale))
  return (foundLocale as T[keyof T]) || null
}

export function processCmsPath(locale: string, stem: string): string {
  const splittedStem = stem.split('/')
  const index = splittedStem.findIndex(item => item === locale)

  splittedStem.splice(0, index + 1)

  return splittedStem.join('-')
}

export function extractDocumentRoute(
  collectionName: keyof PageCollections | string,
  doc: ContentDocument,
): string | null {
  // Apenas as coleções 'blog', 'history' e 'pages' possuem páginas dinâmicas individuais no app.
  // 'projects', 'education' e outras coleções não possuem rotas próprias individuais (retornam null).
  const locale = getLocaleFromPath(doc.id, LOCALE_KEYS) || LOCALE_KEYS.EN_US
  const localePrefix = locale === LOCALE_KEYS.EN_US ? '' : `/${locale}`

  const slug = 'slug' in doc && typeof doc.slug === 'string' && doc.slug ? doc.slug : null
  const stem = 'stem' in doc && typeof doc.stem === 'string' && doc.stem ? doc.stem : null
  const itemIdentifier = slug || (stem ? processCmsPath(locale, stem) : null)

  if (collectionName === 'blog') {
    if (itemIdentifier) {
      return `${localePrefix}${CMS_ROUTE_LIST[locale].post.replace('[item]', itemIdentifier)}`
    }
    return null
  }

  if (collectionName === 'history') {
    if (itemIdentifier) {
      return `${localePrefix}${CMS_ROUTE_LIST[locale].experience.replace('[item]', itemIdentifier)}`
    }
    return null
  }

  if (collectionName === 'pages') {
    if ('path' in doc && typeof doc.path === 'string' && doc.path) {
      const cleanPath = doc.path.startsWith('/') ? doc.path : `/${doc.path}`
      return `${localePrefix}${cleanPath.startsWith('/pages') ? cleanPath : `/pages${cleanPath}`}`
    }
    return null
  }

  return null
}
