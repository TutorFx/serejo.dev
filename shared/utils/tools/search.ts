/**
 * @fileoverview Schemas e tipos das ferramentas de IA de busca híbrida (vetorial + lexical RRF) e de
 * chunks adjacentes no acervo do portfólio de Gabriel Serejo.
 * As implementações (`execute`) ficam apenas no servidor, em `server/utils/chat/tools.ts`.
 */

import type { PageCollections } from '@nuxt/content'
import { z } from 'zod'
import type { Tool, UIToolInvocation } from 'ai'
import {
  SEARCH_DIRECTIONS_ARRAY,
  DEFAULT_SEARCH_DIRECTION,
  SEARCH_CONFIG,
} from '../constants/chat.constants'

export type SearchCollectionName = keyof PageCollections | 'routes'

/** Tamanho máximo da consulta enviada à busca (embedding + full-text) */
export const SEARCH_QUERY_MAX_CHARS = 300

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
  collection: z
    .custom<SearchCollectionName>()
    .describe('Nome da coleção do Nuxt Content ou rotas.'),
  index: z.number().int().describe('Índice posicional do chunk dentro do documento.'),
  route: z
    .string()
    .nullable()
    .describe('Rota pública da página associada ao documento, se houver.'),
  content: z.string().describe('Conteúdo textual relevante extraído do chunk.'),
})

/** Tipo inferido do item de busca híbrida. */
export type HybridSearchResultItem = z.infer<typeof hybridSearchResultItemSchema>

/**
 * Schema de saída da ferramenta `searchContent`.
 */
export const hybridSearchOutputSchema = z.object({
  query: z.string().describe('Termo pesquisado.'),
  collection: z
    .custom<SearchCollectionName>()
    .nullable()
    .describe('Filtro de coleção aplicado, se houver.'),
  count: z.number().int().describe('Quantidade de resultados encontrados.'),
  results: z
    .array(hybridSearchResultItemSchema)
    .describe('Lista de chunks classificados por relevância RRF.'),
})

/** Tipo inferido do resultado da busca híbrida. */
export type HybridSearchOutput = z.infer<typeof hybridSearchOutputSchema>

/**
 * Schema de entrada da ferramenta `searchContent`.
 */
export const hybridSearchInputSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1)
    .max(SEARCH_QUERY_MAX_CHARS)
    .describe(
      'Termo ou pergunta a ser pesquisada no acervo de conhecimento (ex: "experiência com LLMs", "artigos sobre agentes", "projetos em Nuxt", "páginas do site").'
    ),
  collection: z
    .enum(['blog', 'education', 'history', 'projects', 'pages', 'routes'])
    .optional()
    .describe(
      'Filtro opcional para limitar a busca a uma coleção específica do Nuxt Content ou rotas estáticas.'
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(SEARCH_CONFIG.maxLimit)
    .optional()
    .default(SEARCH_CONFIG.defaultLimit)
    .describe('Quantidade máxima de resultados relevantes a retornar (padrão: 5).'),
  includeAdjacent: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'Se true, anexa os chunks adjacentes (imediatamente anterior e posterior) a cada resultado para contexto enriquecido.'
    ),
  distinctByDocument: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      'Se true (padrão), deduplica e seleciona no máximo 1 chunk por documento para garantir diversidade nos resultados.'
    ),
})

/** Tipo inferido dos parâmetros de entrada da busca híbrida. */
export type HybridSearchInput = z.infer<typeof hybridSearchInputSchema>

/** Tipo de invocação de UI para a ferramenta `searchContent`. */
export type HybridSearchUIToolInvocation = UIToolInvocation<
  Tool<HybridSearchInput, HybridSearchOutput>
>

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
  context: z
    .string()
    .nullable()
    .optional()
    .describe('Contexto contextualizado do chunk, se disponível.'),
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
  previous: z
    .array(adjacentChunkItemSchema)
    .describe('Lista de chunks anteriores em ordem sequencial.'),
  next: z
    .array(adjacentChunkItemSchema)
    .describe('Lista de chunks posteriores em ordem sequencial.'),
  combinedContent: z
    .string()
    .describe('Conteúdo concatenado contínuo unindo anterior, alvo e posterior.'),
})

/** Tipo inferido do resultado de chunks adjacentes. */
export type AdjacentSearchOutput = z.infer<typeof adjacentSearchOutputSchema>

/**
 * Schema de entrada da ferramenta `adjacentContent`.
 */
export const adjacentSearchInputSchema = z.object({
  documentId: z
    .string()
    .min(1)
    .max(512)
    .describe('ID do documento retornado em uma busca anterior (ex: "blog/pt-BR/meu-post.md").'),
  chunkIndex: z
    .number()
    .int()
    .min(1)
    .describe('Índice do chunk de referência (1-indexed) a partir do qual buscar adjacências.'),
  direction: searchDirectionSchema
    .optional()
    .default(DEFAULT_SEARCH_DIRECTION)
    .describe(
      'Direção da busca: "previous" (anteriores), "next" (seguintes) ou "both" (ambos). Padrão é "both".'
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(SEARCH_CONFIG.maxAdjacentLimit)
    .optional()
    .default(SEARCH_CONFIG.defaultAdjacentLimit)
    .describe('Quantidade de chunks vizinhos a retornar em cada direção especificada (padrão: 2).'),
})

/** Tipo inferido dos parâmetros de entrada de busca adjacente. */
export type AdjacentSearchInput = z.infer<typeof adjacentSearchInputSchema>

/** Tipo de invocação de UI para a ferramenta `adjacentContent`. */
export type AdjacentSearchUIToolInvocation = UIToolInvocation<
  Tool<AdjacentSearchInput, AdjacentSearchOutput>
>
