import type { PageCollections } from '@nuxt/content'
import type { H3Event } from 'h3'
import { tables } from '#content/manifest'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { queryCollection } from '@nuxt/content/server'
import { consola } from 'consola'
import { inArray, sql } from 'drizzle-orm'
import { hash } from 'ohash'
import {
  extractDocumentContent,
  extractDocumentRoute,
  getStaticRouteDocuments,
} from '#shared/utils/functions'
import type { ContentDocument } from '#shared/utils/types'

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
})

export default defineNitroPlugin(async (_nitro) => {
  if (import.meta.prerender) {
    return
  }

  const config = useRuntimeConfig()
  if (!config.databaseUrl) {
    return
  }

  const logger = consola.withTag('ai-ingestion')
  const db = useDrizzle()

  try {
    const collectionNames = Object.keys(tables).filter(
      name => name !== 'info'
    ) as Array<keyof PageCollections>

    const collectionsData = await Promise.all(
      collectionNames.map(async (collection) => {
        const documents = await queryCollection(undefined as unknown as H3Event, collection).all()
        return documents.map(doc => ({
          doc: doc as ContentDocument,
          collection: collection as string,
        }))
      })
    )

    const staticRouteDocs = await getStaticRouteDocuments()
    const staticDocs = staticRouteDocs.map(doc => ({
      doc: doc as ContentDocument,
      collection: 'routes',
    }))

    const allDocuments = [...collectionsData.flat(), ...staticDocs]

    if (allDocuments.length > 0) {
      const rows = allDocuments.map(({ doc, collection }) => ({
        id: doc.id,
        collection,
        route: extractDocumentRoute(collection, doc),
        hashMd5: 'hashMd5' in doc && typeof doc.hashMd5 === 'string' ? doc.hashMd5 : hash(doc),
      }))

      const modifiedDocuments = await db
        .insert(schema.document)
        .values(rows)
        .onConflictDoUpdate({
          target: schema.document.id,
          set: {
            collection: sql`excluded.collection`,
            route: sql`excluded.route`,
            hashMd5: sql`excluded.hash_md5`,
          },
          setWhere: sql`${schema.document.hashMd5} is distinct from excluded.hash_md5 or ${schema.document.route} is distinct from excluded.route or ${schema.document.collection} is distinct from excluded.collection`,
        })
        .returning()

      if (modifiedDocuments.length > 0) {
        logger.info(`Detected ${modifiedDocuments.length} new/modified document(s). Processing chunks...`)

        const docMap = new Map(allDocuments.map(({ doc }) => [doc.id, doc]))
        const modifiedIds = modifiedDocuments.map(doc => doc.id)

        // Limpa chunks antigos dos documentos que foram modificados
        await db.delete(schema.documentChunks).where(
          inArray(schema.documentChunks.documentId, modifiedIds)
        )

        const chunkRows: Array<typeof schema.documentChunks.$inferInsert> = []

        for (const modDoc of modifiedDocuments) {
          const fullDoc = docMap.get(modDoc.id)
          if (!fullDoc) {
            continue
          }

          const rawText = extractDocumentContent(modDoc.collection, fullDoc)
          if (!rawText.trim()) {
            continue
          }

          const textChunks = await splitter.splitText(rawText)

          for (const [index, chunkText] of textChunks.entries()) {
            chunkRows.push({
              id: `${modDoc.id}#chunk-${index}`,
              index: index + 1,
              documentId: modDoc.id,
              content: chunkText,
            })
          }

          logger.log(`  - [${modDoc.id}] Generated ${textChunks.length} chunk(s)`)
        }

        if (chunkRows.length > 0) {
          await db.insert(schema.documentChunks).values(chunkRows)
          logger.success(`Successfully saved ${chunkRows.length} chunk(s) to database.`)

          if (!import.meta.prerender) {
            await runTask('db:feed-contextual-chunks')
            await runTask('db:feed-embedding-chunks')
          }
        }
      } else {
        logger.info('No document changes detected.')
        if (!import.meta.prerender) {
          await runTask('db:feed-contextual-chunks')
          await runTask('db:feed-embedding-chunks')
        }
      }
    }
  } catch (error) {
    logger.error('Failed to process Nuxt Content documents:', error)
  }
})
