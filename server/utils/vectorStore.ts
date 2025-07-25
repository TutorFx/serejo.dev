import process from 'node:process'
import { UpstashVectorStore } from '@langchain/community/vectorstores/upstash'
import { Index } from '@upstash/vector'
import { OllamaEmbeddings } from '@langchain/ollama'
import { defu } from 'defu'

let _vectorStore: UpstashVectorStore

export function useVectorStore(vectorStoreParams?: Partial<{ embeddingModel: string }>) {
  const params = defu(vectorStoreParams, { embeddingModel: 'bge-m3:latest' })

  if (!_vectorStore) {
    const indexWithEmbeddings = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    })

    const model = new OllamaEmbeddings({
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: params.embeddingModel,
    })

    _vectorStore = new UpstashVectorStore(model, {
      index: indexWithEmbeddings,
    })
  }
  return _vectorStore
}

let _index: Index

export function useUpstashIndex() {
  if (!_index) {
    _index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
    })
  }

  return _index
}
