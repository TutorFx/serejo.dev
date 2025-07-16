export * from './ai/tool.functions'

export function processCmsPath(locale: LocaleKey, stem: string) {
  const splittedStem = stem.split('/')
  const index = splittedStem.findIndex((item) => item === locale)

  splittedStem.splice(0, index + 1)

  return splittedStem.join('-')
}

export function truncateString(str: string, maxLength: number, ending = '') {
  if (str.length > maxLength) {
    const effectiveMaxLength = maxLength - ending.length; 
    return str.slice(0, effectiveMaxLength) + ending;
  }
  return str;
}