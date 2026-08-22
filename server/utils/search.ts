import type { PageCollections } from '@nuxt/content'
import { embed } from 'ai'
import { consola } from 'consola'
import { and, asc, desc, eq, isNotNull, or, sql } from 'drizzle-orm'
import { z } from 'zod/v4'
import { useAi } from './ai'
import { schema } from './drizzle'

const logger = consola.withTag('retrieval')

export type NuxtCollectionName = keyof PageCollections

export const searchResultChunkSchema = z.object({
  id: z.string(),
  index: z.number().int(),
  documentId: z.string(),
  collection: z.custom<NuxtCollectionName>(),
  content: z.string(),
  context: z.string().nullable(),
  route: z.string().nullable(),
  vectorRank: z.number().int().optional(),
  lexicalRank: z.number().int().optional(),
  rrfScore: z.number(),
  rerankScore: z.number().optional(),
  adjacent: z.object({
    previous: z.array(z.object({ id: z.string(), index: z.number().int(), content: z.string() })),
    next: z.array(z.object({ id: z.string(), index: z.number().int(), content: z.string() })),
    expandedContent: z.string(),
  }).optional(),
})
export type SearchResultChunk = z.infer<typeof searchResultChunkSchema>

export const hybridSearchOptionsSchema = z.object({
  query: z.string().min(1, 'A query não pode estar vazia'),
  collection: z.custom<NuxtCollectionName>().optional(),
  limit: z.number().int().min(1).max(20).optional().default(5),
  includeAdjacent: z.boolean().optional().default(false),
  k: z.number().int().optional().default(60),
  distinctByDocument: z.boolean().optional().default(true),
  maxChunksPerDocument: z.number().int().min(1).max(5).optional().default(1),
})
export type HybridSearchOptions = z.input<typeof hybridSearchOptionsSchema>

export const adjacentSearchOptionsSchema = z.object({
  documentId: z.string().min(1, 'documentId é obrigatório'),
  chunkIndex: z.number().int().min(1, 'chunkIndex deve ser maior ou igual a 1'),
  direction: z.enum(['both', 'previous', 'next']).optional().default('both'),
  limit: z.number().int().min(1).max(10).optional().default(2),
})
export type AdjacentSearchOptions = z.input<typeof adjacentSearchOptionsSchema>

export const adjacentSearchResultSchema = z.object({
  targetChunk: z.object({
    id: z.string(),
    index: z.number().int(),
    documentId: z.string(),
    collection: z.custom<NuxtCollectionName>(),
    content: z.string(),
    context: z.string().nullable(),
    route: z.string().nullable(),
  }).nullable(),
  previous: z.array(adjacentChunkItemSchema),
  next: z.array(adjacentChunkItemSchema),
  combinedContent: z.string(),
})
export type AdjacentSearchResult = z.infer<typeof adjacentSearchResultSchema>

export const cohereRerankResponseSchema = z.object({
  id: z.string(),
  results: z.array(z.object({
    index: z.number().int(),
    relevance_score: z.number(),
  })),
  meta: z.object({
    api_version: z.object({
      version: z.string(),
    }).optional(),
    billed_units: z.object({
      search_units: z.number(),
    }).optional(),
  }).optional(),
})
export type CohereRerankResponse = z.infer<typeof cohereRerankResponseSchema>

function getCollectionFilter(collection?: NuxtCollectionName | string) {
  if (!collection) return undefined
  return eq(schema.document.collection, collection)
}

/**
 * Extrai o identificador base do documento (removendo idioma ou sufixos equivalentes para evitar duplicatas em EN/PT)
 */
export function getBaseDocumentKey(documentId: string): string {
  return documentId
    .replace(/(pt-BR|en-US)\//g, '')
    .replace(/\.md$/, '')
}

/**
 * Filtra e seleciona os melhores chunks preservando a diversidade de documentos.
 */
export function deduplicateByDocument(
  results: SearchResultChunk[],
  options: { limit?: number, maxChunksPerDocument?: number, distinctByBaseDocument?: boolean } = {}
): SearchResultChunk[] {
  const limit = options.limit ?? 5
  const maxChunks = options.maxChunksPerDocument ?? 1
  const distinctBase = options.distinctByBaseDocument ?? true

  const documentCountMap = new Map<string, number>()
  const selected: SearchResultChunk[] = []

  for (const chunk of results) {
    const key = distinctBase ? getBaseDocumentKey(chunk.documentId) : chunk.documentId
    const currentCount = documentCountMap.get(key) ?? 0

    if (currentCount < maxChunks) {
      selected.push(chunk)
      documentCountMap.set(key, currentCount + 1)

      if (selected.length >= limit) {
        break
      }
    }
  }

  return selected
}

/**
 * Gera o embedding denso de 2000 dimensões para a query do usuário utilizando gemini-embedding-2
 */
export async function generateQueryEmbedding(query: string, aiInstance?: ReturnType<typeof useAi>): Promise<number[]> {
  const start = performance.now()
  const ai = aiInstance ?? useAi()
  const { embedding } = await embed({
    model: ai.embeddingModel,
    value: query,
    providerOptions: {
      google: {
        outputDimensionality: 2000,
      },
    },
  })
  const duration = (performance.now() - start).toFixed(2)
  logger.info(`[Embedding] Generated dense embedding for "${query.slice(0, 40)}" in ${duration}ms`)
  return embedding
}

/**
 * Executa busca vetorial densa com pgvector utilizando distância de cosseno (<=>)
 */
export async function executeVectorSearch(
  db: ReturnType<typeof useDrizzle>,
  embedding: number[],
  options: { collection?: string, limit?: number } = {}
) {
  const start = performance.now()
  const candidateLimit = Math.max((options.limit || 5) * 4, 20)
  const collectionFilter = getCollectionFilter(options.collection)

  const distanceSql = sql<number>`(${schema.documentChunks.embedding} <=> ${JSON.stringify(embedding)}::vector)`

  const conditions = [isNotNull(schema.documentChunks.embedding)]
  if (collectionFilter) {
    conditions.push(collectionFilter)
  }

  const results = await db
    .select({
      id: schema.documentChunks.id,
      index: schema.documentChunks.index,
      documentId: schema.documentChunks.documentId,
      collection: schema.document.collection,
      content: schema.documentChunks.content,
      context: schema.documentChunks.context,
      route: schema.document.route,
      distance: distanceSql,
    })
    .from(schema.documentChunks)
    .leftJoin(schema.document, eq(schema.documentChunks.documentId, schema.document.id))
    .where(and(...conditions))
    .orderBy(asc(distanceSql))
    .limit(candidateLimit)

  const duration = (performance.now() - start).toFixed(2)
  logger.info(`[Vector Search] pgvector cosine query returned ${results.length} candidate(s) in ${duration}ms`)

  return results.map((row, idx) => ({
    ...row,
    vectorRank: idx + 1,
  }))
}

/**
 * Executa busca lexical / full-text esparsa com ranking do PostgreSQL (ts_rank_cd e ILIKE)
 */
export async function executeLexicalSearch(
  db: ReturnType<typeof useDrizzle>,
  query: string,
  options: { collection?: string, limit?: number } = {}
) {
  const start = performance.now()
  const candidateLimit = Math.max((options.limit || 5) * 4, 20)
  const collectionFilter = getCollectionFilter(options.collection)

  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    return []
  }

  const tsVector = sql`to_tsvector('simple', coalesce(${schema.documentChunks.context}, '') || ' ' || ${schema.documentChunks.content})`
  const tsQuery = sql`plainto_tsquery('simple', ${trimmedQuery})`

  const lexicalScore = sql<number>`(
    ts_rank_cd(${tsVector}, ${tsQuery}) +
    CASE WHEN ${schema.documentChunks.content} ILIKE ${'%' + trimmedQuery + '%'} THEN 0.5 ELSE 0 END +
    CASE WHEN ${schema.documentChunks.context} ILIKE ${'%' + trimmedQuery + '%'} THEN 0.3 ELSE 0 END
  )`

  const textMatchCondition = sql`(${tsVector} @@ ${tsQuery} OR ${schema.documentChunks.content} ILIKE ${'%' + trimmedQuery + '%'} OR ${schema.documentChunks.context} ILIKE ${'%' + trimmedQuery + '%'})`

  const conditions = [textMatchCondition]
  if (collectionFilter) {
    conditions.push(collectionFilter)
  }

  const results = await db
    .select({
      id: schema.documentChunks.id,
      index: schema.documentChunks.index,
      documentId: schema.documentChunks.documentId,
      collection: schema.document.collection,
      content: schema.documentChunks.content,
      context: schema.documentChunks.context,
      route: schema.document.route,
      score: lexicalScore,
    })
    .from(schema.documentChunks)
    .leftJoin(schema.document, eq(schema.documentChunks.documentId, schema.document.id))
    .where(and(...conditions))
    .orderBy(desc(lexicalScore))
    .limit(candidateLimit)

  const duration = (performance.now() - start).toFixed(2)
  logger.info(`[Lexical Search] PostgreSQL text query returned ${results.length} candidate(s) in ${duration}ms`)

  return results.map((row, idx) => ({
    ...row,
    lexicalRank: idx + 1,
  }))
}

/**
 * Combina rankings vetoriais e lexicais utilizando Reciprocal Rank Fusion (RRF)
 * Score RRF(d) = sum( 1 / (k + rank) )
 */
export function reciprocalRankFusion<
  V extends { id: string, index: number, documentId: string, collection: string | null, content: string, context: string | null, route: string | null, vectorRank: number },
  L extends { id: string, index: number, documentId: string, collection: string | null, content: string, context: string | null, route: string | null, lexicalRank: number },
>(
  vectorResults: V[],
  lexicalResults: L[],
  options: { k?: number, limit?: number } = {}
): SearchResultChunk[] {
  const k = options.k ?? 60
  const limit = options.limit ?? 5

  const chunkMap = new Map<string, SearchResultChunk>()

  for (const v of vectorResults) {
    const score = 1 / (k + v.vectorRank)
    chunkMap.set(v.id, {
      id: v.id,
      index: v.index,
      documentId: v.documentId,
      collection: (v.collection ?? 'pages') as NuxtCollectionName,
      content: v.content,
      context: v.context,
      route: v.route,
      vectorRank: v.vectorRank,
      rrfScore: score,
    })
  }

  for (const l of lexicalResults) {
    const score = 1 / (k + l.lexicalRank)
    const existing = chunkMap.get(l.id)

    if (existing) {
      existing.lexicalRank = l.lexicalRank
      existing.rrfScore += score
      if (!existing.collection && l.collection) {
        existing.collection = l.collection as NuxtCollectionName
      }
    } else {
      chunkMap.set(l.id, {
        id: l.id,
        index: l.index,
        documentId: l.documentId,
        collection: (l.collection ?? 'pages') as NuxtCollectionName,
        content: l.content,
        context: l.context,
        route: l.route,
        lexicalRank: l.lexicalRank,
        rrfScore: score,
      })
    }
  }

  const sorted = Array.from(chunkMap.values()).sort((a, b) => b.rrfScore - a.rrfScore)
  return sorted.slice(0, limit)
}

/**
 * Re-ranqueia semanticamente candidatos utilizando a API Cohere Rerank v3.5
 */
export async function rerankWithCohere(
  query: string,
  candidates: SearchResultChunk[],
  options: { apiKey: string, topN?: number, model?: string }
): Promise<SearchResultChunk[]> {
  const start = performance.now()
  const { apiKey, topN = candidates.length, model = 'rerank-v3.5' } = options

  if (!apiKey || candidates.length === 0) {
    return candidates.slice(0, topN)
  }

  const documents = candidates.map(chunk =>
    chunk.context ? `${chunk.context}\n\n${chunk.content}` : chunk.content
  )

  const response = await $fetch<CohereRerankResponse>('https://api.cohere.com/v2/rerank', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      model,
      query,
      documents,
      top_n: topN,
    },
  })

  const reranked: SearchResultChunk[] = []

  for (const item of response.results) {
    const candidate = candidates[item.index]
    if (candidate) {
      reranked.push({
        ...candidate,
        rerankScore: item.relevance_score,
      })
    }
  }

  const duration = (performance.now() - start).toFixed(2)
  logger.info(`[Cohere Rerank] Re-ranked ${candidates.length} candidate(s) down to ${reranked.length} in ${duration}ms`)

  return reranked
}

/**
 * Busca chunks adjacentes (anteriores e/ou posteriores) de um determinado documento e índice em 1 única query
 */
export async function getAdjacentChunks(
  db: ReturnType<typeof useDrizzle>,
  options: AdjacentSearchOptions
): Promise<AdjacentSearchResult> {
  const start = performance.now()
  const { documentId, chunkIndex, direction = 'both', limit = 2 } = options

  const minIndex = (direction === 'previous' || direction === 'both') ? Math.max(1, chunkIndex - limit) : chunkIndex
  const maxIndex = (direction === 'next' || direction === 'both') ? chunkIndex + limit : chunkIndex

  const allChunks = await db
    .select({
      id: schema.documentChunks.id,
      index: schema.documentChunks.index,
      documentId: schema.documentChunks.documentId,
      collection: schema.document.collection,
      content: schema.documentChunks.content,
      context: schema.documentChunks.context,
      route: schema.document.route,
    })
    .from(schema.documentChunks)
    .leftJoin(schema.document, eq(schema.documentChunks.documentId, schema.document.id))
    .where(
      and(
        eq(schema.documentChunks.documentId, documentId),
        sql`${schema.documentChunks.index} >= ${minIndex} AND ${schema.documentChunks.index} <= ${maxIndex}`
      )
    )
    .orderBy(asc(schema.documentChunks.index))

  const targetChunk = allChunks.find(c => c.index === chunkIndex) ?? null
  const previous = allChunks.filter(c => c.index < chunkIndex)
  const next = allChunks.filter(c => c.index > chunkIndex)
  const combinedContent = allChunks.map(c => c.content).join('\n\n')

  const duration = (performance.now() - start).toFixed(2)
  logger.info(`[Adjacent Chunks] Fetched ${allChunks.length} neighbor chunk(s) for ${documentId}#${chunkIndex} in ${duration}ms`)

  return {
    targetChunk: targetChunk
      ? {
        ...targetChunk,
        collection: (targetChunk.collection ?? 'pages') as NuxtCollectionName,
      }
      : null,
    previous,
    next,
    combinedContent,
  }
}

/**
 * Executa a busca híbrida completa (Embedding + Vetorial + Lexical + RRF + Re-ranking Cohere Opcional + Deduplicação + Adjacências)
 */
export async function performHybridSearch(
  db: ReturnType<typeof useDrizzle>,
  aiInstance: ReturnType<typeof useAi>,
  options: HybridSearchOptions,
  runtimeConfigInput?: { cohereApiKey?: string }
): Promise<SearchResultChunk[]> {
  const totalStart = performance.now()
  const { query, collection, limit = 5, includeAdjacent = false, k = 60, distinctByDocument = true, maxChunksPerDocument = 1 } = options

  logger.info(`[Hybrid Search:START] query="${query}" | collection=${collection || 'all'} | limit=${limit}`)

  let cohereApiKey = runtimeConfigInput?.cohereApiKey
  if (!cohereApiKey) {
    try {
      cohereApiKey = useRuntimeConfig().cohere?.apiKey as string | undefined
    } catch {
      cohereApiKey = process.env.NUXT_COHERE_API_KEY || process.env.COHERE_API_KEY
    }
  }
  const isCohereAvailable = Boolean(cohereApiKey && cohereApiKey.trim())

  // Busca candidatos adicionais do RRF para o re-ranking e a deduplicação selecionarem os melhores documentos distintos
  const rrfLimit = Math.max(limit * 4, 20)

  // Executa embedding + busca vetorial e busca lexical em paralelo
  const parallelStart = performance.now()
  const [vectorResults, lexicalResults] = await Promise.all([
    (async () => {
      try {
        const queryEmbedding = await generateQueryEmbedding(query, aiInstance)
        return await executeVectorSearch(db, queryEmbedding, { collection, limit: rrfLimit })
      } catch (err) {
        logger.error('Vector search error in performHybridSearch:', err)
        return []
      }
    })(),
    (async () => {
      try {
        return await executeLexicalSearch(db, query, { collection, limit: rrfLimit })
      } catch (err) {
        logger.error('Lexical search error in performHybridSearch:', err)
        return []
      }
    })(),
  ])
  const parallelDuration = (performance.now() - parallelStart).toFixed(2)

  const rrfStart = performance.now()
  let fusedResults = reciprocalRankFusion(vectorResults, lexicalResults, { k, limit: rrfLimit })
  const rrfDuration = (performance.now() - rrfStart).toFixed(2)

  // Re-ranking transparente no servidor caso cohereApiKey esteja presente
  let rerankDuration = '0.00'
  if (isCohereAvailable && fusedResults.length > 0) {
    const rerankStart = performance.now()
    try {
      fusedResults = await rerankWithCohere(query, fusedResults, {
        apiKey: cohereApiKey!,
        topN: rrfLimit,
      })
      rerankDuration = (performance.now() - rerankStart).toFixed(2)
    } catch (err) {
      logger.warn('Cohere rerank failed or unavailable, falling back to RRF rankings:', err)
    }
  }

  // Deduplicação e seleção de chunks distintos por documento
  if (distinctByDocument) {
    fusedResults = deduplicateByDocument(fusedResults, {
      limit,
      maxChunksPerDocument,
      distinctByBaseDocument: true,
    })
  } else {
    fusedResults = fusedResults.slice(0, limit)
  }

  // Busca adjacente em 1 única query batch caso includeAdjacent seja true
  let adjacentDuration = '0.00'
  if (includeAdjacent && fusedResults.length > 0) {
    const adjacentStart = performance.now()
    const conditions = fusedResults.map(chunk =>
      sql`(${schema.documentChunks.documentId} = ${chunk.documentId} AND ${schema.documentChunks.index} BETWEEN ${Math.max(1, chunk.index - 1)} AND ${chunk.index + 1})`
    )

    const allNeighborChunks = await db
      .select({
        id: schema.documentChunks.id,
        index: schema.documentChunks.index,
        documentId: schema.documentChunks.documentId,
        content: schema.documentChunks.content,
      })
      .from(schema.documentChunks)
      .where(or(...conditions))
      .orderBy(asc(schema.documentChunks.index))

    for (const chunk of fusedResults) {
      const docNeighbors = allNeighborChunks.filter(n => n.documentId === chunk.documentId)
      const prev = docNeighbors.filter(n => n.index === chunk.index - 1)
      const next = docNeighbors.filter(n => n.index === chunk.index + 1)
      const expanded = [
        ...prev.map(p => p.content),
        chunk.content,
        ...next.map(n => n.content),
      ].join('\n\n')

      chunk.adjacent = {
        previous: prev,
        next,
        expandedContent: expanded,
      }
    }
    adjacentDuration = (performance.now() - adjacentStart).toFixed(2)
  }

  const totalDuration = (performance.now() - totalStart).toFixed(2)
  logger.success(`[Hybrid Search:FINISH] Returned ${fusedResults.length} chunk(s) in ${totalDuration}ms (Parallel vector+lexical: ${parallelDuration}ms, RRF: ${rrfDuration}ms${isCohereAvailable ? `, Cohere: ${rerankDuration}ms` : ''}${includeAdjacent ? `, Adjacent: ${adjacentDuration}ms` : ''})`)

  return fusedResults
}
