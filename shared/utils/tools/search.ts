import type { PageCollections } from '@nuxt/content'
import { tool } from 'ai'
import { z } from 'zod'
import type { UIToolInvocation } from 'ai'

export type SearchCollectionName = keyof PageCollections

export const searchDirectionSchema = z.enum(['both', 'previous', 'next'])
export type SearchDirection = z.infer<typeof searchDirectionSchema>

export const hybridSearchResultItemSchema = z.object({
  documentId: z.string(),
  collection: z.custom<SearchCollectionName>(),
  index: z.number().int(),
  route: z.string().nullable(),
  content: z.string(),
})
export type HybridSearchResultItem = z.infer<typeof hybridSearchResultItemSchema>

export const hybridSearchOutputSchema = z.object({
  query: z.string(),
  collection: z.custom<SearchCollectionName>().nullable(),
  count: z.number().int(),
  results: z.array(hybridSearchResultItemSchema),
})
export type HybridSearchOutput = z.infer<typeof hybridSearchOutputSchema>

export const adjacentChunkItemSchema = z.object({
  id: z.string(),
  index: z.number().int(),
  documentId: z.string(),
  content: z.string(),
  context: z.string().nullable().optional(),
})
export type AdjacentChunkItem = z.infer<typeof adjacentChunkItemSchema>

export const targetChunkItemSchema = adjacentChunkItemSchema.extend({
  collection: z.custom<SearchCollectionName>(),
  context: z.string().nullable(),
  route: z.string().nullable(),
})
export type TargetChunkItem = z.infer<typeof targetChunkItemSchema>

export const adjacentSearchOutputSchema = z.object({
  targetChunk: targetChunkItemSchema.nullable(),
  previous: z.array(adjacentChunkItemSchema),
  next: z.array(adjacentChunkItemSchema),
  combinedContent: z.string(),
})
export type AdjacentSearchOutput = z.infer<typeof adjacentSearchOutputSchema>

export const hybridSearchInputSchema = z.object({
  query: z.string().describe('Termo ou pergunta a ser pesquisada no acervo de conhecimento (ex: "experiência com LLMs", "artigos sobre agentes", "projetos em Nuxt").'),
  collection: z.enum(['blog', 'education', 'history', 'projects', 'pages']).optional().describe('Filtro opcional para limitar a busca a uma coleção específica do Nuxt Content.'),
  limit: z.number().int().min(1).max(10).optional().describe('Quantidade máxima de resultados relevantes a retornar (padrão: 5).'),
  includeAdjacent: z.boolean().optional().describe('Se true, anexa os chunks adjacentes (imediatamente anterior e posterior) a cada resultado para contexto enriquecido.'),
  distinctByDocument: z.boolean().optional().describe('Se true (padrão), deduplica e seleciona no máximo 1 chunk por documento para garantir diversidade nos resultados.'),
})
export type HybridSearchInput = z.infer<typeof hybridSearchInputSchema>

export const adjacentSearchInputSchema = z.object({
  documentId: z.string().describe('ID do documento retornado em uma busca anterior (ex: "blog/pt-BR/meu-post.md").'),
  chunkIndex: z.number().int().min(1).describe('Índice do chunk de referência (1-indexed) a partir do qual buscar adjacências.'),
  direction: searchDirectionSchema.optional().describe('Direção da busca: "previous" (para trás/anteriores), "next" (para frente/seguintes) ou "both" (ambos). Padrão é "both".'),
  limit: z.number().int().min(1).max(5).optional().describe('Quantidade de chunks vizinhos a retornar em cada direção especificada (padrão: 2).'),
})
export type AdjacentSearchInput = z.infer<typeof adjacentSearchInputSchema>

export type HybridSearchUIToolInvocation = UIToolInvocation<ReturnType<typeof hybridSearchTool>>

export const hybridSearchTool = (args?: { chatId?: string }) => tool({
  description: 'Realiza uma busca híbrida inteligente (vetorial densa + busca lexical textual combinadas via Reciprocal Rank Fusion) no acervo de conteúdos, artigos, projetos, histórico e páginas do portfólio de Gabriel Serejo. Suporta filtro opcional por coleção do Nuxt Content.',
  inputSchema: hybridSearchInputSchema,
  execute: async ({ query, collection, limit, includeAdjacent, distinctByDocument }) => {
    const start = performance.now()
    const chatId = args?.chatId
    const res = await $fetch<HybridSearchOutput>('/api/search/hybrid', {
      method: 'POST',
      body: {
        query,
        collection,
        limit,
        includeAdjacent,
        distinctByDocument,
        chatId,
      },
    })
    const duration = (performance.now() - start).toFixed(2)
    console.info(`[Tool:searchContent] Query "${query}" finished in ${duration}ms (${res.count} results)`)
    return res
  },
})

export type AdjacentSearchUIToolInvocation = UIToolInvocation<ReturnType<typeof adjacentSearchTool>>

export const adjacentSearchTool = (args?: { chatId?: string }) => tool({
  description: 'Busca os chunks adjacentes (anteriores e/ou posteriores) de um trecho/documento para expandir o contexto de leitura para frente e para trás.',
  inputSchema: adjacentSearchInputSchema,
  execute: async ({ documentId, chunkIndex, direction, limit }) => {
    const start = performance.now()
    const chatId = args?.chatId
    const res = await $fetch<AdjacentSearchOutput>('/api/search/adjacent', {
      method: 'POST',
      body: {
        documentId,
        chunkIndex,
        direction,
        limit,
        chatId,
      },
    })
    const duration = (performance.now() - start).toFixed(2)
    console.info(`[Tool:getAdjacentChunks] Fetched adjacent for "${documentId}" in ${duration}ms`)
    return res
  },
})
