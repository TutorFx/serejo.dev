import { tz } from '@date-fns/tz'
import { format, formatDuration, intervalToDuration, parseISO } from 'date-fns'
import { enUS, ptBR } from 'date-fns/locale'

// date-fns v4 bug: each function expects a different Pick<Locale, ...>, and `options`
// is optional in Locale but required in those Picks. We derive the exact expected
// type from each function's parameters to avoid `any` and stay auto-updating.
type FormatLocale = NonNullable<Parameters<typeof format>[2]>['locale']
type FormatDurationLocale = NonNullable<Parameters<typeof formatDuration>[1]>['locale']
type DateFnsLocale = FormatLocale & FormatDurationLocale

export function getDateLocale(locale: LocaleKey): DateFnsLocale {
  return (
    {
      [LOCALE_KEYS.PT_BR]: ptBR,
      [LOCALE_KEYS.EN_US]: enUS,
    }[locale] ?? enUS
  ) as DateFnsLocale
}

export function getExtenseShift(seconds: number, localeKey: LocaleKey): string {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })

  return formatDuration(duration, {
    locale: getDateLocale(localeKey),
  })
}

export function formatCardDate(date: Date, localeKey: LocaleKey) {
  const pattern = localeKey === LOCALE_KEYS.EN_US ? 'MMM yyyy' : 'MMM, yyyy'
  return format(date, pattern, {
    locale: getDateLocale(localeKey),
  })
}

// `new TZDate(string, zone)` goes through `new Date(string)`, so an offset-less ISO string is read
// in the host's time zone (UTC on Vercel). This reads it as wall-clock time in `timeZone` instead.
export function parseInTimeZone(iso: string, timeZone: string) {
  return parseISO(iso, { in: tz(timeZone) })
}
