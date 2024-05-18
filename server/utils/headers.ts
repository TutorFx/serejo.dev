import type { EventHandlerRequest, H3Event } from 'h3'

export function getVercelHeaders(event: H3Event<EventHandlerRequest>) {
  const host = getHeader(event, 'host')
  const cityHeader = getHeader(event, 'x-vercel-ip-city')
  const city = cityHeader ? decodeURIComponent(cityHeader) : '-'
  const countryHeader = getHeader(event, 'x-vercel-ip-country')
  const country = countryHeader ? decodeURIComponent(countryHeader) : '-'
  const stateHeader = getHeader(event, 'x-vercel-ip-country-region')
  const state = stateHeader ? decodeURIComponent(stateHeader) : '-'
  const ipHeader = getHeader(event, 'x-forwarded-for')
  const ip = ipHeader ? ipHeader.split(',')[0] : '-'
  const locale = tryCookieLocale(event, { lang: '', name: 'i18n_redirected' })
  return {
    host,
    city,
    state,
    ip,
    locale,
    country,
  }
}
