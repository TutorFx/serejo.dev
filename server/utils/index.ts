export function extractStrings(obj: unknown): string[] {
  const strings: string[] = []

  function traverse(value: unknown): void {
    if (typeof value === 'string') {
      strings.push(value)
    } else if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        traverse((value as Record<string, unknown>)[key])
      }
    }
  }

  traverse(obj)
  return strings
}
