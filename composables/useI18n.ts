export function useCountry() {
  const { locale } = useI18n()
  return (locale.value.split('-').at(-1) ?? locale.value).toLowerCase()
}

export function useLocale() {
  const { locale } = useI18n()
  return (locale.value.split('-').at(0) ?? locale.value).toLowerCase()
}

export function useFlag(countryLang: string) {
  const countryCode = countryLang.split('-').at(-1)?.toLowerCase()

  if (!countryCode)
    throw createError({ statusCode: 404, statusMessage: `Invalid country lang: ${countryLang}` })

  return `circle-flags:${countryCode}`
}
