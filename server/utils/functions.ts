export function truncateString(str: string, maxLength: number, ending = '') {
  if (str.length > maxLength) {
    const effectiveMaxLength = maxLength - ending.length
    return str.slice(0, effectiveMaxLength) + ending
  }
  return str
}
