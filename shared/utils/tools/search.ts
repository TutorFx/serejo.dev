/**
 * @fileoverview Ferramentas de IA para busca híbrida (vetorial + lexical RRF) e navegação
 * de chunks adjacentes no acervo de conteúdo do portfólio de Gabriel Serejo.
 */

import type { PageCollections } from '@nuxt/content'
import { tool } from 'ai'
import { z } from 'zod/v4'
import type { UIToolInvocation } from 'ai'
import {
  SEARCH_DIRECTIONS_ARRAY,
  DEFAULT_SEARCH_DIRECTION,
  SEARCH_CONFIG,
} from '../constants/chat.constants'

export type SearchCollectionName = keyof PageCollections | 'routes'

// ============================================================================
// 1. SCHEMAS DE BUSCA HÍBRIDA (HYBRID SEARCH)
// ============================================================================

/**
 * Schema Zod v4 para a direção de busca adjacente.
 */
export const searchDirectionSchema = z.enum(SEARCH_DIRECTIONS_ARRAY)

/**
 * Schema de um item individual de resultado da busca híbrida.
 */
export const hybridSearchResultItemSchema = z.object({
  documentId: z.string().describe('Identificador do documento no Nuxt Content ou rotas estáticas.'),
  collection: z.custom<SearchCollectionName>().describe('Nome da coleção do Nuxt Content ou rotas.'),
  index: z.number().int().describe('Índice posicional do chunk dentro do documento.'),
  route: z.string().nullable().describe('Rota pública da página associada ao documento, se houver.'),
  content: z.string().describe('Conteúdo textual relevante extraído do chunk.'),
})

/** Tipo inferido do item de busca híbrida. */
export type HybridSearchResultItem = z.infer<typeof hybridSearchResultItemSchema>

/**
 * Schema de saída da ferramenta `searchContent`.
 */
export const hybridSearchOutputSchema = z.object({
  query: z.string().describe('Termo pesquisado.'),
  collection: z.custom<SearchCollectionName>().nullable().describe('Filtro de coleção aplicado, se houver.'),
  count: z.number().int().describe('Quantidade de resultados encontrados.'),
  results: z.array(hybridSearchResultItemSchema).describe('Lista de chunks classificados por relevância RRF.'),
})

/** Tipo inferido do resultado da busca híbrida. */
export type HybridSearchOutput = z.infer<typeof hybridSearchOutputSchema>

/**
 * Schema de entrada da ferramenta `searchContent`.
 */
export const hybridSearchInputSchema = z.object({
  query: z.string().min(1).describe('Termo ou pergunta a ser pesquisada no acervo de conhecimento (ex: "experiência com LLMs", "artigos sobre agentes", "projetos em Nuxt", "páginas do site").'),
  collection: z.enum(['blog', 'education', 'history', 'projects', 'pages', 'routes']).optional().describe('Filtro opcional para limitar a busca a uma coleção específica do Nuxt Content ou rotas estáticas.'),
  limit: z.number().int().min(1).max(SEARCH_CONFIG.maxLimit).optional().default(SEARCH_CONFIG.defaultLimit).describe('Quantidade máxima de resultados relevantes a retornar (padrão: 5).'),
  includeAdjacent: z.boolean().optional().default(false).describe('Se true, anexa os chunks adjacentes (imediatamente anterior e posterior) a cada resultado para contexto enriquecido.'),
  distinctByDocument: z.boolean().optional().default(true).describe('Se true (padrão), deduplica e seleciona no máximo 1 chunk por documento para garantir diversidade nos resultados.'),
})

/** Tipo inferido dos parâmetros de entrada da busca híbrida. */
export type HybridSearchInput = z.infer<typeof hybridSearchInputSchema>

/**
 * Schema de validação do contexto para ferramentas de busca.
 */
export const searchToolContextSchema = z.object({
  chatId: z.string().min(1).optional().describe('Identificador opcional do chat.'),
})

/** Tipo inferido do contexto das ferramentas de busca. */
export type SearchToolContext = z.infer<typeof searchToolContextSchema>

/** Tipo de invocação de UI para a ferramenta `searchContent`. */
export type HybridSearchUIToolInvocation = UIToolInvocation<ReturnType<typeof hybridSearchTool>>

/**
 * Cria a ferramenta de IA para busca híbrida (vetorial + lexical com RRF) no portfólio.
 *
 * @param args - Contexto opcional contendo `chatId` validado via Zod.
 * @returns Ferramenta configurada para registro no Vercel AI SDK.
 */
export const hybridSearchTool = (args?: SearchToolContext) => {
  const { chatId } = searchToolContextSchema.parse(args ?? {})

  return tool({
    description: 'Realiza uma busca híbrida inteligente (vetorial densa + busca lexical textual combinadas via Reciprocal Rank Fusion) no acervo de conteúdos, artigos, projetos, histórico e páginas do portfólio de Gabriel Serejo. Suporta filtro opcional por coleção do Nuxt Content.',
    inputSchema: hybridSearchInputSchema,
    outputSchema: hybridSearchOutputSchema,
    strict: true,
    execute: async ({ query, collection, limit, includeAdjacent, distinctByDocument }) => {
      const start = performance.now()
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
}

// ============================================================================
// 2. SCHEMAS DE CHUNKS ADJACENTES (ADJACENT CONTENT)
// ============================================================================

/**
 * Schema de um chunk vizinho.
 */
export const adjacentChunkItemSchema = z.object({
  id: z.string().describe('ID do chunk.'),
  index: z.number().int().describe('Índice posicional do chunk.'),
  documentId: z.string().describe('ID do documento pai.'),
  content: z.string().describe('Conteúdo textual do chunk.'),
  context: z.string().nullable().optional().describe('Contexto contextualizado do chunk, se disponível.'),
})

/** Tipo inferido de um chunk vizinho. */
export type AdjacentChunkItem = z.infer<typeof adjacentChunkItemSchema>

/**
 * Schema do chunk central alvo da consulta.
 */
export const targetChunkItemSchema = adjacentChunkItemSchema.extend({
  collection: z.custom<SearchCollectionName>().describe('Coleção do documento.'),
  context: z.string().nullable().describe('Contexto contextualizado do chunk.'),
  route: z.string().nullable().describe('Rota da página.'),
})

/** Tipo inferido do chunk central alvo. */
export type TargetChunkItem = z.infer<typeof targetChunkItemSchema>

/**
 * Schema de saída da ferramenta `adjacentContent`.
 */
export const adjacentSearchOutputSchema = z.object({
  targetChunk: targetChunkItemSchema.nullable().describe('Chunk central consultado.'),
  previous: z.array(adjacentChunkItemSchema).describe('Lista de chunks anteriores em ordem sequencial.'),
  next: z.array(adjacentChunkItemSchema).describe('Lista de chunks posteriores em ordem sequencial.'),
  combinedContent: z.string().describe('Conteúdo concatenado contínuo unindo anterior, alvo e posterior.'),
})

/** Tipo inferido do resultado de chunks adjacentes. */
export type AdjacentSearchOutput = z.infer<typeof adjacentSearchOutputSchema>

/**
 * Schema de entrada da ferramenta `adjacentContent`.
 */
export const adjacentSearchInputSchema = z.object({
  documentId: z.string().min(1).describe('ID do documento retornado em uma busca anterior (ex: "blog/pt-BR/meu-post.md").'),
  chunkIndex: z.number().int().min(1).describe('Índice do chunk de referência (1-indexed) a partir do qual buscar adjacências.'),
  direction: searchDirectionSchema.optional().default(DEFAULT_SEARCH_DIRECTION).describe('Direção da busca: "previous" (anteriores), "next" (seguintes) ou "both" (ambos). Padrão é "both".'),
  limit: z.number().int().min(1).max(SEARCH_CONFIG.maxAdjacentLimit).optional().default(SEARCH_CONFIG.defaultAdjacentLimit).describe('Quantidade de chunks vizinhos a retornar em cada direção especificada (padrão: 2).'),
})

/** Tipo inferido dos parâmetros de entrada de busca adjacente. */
export type AdjacentSearchInput = z.infer<typeof adjacentSearchInputSchema>

/** Tipo de invocação de UI para a ferramenta `adjacentContent`. */
export type AdjacentSearchUIToolInvocation = UIToolInvocation<ReturnType<typeof adjacentSearchTool>>

/**
 * Cria a ferramenta de IA para recuperação de chunks adjacentes e expansão de contexto.
 *
 * @param args - Contexto opcional contendo `chatId` validado via Zod.
 * @returns Ferramenta configurada para registro no Vercel AI SDK.
 */
export const adjacentSearchTool = (args?: SearchToolContext) => {
  const { chatId } = searchToolContextSchema.parse(args ?? {})

  return tool({
    description: 'Busca os chunks adjacentes (anteriores e/ou posteriores) de um trecho/documento para expandir o contexto de leitura para frente e para trás.',
    inputSchema: adjacentSearchInputSchema,
    outputSchema: adjacentSearchOutputSchema,
    strict: true,
    execute: async ({ documentId, chunkIndex, direction, limit }) => {
      const start = performance.now()
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
}
