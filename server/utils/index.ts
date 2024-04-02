export function extractStrings(obj: { [key: string]: any }): string[] {
  const strings: string[] = []

  function traverse(obj: { [key: string]: any }): void {
    for (const key in obj) {
      if (typeof obj[key] === 'string')
        strings.push(obj[key])
      else if (typeof obj[key] === 'object' && obj[key] !== null)
        traverse(obj[key])
    }
  }

  traverse(obj)
  return strings
}
