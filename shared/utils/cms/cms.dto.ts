import type { Collections } from '@nuxt/content'
import type { LocaleKey } from './cms'
import { formatCardDate, getExtenseShift } from '../time/time.functions'
import { processCmsPath } from './cms.functions'

// What the content endpoints send: the collection item as Nuxt Content types it (so a new frontmatter
// field needs no change here) plus the fields that are formatted on the server. The DTO types are
// inferred from these functions

type Translate = (
  key: string,
  named: Record<string, unknown>,
  options: { locale: LocaleKey }
) => string

type LocalizedEntry = Collections['blog' | 'history' | 'education']

// Leaves out the columns Nuxt Content keeps for its own use (`__hash__` is not even in its types)
function withoutInternalColumns<T extends LocalizedEntry>(item: T) {
  const { meta, seo, navigation, extension, __hash__, ...rest } = item as T & { __hash__?: string }

  return rest
}

function toReadingTime(
  { locale, readingTimeInSeconds }: Pick<LocalizedEntry, 'locale' | 'readingTimeInSeconds'>,
  t: Translate
) {
  return t('time.reading_time', { time: getExtenseShift(readingTimeInSeconds, locale) }, { locale })
}

function toPeriod(
  { locale, start, end }: Pick<Collections['history' | 'education'], 'locale' | 'start' | 'end'>,
  t: Translate
) {
  return {
    start: formatCardDate(new Date(start), locale),
    end: end ? formatCardDate(new Date(end), locale) : t('time.the_moment', {}, { locale }),
  }
}

export function toBlogPostDto(item: Collections['blog'], t: Translate) {
  return {
    ...withoutInternalColumns(item),
    // Route param of the post when it has no slug
    path: processCmsPath(item.locale, item.stem),
    createdAt: new Date(item.createdAt).toISOString(),
    readingTimeString: toReadingTime(item, t),
  }
}

export type BlogPostDto = ReturnType<typeof toBlogPostDto> & {
  // Route param (slug || path) of the same post in each locale it exists in
  alternates: Partial<Record<LocaleKey, string>>
}

export type BlogPostsDto = Omit<ReturnType<typeof toBlogPostDto>, 'body'>

export function toExperienceDto(item: Collections['history'], t: Translate) {
  return {
    ...withoutInternalColumns(item),
    // Route param of the experience
    path: processCmsPath(item.locale, item.stem),
    ...toPeriod(item, t),
    readingTimeString: toReadingTime(item, t),
  }
}

export type ExperienceDto = ReturnType<typeof toExperienceDto>

export type ExperiencesDto = Omit<ExperienceDto, 'body'> & { body: ExperienceDto['body'] | null }

export function toEducationDto(item: Collections['education'], t: Translate) {
  const { locale } = item

  return {
    ...withoutInternalColumns(item),
    path: processCmsPath(locale, item.stem),
    ...toPeriod(item, t),
    date: item.end
      ? t(
          'curriculum.graduated_in',
          { date: formatCardDate(new Date(item.end), locale) },
          { locale }
        )
      : t('curriculum.in_progress', {}, { locale }),
  }
}

export type EducationDto = ReturnType<typeof toEducationDto>
