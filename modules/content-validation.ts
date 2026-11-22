import { relative } from 'node:path'
import { consola } from 'consola'
import { defineNuxtModule } from 'nuxt/kit'
import { z } from 'zod/v4'

// Nuxt Content only uses the collection schemas to generate tables and types: it never checks the
// files against them. This does, so the runtime can trust the generated `Collections` types
export default defineNuxtModule({
  meta: { name: 'content-validation' },
  setup(_options, nuxt) {
    const logger = consola.withTag('content-validation')
    const invalidFiles = new Set<string>()
    let initialPassDone = false

    // content.config.ts calls `defineCollection`, which only works once Nuxt Content is set up: a
    // static import would run it too early, so the schemas are imported when the first file arrives
    let schemas: Promise<typeof import('../content.config').collectionSchemas> | undefined
    const loadSchemas = () =>
      (schemas ??= import('../content.config').then(config => config.collectionSchemas))

    nuxt.hook('content:file:afterParse', async ({ file, content, collection }) => {
      const collectionSchemas = await loadSchemas()
      const schema = collectionSchemas[collection.name as keyof typeof collectionSchemas]
      const result = schema?.safeParse(content)

      if (!result || result.success) {
        invalidFiles.delete(file.id)
        return
      }

      const path = file.path ? relative(nuxt.options.rootDir, file.path) : file.id
      const message = `Invalid frontmatter in ${path}\n${z.prettifyError(result.error)}`

      invalidFiles.add(file.id)
      logger.error(message)

      // On the initial pass Nuxt Content catches this, leaves the file out and does not cache it, so
      // the file is checked again on the next run. Later (dev file watcher) nothing would catch it
      if (!initialPassDone) throw new Error(message)
    })

    nuxt.hook('ready', () => {
      initialPassDone = true
    })

    nuxt.hook('build:before', () => {
      if (nuxt.options.dev || invalidFiles.size === 0) return

      throw new Error(
        `${invalidFiles.size} content file(s) do not match their collection schema (see the errors above)`
      )
    })
  },
})
