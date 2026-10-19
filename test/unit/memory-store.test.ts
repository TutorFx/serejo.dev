import { describe, expect, it } from 'vitest'
import { MemoryStore } from '../../server/utils/security/memory-store'

function createStore() {
  let now = 1_000_000
  const store = new MemoryStore(() => now)
  const advance = (ms: number) => {
    now += ms
  }
  return { store, advance }
}

describe('MemoryStore', () => {
  it('counts within a window and resets after it expires', () => {
    const { store, advance } = createStore()

    expect(store.increment('k', 1, 1000).value).toBe(1)
    expect(store.increment('k', 1, 1000).value).toBe(2)
    expect(store.increment('k', 5, 1000).value).toBe(7)

    advance(1000)
    expect(store.peek('k')).toBe(0)
    expect(store.increment('k', 1, 1000).value).toBe(1)
  })

  it('keeps the TTL of the first increment', () => {
    const { store, advance } = createStore()

    store.increment('k', 1, 1000)
    advance(400)
    expect(store.increment('k', 1, 1000).ttlMs).toBe(600)
  })

  it('setIfAbsent only succeeds once while the key lives', () => {
    const { store, advance } = createStore()

    expect(store.setIfAbsent('lock', 500)).toBe(true)
    expect(store.setIfAbsent('lock', 500)).toBe(false)

    advance(500)
    expect(store.setIfAbsent('lock', 500)).toBe(true)

    store.delete('lock')
    expect(store.setIfAbsent('lock', 500)).toBe(true)
  })
})
