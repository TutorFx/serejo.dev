export function useCountry() {
  const { locale } = useI18n()
  return (locale.value.split('-').at(-1) ?? locale.value).toLowerCase()
}

export function useLocale() {
    const { locale } = useI18n()
    return (locale.value.split('-').at(0) ?? locale.value).toLowerCase()
}