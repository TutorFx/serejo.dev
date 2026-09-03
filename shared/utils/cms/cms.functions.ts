import type { MinimarkNode, MinimarkTree, PageCollections } from '@nuxt/content'
import type { ContentDocument } from './cms'
import { CMS_ROUTE_LIST, LOCALE_KEYS } from './cms.constants'
import {
  blogSchemaWithBody,
  educationWithBodySchema,
  historyWithBodySchema,
  projectSchema,
} from './cms.schemas'

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
  collectionName: keyof PageCollections | 'routes' | string,
  doc: ContentDocument,
): string | null {
  if (collectionName === 'routes' || ('route' in doc && typeof doc.route === 'string')) {
    return 'route' in doc && typeof doc.route === 'string' ? doc.route : null
  }

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

export function extractDocumentContent(
  collectionName: keyof PageCollections | 'routes' | string,
  doc: ContentDocument,
): string {
  if (collectionName === 'routes' || ('content' in doc && typeof doc.content === 'string' && !('body' in doc))) {
    return 'content' in doc && typeof doc.content === 'string' ? doc.content : ''
  }

  if (collectionName === 'history') {
    const parsed = historyWithBodySchema.safeParse(doc)
    if (parsed.success) {
      const { title, org, location, start, end, delivered, body } = parsed.data
      const isCurrent = !end
      const status = isCurrent
        ? 'CURRENT ROLE / ACTIVE POSITION (Present)'
        : 'Past Experience / Completed'

      const startStr = start ? new Date(start).toISOString().split('T')[0] : ''
      const endStr = end ? new Date(end).toISOString().split('T')[0] : 'Present'

      const parts: string[] = [
        `# [Professional Experience] ${title} at ${org}`,
        `- Company/Organization: ${org}`,
        `- Role/Position: ${title}`,
        `- Location: ${location}`,
        `- Period: ${startStr} to ${endStr}`,
        `- Status: ${status}`,
      ]

      if (delivered && delivered.length > 0) {
        parts.push(`- Key Deliverables & Achievements:\n${delivered.map(d => `  * ${d}`).join('\n')}`)
      }

      if (body) {
        const bodyText = typeof body === 'string' ? body : extractTreeText(body as MinimarkTree)
        if (bodyText) {
          parts.push(`\n## Experience Details\n${bodyText}`)
        }
      }

      return parts.join('\n')
    }
  }

  if (collectionName === 'education') {
    const parsed = educationWithBodySchema.safeParse(doc)
    if (parsed.success) {
      const { title, org, start, end, body } = parsed.data
      const isCurrent = end ? new Date(end).getTime() > Date.now() : true
      const status = isCurrent ? 'In Progress' : 'Completed'
      const startStr = start ? new Date(start).toISOString().split('T')[0] : ''
      const endStr = end ? new Date(end).toISOString().split('T')[0] : 'Present'

      const parts: string[] = [
        `# [Academic Education] ${title} - ${org}`,
        `- Institution: ${org}`,
        `- Degree / Program: ${title}`,
        `- Period: ${startStr} to ${endStr}`,
        `- Status: ${status}`,
      ]

      if (body) {
        const bodyText = typeof body === 'string' ? body : extractTreeText(body as MinimarkTree)
        if (bodyText) {
          parts.push(`\n## Description\n${bodyText}`)
        }
      }

      return parts.join('\n')
    }
  }

  if (collectionName === 'blog') {
    const parsed = blogSchemaWithBody.safeParse(doc)
    if (parsed.success) {
      const { title, createdAt, body } = parsed.data
      const createdStr = createdAt ? new Date(createdAt).toISOString().split('T')[0] : ''
      const parts: string[] = [
        `# [Blog Post] ${title}`,
        `- Publication Date: ${createdStr}`,
      ]

      if ('description' in doc && typeof doc.description === 'string' && doc.description) {
        parts.push(`- Summary: ${doc.description}`)
      }

      if (body) {
        const bodyText = typeof body === 'string' ? body : extractTreeText(body as MinimarkTree)
        if (bodyText) {
          parts.push(`\n${bodyText}`)
        }
      }

      return parts.join('\n')
    }
  }

  if (collectionName === 'projects') {
    const parsed = projectSchema.safeParse(doc)
    const title = ('title' in doc && typeof doc.title === 'string' && doc.title) || 'Project'
    const parts: string[] = [`# [Project] ${title}`]

    if (parsed.success) {
      if (parsed.data.url) parts.push(`- Project URL: ${parsed.data.url}`)
      if (parsed.data.github) parts.push(`- GitHub Repository: ${parsed.data.github}`)
    }

    if ('description' in doc && typeof doc.description === 'string' && doc.description) {
      parts.push(doc.description)
    }

    if ('body' in doc && doc.body) {
      const bodyText = typeof doc.body === 'string' ? doc.body : extractTreeText(doc.body as MinimarkTree)
      if (bodyText) {
        parts.push(`\n${bodyText}`)
      }
    }

    return parts.join('\n')
  }

  // Fallback genérico para pages ou documentos não mapeados
  const parts: string[] = []

  if ('title' in doc && typeof doc.title === 'string' && doc.title) {
    parts.push(`# ${doc.title}`)
  }

  if ('description' in doc && typeof doc.description === 'string' && doc.description) {
    parts.push(doc.description)
  }

  if ('body' in doc && doc.body) {
    if (typeof doc.body === 'string') {
      parts.push(doc.body)
    } else if (typeof doc.body === 'object' && doc.body !== null && 'value' in doc.body) {
      parts.push(extractTreeText(doc.body as MinimarkTree))
    }
  }

  return parts.filter(Boolean).join('\n\n')
}
