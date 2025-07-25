import { format, formatDuration, intervalToDuration } from 'date-fns'
import { enUS, ptBR } from 'date-fns/locale'

export function getDateLocale(locale: LocaleKey) {
  return {
    [LOCALE_KEYS.PT_BR]: ptBR,
    [LOCALE_KEYS.EN_US]: enUS,
  }[locale]
}

export function getExtenseShift(seconds: number, localeKey: LocaleKey): string {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })

  return formatDuration(duration, {
    locale: getDateLocale(localeKey),
  })
}

export function formatCardDate(date: Date, localeKey: LocaleKey) {
  return format(date, 'MMM, yyyy', {
    locale: getDateLocale(localeKey),
  })
}
