/**
 * Per-instance fallback store used when Redis is unavailable.
 * Serverless instances are short-lived, so this only offers partial protection:
 * callers apply stricter limits while degraded instead of failing open.
 */

interface Entry {
  value: number
  expiresAt: number
}

const MAX_ENTRIES = 10_000

export class MemoryStore {
  private entries = new Map<string, Entry>()

  constructor(private readonly now: () => number = Date.now) {}

  private get(key: string): Entry | undefined {
    const entry = this.entries.get(key)
    if (entry && entry.expiresAt <= this.now()) {
      this.entries.delete(key)
      return undefined
    }
    return entry
  }

  private evictIfFull() {
    if (this.entries.size < MAX_ENTRIES) return

    const now = this.now()
    for (const [key, entry] of this.entries) {
      if (entry.expiresAt <= now) this.entries.delete(key)
    }

    // Still full: drop the oldest insertions
    let overflow = this.entries.size - MAX_ENTRIES + 1
    for (const key of this.entries.keys()) {
      if (overflow-- <= 0) break
      this.entries.delete(key)
    }
  }

  /** Increments a counter; the TTL starts on the first increment of the window */
  increment(key: string, amount: number, ttlMs: number): { value: number, ttlMs: number } {
    const entry = this.get(key)
    if (entry) {
      entry.value += amount
      return { value: entry.value, ttlMs: entry.expiresAt - this.now() }
    }

    this.evictIfFull()
    this.entries.set(key, { value: amount, expiresAt: this.now() + ttlMs })
    return { value: amount, ttlMs }
  }

  peek(key: string): number {
    return this.get(key)?.value ?? 0
  }

  /** Sets the key only if it does not exist. Returns true when it was set */
  setIfAbsent(key: string, ttlMs: number): boolean {
    if (this.get(key)) return false

    this.evictIfFull()
    this.entries.set(key, { value: 1, expiresAt: this.now() + ttlMs })
    return true
  }

  set(key: string, ttlMs: number) {
    this.evictIfFull()
    this.entries.set(key, { value: 1, expiresAt: this.now() + ttlMs })
  }

  delete(key: string) {
    this.entries.delete(key)
  }

  clear() {
    this.entries.clear()
  }
}
