import process from 'node:process'
import { Index } from '@upstash/vector'

let _index: Index

export function useUpstashIndex() {
  if (!_index) {
    _index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    })
  }

  return _index
}
